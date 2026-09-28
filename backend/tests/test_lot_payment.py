import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.base import Base
from app.database.connection import get_db
from app.models.user import User, UserRole
from app.models.recycler import Recycler
from app.models.material import Material
from app.models.lot import Lot, LotStatus
from app.models.transaction import Transaction
from app.utils.security import hash_password, create_access_token


# Setup in-memory SQLite database for test suite execution
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine_test = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine_test)
    db = TestingSessionLocal()
    
    # Create test material
    mat = Material(
        id=1,
        name="Motherboards / PCBs",
        category="Circuit Boards",
        rate=450.0,
        unit="kg",
        co2_saved_per_kg=2.8
    )
    db.add(mat)

    # Create collector user
    collector = User(
        id=1,
        name="Test Collector",
        phone="9876543210",
        password_hash=hash_password("collector123"),
        role=UserRole.COLLECTOR,
    )
    db.add(collector)

    # Create recycler user 1
    recycler_user1 = User(
        id=2,
        name="Recycler One",
        phone="9876543211",
        email="recycler1@sahivalue.com",
        password_hash=hash_password("recycler123"),
        role=UserRole.RECYCLER,
    )
    db.add(recycler_user1)
    db.flush()

    recycler_profile1 = Recycler(
        id=1,
        user_id=2,
        facility_name="EcoRecycle Facility",
        authorization_number="AUTH-100",
        location="Mumbai"
    )
    db.add(recycler_profile1)

    # Create recycler user 2
    recycler_user2 = User(
        id=3,
        name="Recycler Two",
        phone="9876543212",
        email="recycler2@sahivalue.com",
        password_hash=hash_password("recycler123"),
        role=UserRole.RECYCLER,
    )
    db.add(recycler_user2)
    db.flush()

    recycler_profile2 = Recycler(
        id=2,
        user_id=3,
        facility_name="GreenPlanet Recyclers",
        authorization_number="AUTH-200",
        location="Pune"
    )
    db.add(recycler_profile2)

    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine_test)


client = TestClient(app)


def get_auth_header(user_id: int, role: str):
    token = create_access_token({"sub": str(user_id), "role": role})
    return {"Authorization": f"Bearer {token}"}


# -------------------------------------------------------------------
# TEST 1: Declared weight vs Verified weight payment calculation
# declared = 20, verified = 10, rate = 450 -> estimated = 9000, final = 4500
# -------------------------------------------------------------------
def test_lot_payment_calculation():
    collector_headers = get_auth_header(1, "COLLECTOR")
    recycler_headers = get_auth_header(2, "RECYCLER")

    # Collector creates lot with declared_weight = 20
    create_res = client.post(
        "/api/lots",
        json={"material_id": 1, "declared_weight": 20.0, "recycler_id": 1},
        headers=collector_headers
    )
    assert create_res.status_code == 201
    lot_data = create_res.json()
    assert lot_data["declared_weight"] == 20.0
    assert lot_data["rate"] == 450.0
    assert lot_data["estimated_value"] == 9000.0  # 20 * 450
    assert lot_data["status"] == "PENDING_ACCEPTANCE"
    assert lot_data["verified_weight"] is None
    assert lot_data["final_amount"] is None

    lot_id = lot_data["lot_id"]

    # Recycler accepts the lot first
    accept_res = client.post(
        f"/api/lots/{lot_id}/accept",
        headers=recycler_headers
    )
    assert accept_res.status_code == 200
    assert accept_res.json()["status"] == "ACCEPTED"

    # Recycler verifies weight = 10
    verify_res = client.post(
        f"/api/lots/{lot_id}/verify",
        json={"verified_weight": 10.0},
        headers=recycler_headers
    )
    assert verify_res.status_code == 200
    verified_data = verify_res.json()
    assert verified_data["verified_weight"] == 10.0
    assert verified_data["final_amount"] == 4500.0  # 10 * 450


# -------------------------------------------------------------------
# TEST 2: Changing declared weight after verification does NOT change final amount
# -------------------------------------------------------------------
def test_declared_weight_change_does_not_affect_final_amount():
    db = TestingSessionLocal()
    lot = Lot(
        lot_id="SV-2026-9999",
        collector_id=1,
        recycler_id=1,
        material_id=1,
        declared_weight=20.0,
        verified_weight=10.0,
        rate=450.0,
        estimated_value=9000.0,
        final_amount=4500.0,
        status=LotStatus.VERIFIED
    )
    db.add(lot)
    db.commit()

    # Mutate declared weight in DB
    lot.declared_weight = 50.0
    db.commit()
    db.refresh(lot)

    # Final amount MUST remain 4500.0
    assert lot.final_amount == 4500.0
    db.close()


# -------------------------------------------------------------------
# TEST 3: Client-provided final_amount must be ignored
# -------------------------------------------------------------------
def test_client_provided_final_amount_ignored():
    collector_headers = get_auth_header(1, "COLLECTOR")
    recycler_headers = get_auth_header(2, "RECYCLER")

    create_res = client.post(
        "/api/lots",
        json={
            "material_id": 1,
            "declared_weight": 20.0,
            "recycler_id": 1,
            "estimated_value": 999999.0,
            "final_amount": 999999.0
        },
        headers=collector_headers
    )
    assert create_res.status_code == 201
    lot_data = create_res.json()
    assert lot_data["estimated_value"] == 9000.0

    lot_id = lot_data["lot_id"]

    # Try sending client final_amount in verify payload
    verify_res = client.post(
        f"/api/lots/{lot_id}/verify",
        json={"verified_weight": 10.0, "final_amount": 999999.0, "rate": 1.0},
        headers=recycler_headers
    )
    assert verify_res.status_code == 200
    verified_data = verify_res.json()
    # Server recalculated final_amount = 10 * 450 = 4500.0
    assert verified_data["final_amount"] == 4500.0


# -------------------------------------------------------------------
# TEST 4: Collector cannot verify a lot
# -------------------------------------------------------------------
def test_collector_cannot_verify_lot():
    collector_headers = get_auth_header(1, "COLLECTOR")

    res = client.post(
        "/api/lots/SV-2026-0001/verify",
        json={"verified_weight": 10.0},
        headers=collector_headers
    )
    assert res.status_code == 403


# -------------------------------------------------------------------
# TEST 5: Recycler cannot verify another Recycler's lot
# -------------------------------------------------------------------
def test_recycler_cannot_verify_another_recyclers_lot():
    collector_headers = get_auth_header(1, "COLLECTOR")

    # Collector creates lot assigned to Recycler 1 (id=1)
    create_res = client.post(
        "/api/lots",
        json={"material_id": 1, "declared_weight": 20.0, "recycler_id": 1},
        headers=collector_headers
    )
    lot_id = create_res.json()["lot_id"]

    # Recycler 2 (user_id=3, recycler_id=2) attempts to verify Recycler 1's lot
    recycler2_headers = get_auth_header(3, "RECYCLER")
    verify_res = client.post(
        f"/api/lots/{lot_id}/verify",
        json={"verified_weight": 10.0},
        headers=recycler2_headers
    )
    assert verify_res.status_code == 403


# -------------------------------------------------------------------
# TEST 6: Unauthenticated users cannot access protected endpoints
# -------------------------------------------------------------------
def test_unauthenticated_access_denied():
    res = client.get("/api/lots")
    assert res.status_code == 401


# -------------------------------------------------------------------
# TEST 7: Passwords are not returned in API responses
# -------------------------------------------------------------------
def test_password_hash_not_returned():
    collector_headers = get_auth_header(1, "COLLECTOR")
    res = client.get("/api/auth/me", headers=collector_headers)
    assert res.status_code == 200
    user_data = res.json()
    assert "password" not in user_data
    assert "password_hash" not in user_data


# -------------------------------------------------------------------
# TEST 8: Duplicate transaction cannot be created for the same lot
# -------------------------------------------------------------------
def test_duplicate_transaction_prevented():
    collector_headers = get_auth_header(1, "COLLECTOR")
    recycler_headers = get_auth_header(2, "RECYCLER")

    create_res = client.post(
        "/api/lots",
        json={"material_id": 1, "declared_weight": 20.0, "recycler_id": 1},
        headers=collector_headers
    )
    lot_id = create_res.json()["lot_id"]

    client.post(
        f"/api/lots/{lot_id}/verify",
        json={"verified_weight": 10.0},
        headers=recycler_headers
    )

    # First completion
    complete1 = client.post(
        f"/api/lots/{lot_id}/complete",
        json={"payment_method": "UPI"},
        headers=recycler_headers
    )
    assert complete1.status_code == 200

    # Second completion must fail with 409 Conflict
    complete2 = client.post(
        f"/api/lots/{lot_id}/complete",
        json={"payment_method": "UPI"},
        headers=recycler_headers
    )
    assert complete2.status_code == 409


# -------------------------------------------------------------------
# TEST 9: Recycler acceptance, rejection, and dual acceptance protection
# -------------------------------------------------------------------
def test_lot_accept_reject_and_concurrency():
    collector_headers = get_auth_header(1, "COLLECTOR")
    recycler1_headers = get_auth_header(2, "RECYCLER")
    recycler2_headers = get_auth_header(3, "RECYCLER")

    # 1. Create a lot pending acceptance
    create_res = client.post(
        "/api/lots",
        json={"material_id": 1, "declared_weight": 15.0},
        headers=collector_headers
    )
    assert create_res.status_code == 201
    lot = create_res.json()
    assert lot["status"] == "PENDING_ACCEPTANCE"
    lot_id = lot["lot_id"]

    # 2. Recycler 1 accepts the lot
    accept_res = client.post(
        f"/api/lots/{lot_id}/accept",
        headers=recycler1_headers
    )
    assert accept_res.status_code == 200
    assert accept_res.json()["status"] == "ACCEPTED"
    assert accept_res.json()["recycler_id"] == 1

    # 3. Recycler 2 tries to accept the already-accepted lot -> must fail with 400 Bad Request
    dual_accept = client.post(
        f"/api/lots/{lot_id}/accept",
        headers=recycler2_headers
    )
    assert dual_accept.status_code == 400

    # 4. Test Rejection flow on a new lot
    create_res2 = client.post(
        "/api/lots",
        json={"material_id": 1, "declared_weight": 10.0},
        headers=collector_headers
    )
    lot_id2 = create_res2.json()["lot_id"]

    reject_res = client.post(
        f"/api/lots/{lot_id2}/reject",
        headers=recycler1_headers
    )
    assert reject_res.status_code == 200
    assert reject_res.json()["status"] == "REJECTED"

