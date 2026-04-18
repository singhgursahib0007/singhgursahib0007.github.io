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

    for f in scene_files:
        print(f"Loading: {os.path.basename(f)}")
        with open(f, "r", encoding="utf-8") as fh:
            data = json.load(fh)

        if video_title is None and "video_title" in data:
            video_title = data["video_title"]

        prompts = data.get("prompts", [])
        all_prompts.extend(prompts)

    # Re-number sequentially
    for i, p in enumerate(all_prompts, start=1):
        p["image_number"] = i

    # Validate all prompts end with "no text"
    errors = []
    for p in all_prompts:
        if not p.get("prompt", "").strip().endswith("no text"):
            errors.append(f"Image {p['image_number']} ({p.get('narration_snippet','?')}) does not end with 'no text'")

    if errors:
        print("VALIDATION ERRORS:")
        for e in errors:
            print(f"  - {e}")

    if video_title is None:
        video_title = "The Reason Smart People Believe Dumb Things About Themselves"

    output = {
        "video_title": video_title,
        "total_images": len(all_prompts),
        "prompts": all_prompts,
    }

    out_path = os.path.join(script_dir, "prompts.json")
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(output, fh, indent=2, ensure_ascii=False)

    print(f"\nMerged {len(all_prompts)} prompts from {len(scene_files)} scene files.")
    print(f"Output: {out_path}")
    if errors:
        print(f"WARNING: {len(errors)} validation error(s) found.")
    else:
        print("All prompts validated successfully.")

if __name__ == "__main__":
    main()
