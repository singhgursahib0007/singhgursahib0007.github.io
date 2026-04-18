#!/usr/bin/env python3
"""Merge all scene_*.json files into a single prompts.json."""

import glob
import json
import os
import sys

def main():
    folder = os.path.dirname(os.path.abspath(__file__))
    scene_files = sorted(glob.glob(os.path.join(folder, "scene_*.json")))

    if not scene_files:
        print("ERROR: No scene_*.json files found.")
        sys.exit(1)

    all_prompts = []
    video_title = None

    for path in scene_files:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if video_title is None and "video_title" in data:
            video_title = data["video_title"]
        for entry in data.get("prompts", []):
            all_prompts.append(entry)

    # Re-number sequentially
    for i, entry in enumerate(all_prompts, start=1):
        entry["image_number"] = i

    # Validate every prompt ends with "no text"
    warnings = []
    for entry in all_prompts:
        if not entry.get("prompt", "").rstrip().endswith("no text"):
            warnings.append(f"  Image {entry['image_number']}: prompt does not end with 'no text'")

    if warnings:
        print("WARNINGS:")
        for w in warnings:
            print(w)

    output = {
        "video_title": video_title or "Attachment Styles — The Childhood Pattern Running Your Adult Relationships",
        "total_images": len(all_prompts),
        "prompts": all_prompts,
    }

    out_path = os.path.join(folder, "prompts.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Merged {len(scene_files)} scene files -> {len(all_prompts)} prompts -> prompts.json")

if __name__ == "__main__":
    main()
