import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, inspect

from app.config import settings
from app.database.base import Base
from app.database.connection import engine, SessionLocal
from app.models.material import Material
from app.models.price_history import PriceHistory
from app.routers import (
    auth_router,
    materials_router,
    recyclers_router,
    lots_router,
    transactions_router,
    earnings_router,
    ai_router,
)

logger = logging.getLogger("uvicorn.error")

REQUIRED_LOTSTATUS_ENUMS = {
    "PENDING_ACCEPTANCE",
    "ACCEPTED",
    "REJECTED",
    "AWAITING_HANDOVER",
    "HANDOVER_IN_PROGRESS",
}


def run_migrations_and_seed():
    """Idempotent DB migration, schema verification, and demo data seed mechanism.
    
    Ensures PostgreSQL enum values exist, lots.recycler_id is nullable, and table seeding runs safely.
    Fails fast if critical DB schema migration or verification fails.
    """
    logger.info("Starting database initialization and schema migration check...")

    try:
        # Create base tables if they don't exist
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        logger.error(f"Failed to create database tables: {e.__class__.__name__}")
        raise RuntimeError("Database initialization failed during table creation") from e

    # Apply PostgreSQL-specific DDL migrations if running on PostgreSQL
    if engine.dialect.name == "postgresql":
        logger.info("Applying PostgreSQL schema migration updates...")
        try:
            with engine.connect() as conn:
                autocommit_conn = conn.execution_options(isolation_level="AUTOCOMMIT")
                for val in REQUIRED_LOTSTATUS_ENUMS:
                    try:
                        autocommit_conn.execute(
                            text(f"ALTER TYPE lotstatus ADD VALUE IF NOT EXISTS '{val}';")
                        )
                    except Exception as ex:
                        logger.warning(
                            f"Notice adding enum value '{val}' to lotstatus: {ex.__class__.__name__}"
                        )

                try:
                    autocommit_conn.execute(
                        text("ALTER TABLE lots ALTER COLUMN recycler_id DROP NOT NULL;")
                    )
                except Exception as ex:
                    logger.warning(
                        f"Notice dropping NOT NULL on lots.recycler_id: {ex.__class__.__name__}"
                    )
        except Exception as e:
            logger.error(f"Failed to execute PostgreSQL schema migrations: {e.__class__.__name__}")
            raise RuntimeError("PostgreSQL schema migration failed") from e

    # Perform DB Schema Verification
    logger.info("Verifying database schema compliance...")
    try:
        if engine.dialect.name == "postgresql":
            with engine.connect() as conn:
                # 1. Verify Enum values in lotstatus
                res = conn.execute(
                    text(
                        "SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'lotstatus';"
                    )
                )
                existing_enums = {row[0] for row in res.fetchall()}
                missing_enums = REQUIRED_LOTSTATUS_ENUMS - existing_enums
                if missing_enums:
                    logger.error(
                        f"Database schema verification failed: missing lotstatus enum values: {sorted(missing_enums)}"
                    )
                    raise RuntimeError(
                        f"Database schema invalid: missing lotstatus enum values {sorted(missing_enums)}"
                    )

                # 2. Verify recycler_id is nullable
                res = conn.execute(
                    text(
                        "SELECT is_nullable FROM information_schema.columns WHERE table_name = 'lots' AND column_name = 'recycler_id';"
                    )
                )
                row = res.fetchone()
                if row and row[0].upper() != "YES":
                    logger.error("Database schema verification failed: lots.recycler_id is NOT NULL")
                    raise RuntimeError("Database schema invalid: lots.recycler_id must be nullable")
        else:
            # Inspection check for non-PostgreSQL engines (e.g. SQLite test DB)
            inspector = inspect(engine)
            if "lots" in inspector.get_table_names():
                columns = inspector.get_columns("lots")
                recycler_col = next((c for c in columns if c["name"] == "recycler_id"), None)
                if recycler_col and not recycler_col.get("nullable", True):
                    logger.error("Database schema verification failed: lots.recycler_id is NOT NULL")
                    raise RuntimeError("Database schema invalid: lots.recycler_id must be nullable")

        logger.info("Database schema verification passed successfully.")
    except RuntimeError:
        raise
    except Exception as e:
        logger.error(f"Error during schema verification: {e.__class__.__name__}")
        raise RuntimeError("Database schema verification check failed") from e

    # Seed demo materials if table is empty
    db = SessionLocal()
    try:
        existing_count = db.query(Material).count()
        if existing_count == 0:
            logger.info("Seeding initial demo materials and price history...")
            demo_materials = [
                Material(
                    name="Motherboards / PCBs",
                    category="Circuit Boards",
                    rate=450.0,
                    unit="kg",
                    description="High-value printed circuit boards from PCs, laptops, and servers.",
                    co2_saved_per_kg=2.8,
                ),
                Material(
                    name="Copper",
                    category="Metals",
                    rate=620.0,
                    unit="kg",
                    description="Clean copper wiring and components recovered from electronic waste.",
                    co2_saved_per_kg=4.5,
                ),
                Material(
                    name="Batteries",
                    category="Components",
                    rate=180.0,
                    unit="kg",
                    description="Lithium-ion and rechargeable battery packs from handheld e-waste.",
                    co2_saved_per_kg=1.9,
                ),
                Material(
                    name="Appliances",
                    category="Electronics",
                    rate=85.0,
                    unit="kg",
                    description="Mixed home and commercial electronic breakdown scrap.",
                    co2_saved_per_kg=1.2,
                ),
            ]
            db.add_all(demo_materials)
            db.commit()

            # Add price history entries
            for mat in demo_materials:
                ph = PriceHistory(material_id=mat.id, rate=mat.rate)
                db.add(ph)
            db.commit()
            logger.info("Demo data seeded successfully.")
    except Exception as e:
        logger.error(f"Failed to seed demo data: {e.__class__.__name__}")
        raise RuntimeError("Demo data seeding failed") from e
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations_and_seed()
    yield


app = FastAPI(
    title="SAHI VALUE Backend API",
    description="High-performance backend for SAHI VALUE Collector Mobile App and Recycler Portal.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
cors_origins_list = (
    settings.CORS_ORIGINS
    if isinstance(settings.CORS_ORIGINS, list)
    else [s.strip() for s in str(settings.CORS_ORIGINS).split(",") if s.strip()]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins_list,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "SAHI VALUE Backend"
    }


# Include API Routers
app.include_router(auth_router)
app.include_router(materials_router)
app.include_router(recyclers_router)
app.include_router(lots_router)
app.include_router(transactions_router)
app.include_router(earnings_router)
app.include_router(ai_router)
