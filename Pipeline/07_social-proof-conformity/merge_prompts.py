#!/usr/bin/env python3
"""Merge all scene_*.json files into a single prompts.json."""

import glob
import json
import os
import sys

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    scene_files = sorted(glob.glob(os.path.join(script_dir, "scene_*.json")))

    if not scene_files:
        print("ERROR: No scene_*.json files found.")
        sys.exit(1)

    all_prompts = []
    video_title = None

    for filepath in scene_files:
        print(f"Loading: {os.path.basename(filepath)}")
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        if video_title is None and "video_title" in data:
            video_title = data["video_title"]

        for entry in data.get("prompts", []):
            all_prompts.append(entry)

    # Re-number sequentially
    for i, entry in enumerate(all_prompts, start=1):
        entry["image_number"] = i

    # Validate all prompts end with "no text"
    issues = []
    for entry in all_prompts:
        if not entry.get("prompt", "").strip().endswith("no text"):
            issues.append(entry["image_number"])

    if issues:
        print(f"WARNING: {len(issues)} prompts do not end with 'no text': {issues}")

    output = {
        "video_title": video_title or "Untitled",
        "total_images": len(all_prompts),
        "prompts": all_prompts,
    }

    output_path = os.path.join(script_dir, "prompts.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nMerged {len(all_prompts)} prompts from {len(scene_files)} scene files.")
    print(f"Output: {output_path}")

if __name__ == "__main__":
    main()
