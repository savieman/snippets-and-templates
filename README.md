# 🚀 VSCode → IntelliJ Live Templates Converter

This repository contains:

* ✅ Custom **VSCode snippets**
* ✅ Converted **IntelliJ Live Templates**
* ✅ A **Node.js script** to automatically convert VSCode snippets → IntelliJ XML

The goal is to make IntelliJ Live Templates behave **as close as possible to VSCode snippets**, including:

* Tab order (`$1 → $2 → ...`)
* Multi-line formatting
* Cursor navigation
* Selection support

***

# ⚙️ How It Works

The script converts:

| VSCode                | IntelliJ              |
| --------------------- | --------------------- |
| `$1`, `${1}`          | `$1$`                 |
| `${1:label}`          | `$1$` (label ignored) |
| `${TM_SELECTED_TEXT}` | `$SELECTION$`         |
| Multiline array       | `&#10;` (XML newline) |

It also:

* Preserves **tab order**
* Auto-generates `<variable>` entries
* Maps snippet `scope` → IntelliJ `context`
* Escapes XML safely

***

# ▶️ Usage

## 1. Install Node.js

Make sure you have Node installed:

```bash
node -v
```

***

## 2. Run the converter

```bash
node convert-snippets.js path/to/snippets.json
```

Optional output file:

```bash
node convert-snippets.js snippets.json output.xml
```

***

## 3. Import into IntelliJ

1. Go to:
   ```
   Settings → Editor → Live Templates
   ```
2. Click:
   ```
   ⚙️ → Import
   ```
3. Select your generated XML file

***

# ✅ Example

### VSCode snippet

```json
"method1": {
  "prefix": "me1",
  "body": [
    "${1}(${2}: ${3}): ${4} {",
    "    ${5}",
    "}"
  ]
}
```

### IntelliJ result

```xml
<template name="me1" value="$1$($2$: $3$): $4$ {&#10;    $5$&#10;}">
```

✅ Same typing flow  
✅ Same tab order  
✅ Same formatting

***

# ⚠️ Limitations

Due to IntelliJ differences:

* ❌ `${1:default}` → default values are not preserved
* ❌ `$0` (final cursor position) → becomes last tab stop
* ❌ `${TM_SELECTED_TEXT:fallback}` → fallback not supported

