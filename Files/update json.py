"""
Script to generate a files.json listing all image files in the current directory.
Usage:
    python generate_files_json.py
Output:
    Creates/overwrites files.json in the same directory, containing an array of image filenames.
"""

import os
import json

IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'}

def is_image(filename):
    return os.path.splitext(filename)[1].lower() in IMAGE_EXTS

def main():
    files = [f for f in os.listdir('.') if os.path.isfile(f) and is_image(f)]
    with open('files.json', 'w', encoding='utf-8') as out:
        json.dump(files, out, indent=2)
    print(f"files.json updated with {len(files)} image(s).")

if __name__ == '__main__':
    main()