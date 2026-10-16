#!/usr/bin/env python3
"""Check a built Hugo site, including non-root GitHub Pages paths, offline."""
import argparse
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path
import sys
import tomllib
from urllib.parse import unquote, urljoin, urlsplit
import zipfile


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids = []
        self.references = []
        self.controls = []
        self.h1_count = 0
        self.tabs = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "h1":
            self.h1_count += 1
        if "aria-controls" in attrs:
            self.controls.append(attrs["aria-controls"])
        if attrs.get("role") == "tab":
            self.tabs.append(attrs)
        for key in ("href", "src"):
            if attrs.get(key):
                self.references.append(attrs[key])


def check_site(destination, base_url):
    destination = destination.resolve()
    base = urlsplit(base_url)
    base_path = base.path.rstrip("/") + "/"
    errors = []
    pages = {}
    for path in destination.rglob("*.html"):
        document = Document(path.read_text())
        pages[path.resolve()] = document
        if len(document.ids) != len(set(document.ids)):
            errors.append(f"{path}: duplicate IDs")
        if document.h1_count != 1:
            errors.append(f"{path}: expected one H1, found {document.h1_count}")
        if not set(document.controls).issubset(document.ids):
            errors.append(f"{path}: invalid aria-controls")
    for path, document in pages.items():
        relative = path.relative_to(destination).as_posix()
        page_url = urljoin(base_url, relative)
        for reference in document.references:
            url = urlsplit(urljoin(page_url, reference))
            if url.scheme not in ("http", "https") or url.netloc != base.netloc:
                continue
            decoded_path = unquote(url.path)
            if not decoded_path.startswith(base_path):
                errors.append(f"{relative}: escapes deployment prefix: {reference}")
                continue
            target = destination / decoded_path[len(base_path):]
            if target.is_dir():
                target /= "index.html"
            if not target.exists():
                errors.append(f"{relative}: missing target: {reference}")
            elif url.fragment and target.resolve() in pages:
                if unquote(url.fragment) not in pages[target.resolve()].ids:
                    errors.append(f"{relative}: missing fragment: {reference}")
    required = ["index.html", "features/index.html", "features/companion/index.html", "features/free-play/index.html", "features/history/index.html", "download/index.html", "changelog/index.html", "changelog/v2.1.0/index.html", "about/manual/index.html", "about/privacy/index.html"]
    for name in required:
        if not (destination / name).is_file():
            errors.append(f"Required page absent: {name}")
    home = pages.get((destination / "index.html").resolve())
    if home and (len(home.tabs) != 4 or sum(tab.get("aria-selected") == "true" for tab in home.tabs) != 1):
        errors.append("Homepage carousel must have four tabs and exactly one selected tab")
    home_source = (destination / "index.html").read_text()
    for placeholder in ("MOCK DATA", "视觉稿", "概念演示", "安装包路径待接入", "每一下"):
        if placeholder in home_source:
            errors.append(f"Homepage still contains prototype text: {placeholder}")
    source = Path(__file__).resolve().parents[1]
    android = json.loads((source / "data/android.json").read_text())
    config = tomllib.loads((source / "hugo.toml").read_text())
    if config["params"]["latestVersion"] != android["version"] or config["params"]["latestVersionDate"] != android["date"]:
        errors.append("Homepage version/date differs from bundled Android metadata")
    for release in json.loads((source / "data/releases-audit.json").read_text()):
        note = source / "content/changelog" / (release["version"] + ".md")
        date = re.search(r"^date:\s*(\S+)", note.read_text(), re.MULTILINE)
        if not date or date.group(1) != release["date"]:
            errors.append(f"Release date differs from audited Git tag: {release['version']}")
    apk = destination / android["path"]
    if not apk.is_file():
        errors.append("Bundled Android APK missing")
    else:
        if apk.stat().st_size != android["size"] or hashlib.sha256(apk.read_bytes()).hexdigest() != android["sha256"]:
            errors.append("Android APK size / SHA-256 mismatch")
        if not zipfile.is_zipfile(apk):
            errors.append("Android APK is not a ZIP package")
    sources = json.loads((destination / "img/screenshots/sources.json").read_text())
    for item in sources:
        screenshot = destination / "img/screenshots" / item["file"]
        if not screenshot.is_file() or hashlib.sha256(screenshot.read_bytes()).hexdigest() != item["sha256"]:
            errors.append(f"Screenshot differs from original: {item['file']}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"PASS: {len(pages)} HTML pages; internal links, IDs, assets, carousel, original screenshots and APK hash ({base_path})")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--base-url", required=True)
    args = parser.parse_args()
    raise SystemExit(check_site(args.destination, args.base_url))
