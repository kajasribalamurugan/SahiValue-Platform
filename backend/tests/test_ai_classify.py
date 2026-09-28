import io
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_classify_endpoint_success():
    # Create synthetic PCB test image
    img = Image.new('RGB', (300, 300), color='#004d25')
    draw = ImageDraw.Draw(img)
    draw.line([(20, 50), (280, 50)], fill='#d4af37', width=5)
    draw.line([(50, 20), (50, 280)], fill='#d4af37', width=5)
    draw.rectangle([(100, 100), (200, 200)], fill='#1a1a1a', outline='#d4af37', width=3)
    
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=90)
    image_bytes = buf.getvalue()
    
    response = client.post(
        "/api/ai/classify",
        files={"image": ("pcb.jpg", image_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "material" in data
    assert "category" in data
    assert "confidence" in data
    assert "description" in data
    assert data["provider"] == "gemini"
    assert data["material"] in [
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
