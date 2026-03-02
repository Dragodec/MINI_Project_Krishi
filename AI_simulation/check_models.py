import os
from dotenv import load_dotenv
from google import genai

env_path = r"D:\Mini-Project\Project_Code\backend\.env"
load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("GOOGLE_API_KEY")
print(f"API Key: {'*' * (len(API_KEY)-4)}-{API_KEY[-4:]}")
print(f"Current dir: {os.getcwd()}")

client = genai.Client(api_key=API_KEY)

print("\n=== ALL MODELS (no filter) ===")
all_models = []
try:
    for model in client.models.list():
        all_models.append(model)
        print(f"- {model.name} (display: {getattr(model, 'display_name', 'N/A')})")
    print(f"\nTotal models found: {len(all_models)}")
except Exception as e:
    print(f"ERROR listing models: {e}")

print("\n=== Project Info ===")
try:
    # Test basic API call
    model = client.models.get('gemini-2.5-flash')
    print("✅ Can access gemini-2.5-flash specifically")
except Exception as e:
    print(f"❌ Cannot access gemini-2.5-flash: {e}")

print("\n=== RECOMMENDED FIXES ===")
print("1. Go to https://aistudio.google.com/app/apikey")
print("2. Verify your API key project has billing enabled")
print("3. Enable 'Generative Language API' in Google Cloud Console")
print("4. Check quota: https://console.cloud.google.com/quotas")
