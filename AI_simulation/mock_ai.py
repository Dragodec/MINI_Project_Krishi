from fastapi import FastAPI, UploadFile, File
import random

app = FastAPI()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Simulating AI processing time
    diseases = ["Late Blight", "Leaf Spot", "Healthy"]
    selected = random.choice(diseases)
    
    return {
        "disease": selected,
        "confidence": round(random.uniform(0.85, 0.99), 2)
    }

@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    return {
        "text": "വാഴയിലയിൽ കറുത്ത പാടുകൾ കാണുന്നു (Black spots seen on banana leaf)",
        "response": "ഇത് ഇലപ്പുള്ളി രോഗമാകാൻ സാധ്യതയുണ്ട്. (This is likely Leaf Spot disease.)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)