import os
import json
import re

NEWS_DIR = os.path.join(os.path.dirname(__file__), '..', 'news')
NEWS_JSON_PATH = os.path.join(os.path.dirname(__file__), 'news.json')

def parse_metadata_from_txt(filepath):
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    # Look for HTML comment at the top
    match = re.match(r'<!--(.*?)-->', content, re.DOTALL)
    meta = {}
    if match:
        lines = match.group(1).strip().split('\n')
        for line in lines:
            if ':' in line:
                key, val = line.split(':', 1)
                meta[key.strip()] = val.strip()
    return meta

def main():
    articles = []
    for fname in os.listdir(NEWS_DIR):
        if fname.lower().endswith('.txt'):
            path = os.path.join(NEWS_DIR, fname)
            meta = parse_metadata_from_txt(path)
            if meta.get('title') and meta.get('date'):
                # Always include markdown path relative to project root
                meta['markdown'] = f'news/{fname}'
                articles.append(meta)
    # Sort by date descending
    articles.sort(key=lambda x: x.get('date', ''), reverse=True)
    with open(NEWS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=2)
    print(f"news.json updated with {len(articles)} articles.")

if __name__ == '__main__':
    main()
