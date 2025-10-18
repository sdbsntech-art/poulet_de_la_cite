from pathlib import Path
from datetime import datetime
import shutil
import re
import sys

ROOT = Path(r"c:\Users\SDBSN\Desktop\poulet_de_la_cite")
if not ROOT.exists():
    print("Dossier introuvable:", ROOT)
    sys.exit(1)

timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

def backup(path: Path):
    bak = path.with_suffix(path.suffix + f".bak_{timestamp}")
    shutil.copy2(path, bak)
    return bak.name

def normalize_html(text):
    text = text.replace("\x00", "")
    text = re.sub(r">\s*\n\s*<", ">\n<", text)   # remove stray > newline artifacts
    text = text.replace("\n>\n", "\n")
    return text

# regex helpers
RE_SCRIPT = re.compile(r"<script\b([^>]*)>(.*?)</script>", re.I | re.S)
RE_EMPTY_SCRIPT = re.compile(r"<script\b([^>]*)>\s*</script>", re.I | re.S)
RE_ANTI = re.compile(r"<script\b([^>]*)\bid\s*=\s*['\"]anti-inspect['\"][^>]*>.*?</script>", re.I | re.S)
RE_LINK_RESP = re.compile(r"<link\b([^>]*href\s*=\s*['\"][^'\"<>]*responsive\.css['\"][^>]*)>", re.I)
RE_SCRIPT_RESP = re.compile(r"<script\b([^>]*src\s*=\s*['\"][^'\"<>]*responsive\.js['\"][^>]*)>.*?</script>", re.I | re.S)
RE_SCRIPT_SRC = re.compile(r"<script\b([^>]*src\s*=\s*['\"]([^'\"<>]+)['\"][^>]*)>.*?</script>", re.I | re.S)
RE_DOCTYPE = re.compile(r"^\s*<!doctype\s+html", re.I)

def process_file(path: Path):
    original = path.read_text(encoding="utf-8", errors="replace")
    text = normalize_html(original)

    # remove truly empty <script>...</script>
    text = RE_EMPTY_SCRIPT.sub("", text)

    # find anti-inspect scripts; keep last, remove others
    anti_matches = list(RE_ANTI.finditer(text))
    if len(anti_matches) > 1:
        # remove all except last
        for m in anti_matches[:-1]:
            span = m.span()
            text = text[:span[0]] + text[span[1]:]

    # remove stray single ">" tokens on lines
    text = re.sub(r"(?m)^\s*>\s*$", "", text)

    # move responsive.css link into head if present
    m_link = RE_LINK_RESP.search(text)
    if m_link:
        link_tag = m_link.group(0)
        # remove original
        text = RE_LINK_RESP.sub("", text, count=1)
        if "</head>" in text.lower():
            # insert before closing head (preserve case by finding index)
            idx = text.lower().rfind("</head>")
            text = text[:idx] + link_tag + "\n" + text[idx:]
        else:
            # prepend to top
            text = link_tag + "\n" + text

    # move responsive.js just before </body> if present
    m_js = RE_SCRIPT_RESP.search(text)
    if m_js:
        js_tag = m_js.group(0)
        text = RE_SCRIPT_RESP.sub("", text, count=1)
        if "</body>" in text.lower():
            idx = text.lower().rfind("</body>")
            text = text[:idx] + js_tag + "\n" + text[idx:]
        else:
            text = text + "\n" + js_tag

    # remove duplicate identical script src tags (keep first)
    seen = set()
    def dedupe_script(m):
        full = m.group(0)
        src = m.group(2)
        if src in seen:
            return ""
        seen.add(src)
        return full
    text = RE_SCRIPT_SRC.sub(dedupe_script, text)

    # Ensure single doctype
    if not RE_DOCTYPE.search(text):
        text = "<!DOCTYPE html>\n" + text
    else:
        # ensure only one doctype (remove extras)
        text = re.sub(r"(?i)(?:<!doctype\s+html>\s*)+", "<!DOCTYPE html>\n", text, count=1)

    # simple lang enforcement
    if "<html" in text.lower() and "lang=" not in text.lower():
        text = re.sub(r"<html(\s*)", r"<html lang=\"fr\"\1", text, count=1, flags=re.I)

    bak = backup(path)
    path.write_text(text, encoding="utf-8")
    print(f"Fixed: {path.name} (backup: {bak})")

def main():
    files = list(ROOT.rglob("*.html"))
    if not files:
        print("Aucun fichier .html trouvé dans", ROOT)
        return
    for f in files:
        try:
            process_file(f)
        except Exception as e:
            print("Erreur sur", f, ":", e)

if __name__ == "__main__":
    main()