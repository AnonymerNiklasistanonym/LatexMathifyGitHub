# LatexMathifyGitHub

Render LaTeX math parts in your markdown files when viewing them on GitHub/GitLab.

The extension crawls the site for any known Markdown HTML nodes and then tries to find all math blocks in them `$...$`/`$$...$$` which if found are being rendered by KaTeX.

## Create Extension

Package extension by running:

```sh
./package_extension.sh
```

### Firefox

There are multiple ways to load the extension:

1. Temporary (is deleted after restart)
   1. Go to `about:addons` and click the icon at the top right with the option `Debug Add-ons`
   2. Click `Load Temporary Add-on` and select the created `./dist/extension_firefox.zip` archive
2. Create *non public* signed Add-on **OR** *public* signed Add-on
   1. Follow this tutorial: [Submitting an add-on](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/#self-distribution)

### Chromium

There are multiple ways to load the extension:

1. Import it
   1. Go to `chrome://extensions/` and click the button at the top left that says `Load unpacked`
   2. Select the created unzipped `./dist/extension_chromium` directory

## Update KaTeX files

Run the [`download_katex_files.sh`](download_katex_files.sh) script.

## Fonts

There is a problem with loading fonts because the CSP (content security policy) is blocking loading custom fonts (remote and local).

---

TODO: Test if by installing the fonts you can use them

---

### Fonts > Firefox

Firefox supports native MathML rendering.
You can go to the add-on settings and enable `Force MathML (without HTML) output`.

### Linux

On Linux it could be that you then also need to install a modern math font because otherwise the MathML renderings have very big and not beautiful borders/spacing around everything.

**Arch Linux**/`pacman`:

```sh
sudo pacman -S otf-latinmodern-math
```

### Fonts > Chromium

Chromium/Chrome does not yet support native MathML rendering.

---

TODO: Add instructions on how to do it in Chromium

---
