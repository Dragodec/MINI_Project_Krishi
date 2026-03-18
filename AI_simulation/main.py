import os
import base64
import hashlib
from fastapi import FastAPI, UploadFile, File, Form
from dotenv import load_dotenv
import json


from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

# ================== LOAD ENV ==================

env_path = "D:/Mini-Project/Project_Code/backend/.env"
load_dotenv(env_path)

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("❌ GOOGLE_API_KEY missing")

app = FastAPI()

# ================== EMBEDDINGS ==================

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

# ================== VECTOR DB ==================

db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
    collection_name="agri_rag"
)

# ================== GEMINI ==================

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    temperature=0
)

# ================== CACHE ==================

cache = {}

def get_cache_key(text, image_bytes):
    m = hashlib.md5()

    if text:
        m.update(text.encode())

    if image_bytes:
        m.update(image_bytes)

    return m.hexdigest()

# ================== SYSTEM PROMPT ==================

SYSTEM_PROMPT = """
You are an experienced Kerala Krishi Bhavan agricultural officer helping farmers diagnose crop problems.

Your goal is to give **practical field-level advice** using the agricultural knowledge provided.

Follow these guidelines strictly:

1. Diagnose carefully.
   - Never claim absolute certainty.
   - Use phrases like:
     • "most likely caused by"
     • "commonly due to"
     • "another possible reason is"

2. Suggest field inspection steps.
   - Tell the farmer what to check on the crop
   - Example: underside of leaves, root rot, insect presence

3. Provide practical treatment.
   - Mention recommended fertilizers, pesticides, or organic options
   - Include dosage or method when possible

4. Always suggest prevention.
   - Balanced fertilizer
   - drainage improvement
   - pest monitoring

5. If the problem cannot be confidently diagnosed:
   - Recommend contacting the nearest Krishi Bhavan for a field visit.

6. Use simple farmer-friendly language.

7. Keep the response under 150 words.

8. Structure your answer like this:

Dear farmer,

• Likely cause
• What to check in the field
• Practical treatment
• Prevention advice

Then provide the same advice in **Malayalam** below a separator line:

---

Malayalam translation
"""

# ================== API ==================

@app.post("/process")
async def process_query(
    text: str = Form(None),
    image: UploadFile = File(None),
    audio: UploadFile = File(None)
):

    image_bytes = None

    if image:
        image_bytes = await image.read()

    cache_key = get_cache_key(text, image_bytes)

    if cache_key in cache:
        return {"response": cache[cache_key]}

    if text and len(text.split()) < 2 and not image:
        return {"response": "Please provide more details about your crop issue."}

    context = ""

    # ================== RAG RETRIEVAL ==================

    if text:

        boosted_query = text + " farming agriculture crop disease pest kerala കൃഷി രോഗം കീടം വാഴ നെല്ല്"

        docs1 = db.similarity_search(text, k=3)
        docs2 = db.similarity_search(boosted_query, k=3)

        seen = set()
        docs = []

        for d in docs1 + docs2:
            if d.page_content not in seen:
                docs.append(d)
                seen.add(d.page_content)

        docs = docs[:3]

        context = "\n".join([d.page_content for d in docs])

    if not context.strip() and not image:
        return {
            "response": "I am not sure about this issue. Please consult your nearest Krishi Bhavan agricultural officer."
        }

    context = context[:1500]

    # ================== FINAL PROMPT ==================

    prompt = f"""
{SYSTEM_PROMPT}

Agricultural Knowledge:
{context}

Farmer Question:
{text if text else "Analyze the uploaded crop image and diagnose the issue."}
"""

    content = [{"type": "text", "text": prompt}]

    # ================== IMAGE SUPPORT ==================

    if image_bytes:

        encoded = base64.b64encode(image_bytes).decode("utf-8")

        content.append({
            "type": "image_url",
            "image_url": f"data:{image.content_type};base64,{encoded}"
        })

    # ================== LLM CALL ==================

    try:

        response = llm.invoke([HumanMessage(content=content)])

        final_text = response.content

    except Exception as e:

        print("❌ Gemini Error:", e)

        return {
            "response": "AI service temporarily unavailable. Please try again later."
        }

    cache[cache_key] = final_text

    return {"response": final_text}

# ================== AUTOMATED TASKS ==================

@app.post("/generate-tasks")
async def generate_tasks(
    crop: str = Form(...),
    plantingDate: str = Form(...)
):
    system_prompt = f"""
You are an expert agricultural planner. Provide a lifecycle calendar for '{crop}' planted on '{plantingDate}'.
Return EXACTLY a JSON array of 5 to 7 crucial tasks.
Format your response purely as a valid JSON array. Do not include any Markdown like ```json.
Example format:
[
  {{"title": "Seed Treatment", "description": "Apply fungicide before sowing", "daysFromPlanting": 0}},
  {{"title": "First Fertilizer", "description": "Apply NPK", "daysFromPlanting": 15}}
]
"""
    try:
        response = llm.invoke([HumanMessage(content=[{"type": "text", "text": system_prompt}])])
        # Try to parse json to ensure it's valid, clean up backticks if any
        raw_text = response.content.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        
        raw_text = raw_text.strip()
        tasks = json.loads(raw_text)
        return {"tasks": tasks}
    except Exception as e:
        print("❌ Gemini Task Error:", e)
        return {"error": "Failed to generate tasks via AI."}

# ================== RUN SERVER ==================


if __name__ == "__main__":

    import uvicorn

    print("🚀 FastAPI running on http://127.0.0.1:8000")

    uvicorn.run(app, host="127.0.0.1", port=8000)