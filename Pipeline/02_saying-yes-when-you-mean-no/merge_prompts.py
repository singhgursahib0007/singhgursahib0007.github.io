#!/usr/bin/env python3
"""
Merge individual scene JSON files into a single prompts.json file.
Handles image numbering, validation, and output formatting.
"""

import json
import glob
import os
from pathlib import Path

def merge_prompts():
    """Merge all scene_*.json files into a final prompts.json."""

    # Get the directory containing this script
    script_dir = Path(__file__).parent

    # Find all scene files
    scene_files = sorted(glob.glob(str(script_dir / "scene_*.json")))

    if not scene_files:
        print("Error: No scene_*.json files found!")
        return False

    print(f"Found {len(scene_files)} scene files to merge")

    all_prompts = []
    video_title = None

    # Process each scene file
    for scene_file in scene_files:
        print(f"Processing {Path(scene_file).name}...")

        try:
            with open(scene_file, 'r') as f:
                scene_data = json.load(f)

            # Extract video title from first scene (if present)
            if "video_title" in scene_data and video_title is None:
                video_title = scene_data["video_title"]

            # Add all prompts from this scene
            if "prompts" in scene_data:
                all_prompts.extend(scene_data["prompts"])

        except json.JSONDecodeError as e:
            print(f"Error parsing {Path(scene_file).name}: {e}")
            return False
        except Exception as e:
            print(f"Error processing {Path(scene_file).name}: {e}")
            return False

    # Re-number prompts sequentially
    for idx, prompt in enumerate(all_prompts, start=1):
        prompt["image_number"] = idx

    # Validation: check that all prompts end with "no text"
    invalid_prompts = []
    for idx, prompt in enumerate(all_prompts, start=1):
        if not prompt.get("prompt", "").strip().endswith("no text"):
            invalid_prompts.append((idx, prompt.get("narration_snippet", "UNKNOWN")))

    if invalid_prompts:
        print(f"\nWarning: {len(invalid_prompts)} prompts don't end with 'no text':")
        for img_num, snippet in invalid_prompts[:5]:
            print(f"  Image {img_num}: '{snippet}'")
        if len(invalid_prompts) > 5:
            print(f"  ... and {len(invalid_prompts) - 5} more")

    # Create final output
    final_output = {
        "video_title": video_title or "The Hidden Reason You Always Say 'Yes' When You Mean 'No'",
        "total_images": len(all_prompts),
        "prompts": all_prompts
    }

    # Write output file
    output_file = script_dir / "prompts.json"

    try:
        with open(output_file, 'w') as f:
            json.dump(final_output, f, indent=2)
        print(f"\n✅ Successfully merged {len(all_prompts)} prompts into {output_file.name}")
        print(f"   Video: {final_output['video_title']}")
        print(f"   Total images: {final_output['total_images']}")
        return True

    except Exception as e:
        print(f"Error writing output file: {e}")
        return False

if __name__ == "__main__":
    success = merge_prompts()
    exit(0 if success else 1)
