from fastapi import FastAPI, UploadFile, File
import random

app = FastAPI()

# 🌿 IMAGE ANALYSIS
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    diseases = ["Late Blight", "Leaf Spot", "Healthy"]
    selected = random.choice(diseases)

    return {
        "disease": selected,
        "confidence": round(random.uniform(0.85, 0.99), 2)
    }

# 🎤 AUDIO PROCESSING
@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    return {
        "text": "വാഴയിലയിൽ കറുത്ത പാടുകൾ കാണുന്നു (Black spots seen on banana leaf)",
        "response": "ഇത് ഇലപ്പുള്ളി രോഗമാകാൻ സാധ്യതയുണ്ട്. (This is likely Leaf Spot disease.)"
    }

# 💬 TEXT CHAT (FIXED 🔥)
@app.post("/chat")
async def chat(data: dict):
    text = data.get("text", "").lower()

    # 🌱 BASIC INTELLIGENCE (DEMO SMARTNESS)
    if "banana" in text:
        return {
            "response": "Possible issues: Sigatoka or Leaf Spot. Inspect leaves and apply fungicide."
        }

    if "rice" in text:
        return {
            "response": "Check for bacterial blight. Avoid excess nitrogen fertilizers."
        }

    if "fertilizer" in text:
        return {
            "response": "Use balanced NPK based on crop stage. Avoid over-application."
        }

    return {
        "response": f"Based on your query '{text}', monitor crop health and follow standard agricultural practices."
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)