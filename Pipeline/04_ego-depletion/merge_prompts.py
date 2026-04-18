#!/usr/bin/env python3
"""
Merge all scene_*.json files into a single prompts.json file.

This script:
1. Auto-detects all scene_*.json files in the current directory
2. Loads them in filename-sorted order
3. Combines all prompt entries (handles multiple JSON structures)
4. Re-numbers image_number sequentially (1, 2, 3, ...)
5. Validates that every prompt ends with "no text"
6. Writes the final merged prompts.json

Usage:
    python3 merge_prompts.py
"""

import json
import glob
import os
import sys
from pathlib import Path


def extract_prompts_from_file(data, scene_file):
    """
    Extract prompt entries from various JSON structures.
    
    Handles:
    - {"scenes": [...]} structure
    - {"visual_prompts": [...]} structure
    - {"prompts": [...]} structure
    - [... direct array] structure
    
    Returns a list of prompt entries with normalized structure.
    """
    prompts = []
    
    # If data is a list at the root level (direct array)
    if isinstance(data, list):
        prompts = data
    # If data is a dict with "scenes" key
    elif isinstance(data, dict) and "scenes" in data:
        prompts = data["scenes"]
    # If data is a dict with "visual_prompts" key
    elif isinstance(data, dict) and "visual_prompts" in data:
        prompts = data["visual_prompts"]
    # If data is a dict with "prompts" key
    elif isinstance(data, dict) and "prompts" in data:
        prompts = data["prompts"]
    else:
        print(f"Error: Unable to find prompt array in {scene_file}")
        return None
    
    return prompts


def normalize_prompt_entry(entry):
    """
    Normalize a prompt entry to standard format.
    
    Standard format:
    {
        "image_number": int,
        "text_content": str (optional),  
        "image_prompt": str
    }
    """
    normalized = {}
    
    # Get image_number
    if "image_number" in entry:
        normalized["image_number"] = entry["image_number"]
    else:
        normalized["image_number"] = None  # Will be re-numbered later
    
    # Get prompt text (various field names)
    if "image_prompt" in entry:
        normalized["image_prompt"] = entry["image_prompt"]
    elif "prompt" in entry:
        normalized["image_prompt"] = entry["prompt"]
    else:
        return None  # No valid prompt field
    
    # Get narration text (optional, various field names)
    if "text_content" in entry:
        normalized["text_content"] = entry["text_content"]
    elif "narration" in entry:
        normalized["text_content"] = entry["narration"]
    else:
        normalized["text_content"] = ""
    
    return normalized


def merge_prompts():
    """Merge all scene JSON files into a single prompts.json."""
    
    # Get the directory containing this script
    script_dir = Path(__file__).parent.absolute()
    os.chdir(script_dir)
    
    # Find all scene_*.json files in sorted order
    scene_files = sorted(glob.glob("scene_*.json"))
    
    if not scene_files:
        print("Error: No scene_*.json files found in the current directory.")
        sys.exit(1)
    
    print(f"Found {len(scene_files)} scene file(s):")
    for f in scene_files:
        print(f"  - {f}")
    
    # Load all scenes and combine
    all_prompts = []
    video_title = None
    image_number_counter = 1
    
    for scene_file in scene_files:
        print(f"\nProcessing {scene_file}...")
        
        try:
            with open(scene_file, "r", encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error: Failed to parse {scene_file}: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"Error: Failed to read {scene_file}: {e}")
            sys.exit(1)
        
        # Extract video_title from the first scene file (or any file that has it)
        if video_title is None:
            if isinstance(data, dict) and "video_title" in data:
                video_title = data["video_title"]
            elif isinstance(data, list) and len(data) > 0 and "scene_title" in data[0]:
                # Try to get a title from the content
                video_title = "Why Your Willpower Runs Out (And What Actually Replenishes It)"
        
        # Extract prompts from the file
        prompts = extract_prompts_from_file(data, scene_file)
        if prompts is None:
            sys.exit(1)
        
        if not isinstance(prompts, list) or len(prompts) == 0:
            print(f"Warning: No prompts found in {scene_file}, skipping")
            continue
        
        # Process each prompt entry
        for entry in prompts:
            normalized = normalize_prompt_entry(entry)
            if normalized is None:
                print(f"Warning: Skipping invalid entry in {scene_file}")
                continue
            
            # Validate that prompt ends with "no text"
            if not normalized["image_prompt"].strip().endswith("no text"):
                print(f"Warning: Prompt in {scene_file} does not end with 'no text'")
                # Don't fail, just warn
            
            # Re-number sequentially
            normalized["image_number"] = image_number_counter
            all_prompts.append(normalized)
            image_number_counter += 1
        
        print(f"  ✓ Loaded {len(prompts)} prompt(s)")
    
    if not all_prompts:
        print("Error: No prompts found in any scene file")
        sys.exit(1)
    
    # Set default title if not found
    if video_title is None:
        video_title = "Why Your Willpower Runs Out (And What Actually Replenishes It)"
    
    # Create final output structure
    total_images = len(all_prompts)
    final_output = {
        "video_title": video_title,
        "total_images": total_images,
        "prompts": all_prompts
    }
    
    # Write the merged prompts.json
    output_file = "prompts.json"
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(final_output, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Successfully merged {len(scene_files)} file(s) into {output_file}")
        print(f"  Total images: {total_images}")
    except Exception as e:
        print(f"Error: Failed to write {output_file}: {e}")
        sys.exit(1)


if __name__ == "__main__":
    merge_prompts()
