from fastapi import APIRouter, File, UploadFile, HTTPException, status
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["AI Services"])


@router.post("/classify")
async def classify_material(image: UploadFile = File(...)):
    if not image:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An image file must be uploaded under the 'image' field."
        )
    
    # Read uploaded image bytes
    contents = await image.read()
    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded image file is empty."
        )
        
    mime_type = image.content_type or "image/jpeg"
    
    try:
        result = AIService.classify_material_image(
            image_bytes=contents,
            mime_type=mime_type
        )
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Classification error: {str(e)}"
        )
