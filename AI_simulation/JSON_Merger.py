import json
import os

# Folder path
BASE_DIR = r"D:\Mini-Project\Project_Code\AI_simulation\RAG_sample_jsons"

# Output file
OUTPUT_FILE = os.path.join(BASE_DIR, "final_merged.json")

merged_data = []
id_counter = 1

# Loop through Batch1.json to Batch4.json
for i in range(1, 5):
    file_path = os.path.join(BASE_DIR, f"batch{i}.json")
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        continue

    with open(file_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            print(f"⚠️ Invalid JSON in {file_path}")
            continue

        if not isinstance(data, list):
            print(f"⚠️ Skipping {file_path} (not a list)")
            continue

        for item in data:
            # Reassign ID cleanly
            item["id"] = id_counter
            merged_data.append(item)
            id_counter += 1

# Save merged file
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(merged_data, f, indent=2, ensure_ascii=False)

print(f"✅ Merged {len(merged_data)} entries into {OUTPUT_FILE}")