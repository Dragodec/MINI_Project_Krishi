import json
import os

# Folder containing the JSON datasets
BASE_PATH = r"D:\Mini-Project\Project_Code\AI_simulation\Jsons"

FILES = [
    "crop_health_dataset.json",
    "government_schemes_dataset.json",
    "farm_practices_dataset.json",
    "weather_dataset.json"
]

merged_data = []

print("\n📦 Loading datasets...\n")

# Load each dataset
for file in FILES:
    file_path = os.path.join(BASE_PATH, file)

    if not os.path.exists(file_path):
        print(f"❌ File not found: {file}")
        continue

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if isinstance(data, list):
            print(f"✅ {file} -> {len(data)} entries")
            merged_data.extend(data)
        else:
            print(f"⚠️ {file} is not a JSON list, skipping")

    except Exception as e:
        print(f"❌ Error reading {file}: {e}")

print("\n📊 Total entries before ID fix:", len(merged_data))

# Fix IDs sequentially
print("\n🔧 Reassigning IDs...")

for i, entry in enumerate(merged_data, start=1):
    entry["id"] = i

print("✅ IDs reassigned")

# Output file
output_path = os.path.join(BASE_PATH, "agri_master_rag.json")

try:
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(merged_data, f, indent=2, ensure_ascii=False)

    print("\n🎉 Merge complete!")
    print(f"📁 File saved to: {output_path}")
    print(f"📊 Final dataset size: {len(merged_data)} entries")

except Exception as e:
    print(f"❌ Error saving merged file: {e}")