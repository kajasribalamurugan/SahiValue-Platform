import json
import logging
import time
from typing import Dict, Any
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from app.config import settings

logger = logging.getLogger(__name__)

ALLOWED_MATERIALS = [
    "Circuit Board / PCB",
    "Copper",
    "Battery",
    "Smartphone",
    "Laptop",
    "Computer",
    "Monitor",
    "Cable",
    "Appliance",
    "Other E-Waste"
]

class AIClassificationSchema(BaseModel):
    material: str = Field(
        description="Must be EXACTLY one of: Circuit Board / PCB, Copper, Battery, Smartphone, Laptop, Computer, Monitor, Cable, Appliance, Other E-Waste"
    )
    category: str = Field(description="General category of the item")
    confidence: float = Field(description="Confidence score between 0.0 and 1.0")
    description: str = Field(description="Visual description of the identified item")

class AIService:
    @staticmethod
    def classify_material_image(image_bytes: bytes, mime_type: str = "image/jpeg") -> Dict[str, Any]:
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured in backend environment")
        
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = f"""You are an expert E-Waste material classifier for SahiValue platform.
Analyze the provided image and classify it into EXACTLY ONE of the following material categories:
- Circuit Board / PCB
- Copper
- Battery
- Smartphone
- Laptop
- Computer
- Monitor
- Cable
- Appliance
- Other E-Waste

Return the result as JSON matching the schema provided."""

        part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type or "image/jpeg")
        
        # Models to try in order
        candidate_models = [
            "gemini-flash-latest",
            "gemini-3.6-flash",
            "gemini-flash-lite-latest",
            "gemini-2.5-flash-lite"
        ]
        
        last_exception = None
        for attempt in range(2): # Up to 2 retry attempts for temporary 503s
            for model in candidate_models:
                try:
                    response = client.models.generate_content(
                        model=model,
                        contents=[part, prompt],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=AIClassificationSchema,
                            temperature=0.1,
                        )
                    )
                    if response and response.text:
                        data = json.loads(response.text)
                        mat = data.get("material", "Other E-Waste")
                        
                        # Normalize material to allowed set
                        if mat not in ALLOWED_MATERIALS:
                            matched = False
                            for m in ALLOWED_MATERIALS:
                                if m.lower() in mat.lower() or mat.lower() in m.lower():
                                    mat = m
                                    matched = True
                                    break
                            if not matched:
                                mat = "Other E-Waste"
                                
                        conf = float(data.get("confidence", 0.90))
                        conf = max(0.0, min(1.0, conf))
                        
                        return {
                            "material": mat,
                            "category": data.get("category") or "E-Waste",
                            "confidence": conf,
                            "description": data.get("description") or f"Identified as {mat}",
                            "provider": "gemini"
                        }
                except Exception as e:
                    logger.warning(f"Gemini model {model} attempt {attempt+1} failed: {e}")
                    last_exception = e
                    continue
            time.sleep(1.5) # Wait before retry if 503 spike occurred
                
        raise RuntimeError(f"Gemini AI classification failed: {last_exception}")
