Optional, safe-quality add-ons. These do not change gameplay or features.

1) Append-only CSS (focus rings + reduced-motion)
   - File: src/index.css (or your global stylesheet)
   - Action: Append the contents of index.css.append.css to your file.

2) package.json scripts (if you want convenience)
   - File: package.json.scripts.patch.json
   - Action: Copy any missing scripts into your existing package.json.
   - NOTHING is removed; it's just a helper snippet.
