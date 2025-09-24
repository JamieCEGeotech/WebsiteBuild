This repository was updated to reference numbered image filenames for easier management.

Mapping applied (keeps .webp extension when used on site):

- "Plates with train" -> 001
- "20200205_114402" -> 002
- "IMG_1126" -> 003
- "IMG_2433A" -> 004
- "Truck With excavator" -> 005
- "IMG_0078" -> 006
- existing "002" (jpg) -> 007
- "IMG_0048" -> 008
- "IMG_0094" -> 009
- "IMG_0130" -> 010

Instructions:

1. Review the changes in source files. All references in HTML/CSS/JSON/news files were updated to the numeric names (e.g. `Files/001.webp`).
2. The script `rename_images.py` is provided to rename actual files in the `Files/` folder. By default it performs a dry run:

   python .\rename_images.py

   To apply the renames, run:

   python .\rename_images.py --apply

   If you need to overwrite existing target filenames, add `--force`.

3. BACKUP your `Files/` directory before running the script if you care about original filenames.

Notes:
- The script attempts to match files by basename and will copy the original extension when creating new filenames (e.g. `IMG_0094.JPG` -> `009.JPG`).
- On the website, images are referenced with `.webp` where those variants exist. Ensure you have `.webp` files present or convert originals as needed.
