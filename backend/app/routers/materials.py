from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.material import Material
from app.models.price_history import PriceHistory
from app.schemas.material import MaterialOut, PriceHistoryOut

router = APIRouter(tags=["Materials & Prices"])


@router.get("/api/materials", response_model=List[MaterialOut])
def list_materials(db: Session = Depends(get_db)):
    return db.query(Material).all()


@router.get("/api/materials/{material_id}", response_model=MaterialOut)
def get_material(material_id: int, db: Session = Depends(get_db)):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Material with ID {material_id} not found"
        )
    return material


@router.get("/api/prices", response_model=List[PriceHistoryOut])
def list_price_history(db: Session = Depends(get_db)):
    return db.query(PriceHistory).all()
