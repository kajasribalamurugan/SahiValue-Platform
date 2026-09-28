from app.routers.auth import router as auth_router
from app.routers.materials import router as materials_router
from app.routers.recyclers import router as recyclers_router
from app.routers.lots import router as lots_router
from app.routers.transactions import router as transactions_router
from app.routers.earnings import router as earnings_router
from app.routers.ai import router as ai_router

__all__ = [
    "auth_router",
    "materials_router",
    "recyclers_router",
    "lots_router",
    "transactions_router",
    "earnings_router",
    "ai_router",
]
