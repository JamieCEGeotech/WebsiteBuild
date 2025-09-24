"""
Small utility to rename image files in Files/ to numbered names as requested.
It maps original basenames to new numeric basenames (keeping the original extension).

Usage (PowerShell):
    python .\rename_images.py --apply

By default the script runs in dry-run mode and only prints the planned operations.
It is idempotent: if a target file already exists matching the desired name, the script
will skip or optionally overwrite with --force.
"""
from pathlib import Path
import argparse
import shutil

MAP = {
    "Plates with train": "001",
    "20200205_114402": "002",
    "IMG_1126": "003",
    "IMG_2433A": "004",
    "Truck With excavator": "005",
    "IMG_0078": "006",
    "002": "007",  # the existing 002.jpg will become 007
    "IMG_0048": "008",
    "IMG_0094": "009",
    "IMG_0130": "010",
}

FILES_DIR = Path(__file__).resolve().parent / "Files"

def find_candidates():
    candidates = []
    for name, newbase in MAP.items():
        # match any extension (jpg, JPG, webp, WebP, etc.)
        for p in FILES_DIR.glob(f"{name}.*"):
            candidates.append((p, newbase + p.suffix))
    return candidates


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Perform the renames. Default: dry-run")
    parser.add_argument("--force", action="store_true", help="Overwrite target if it exists")
    args = parser.parse_args()

    if not FILES_DIR.exists():
        print(f"Files directory not found: {FILES_DIR}")
        return

    ops = find_candidates()
    if not ops:
        print("No matching files found for renaming. Check MAP and Files/ contents.")
        return

    print("Planned operations:")
    for src, target in ops:
        print(f"  {src.name} -> {target}")

    if not args.apply:
        print("\nDry run only. Re-run with --apply to perform changes.")
        return

    # apply changes
    for src, target in ops:
        tgt_path = FILES_DIR / target
        if tgt_path.exists():
            if args.force:
                print(f"Overwriting existing {tgt_path.name}")
                tgt_path.unlink()
            else:
                print(f"Target exists, skipping {src.name} -> {tgt_path.name} (use --force to overwrite)")
                continue
        print(f"Renaming {src.name} -> {tgt_path.name}")
        shutil.move(str(src), str(tgt_path))

    print("Done.")

if __name__ == '__main__':
    main()
