# AI Coding Learning - Project Knowledge Base

**Generated:** 2026-02-12
**Commit:** 2e350ef
**Branch:** main

## OVERVIEW

MkDocs documentation site teaching AI-assisted programming. Chinese-focused learning resource covering 10+ AI coding tools (Copilot, Cursor, Claude Code, Trae, 通义灵码, etc.).

## STRUCTURE

```
./
├── mkdocs.yml           # Main config (theme, nav, extensions)
├── requirements.txt     # Python deps (mkdocs-material, pymdown-extensions)
├── 01-history/          # AI tool evolution timeline
├── 02-tools/            # Tool deep-dives (canonical markdown source)
├── 03-comparison/       # Selection guide & feature matrix
├── 04-getting-started/  # Quick start tutorials
├── 05-best-practices/   # Advanced techniques
├── 06-examples/         # Practice exercises by difficulty
│   ├── 01-basics/
│   ├── 02-data-processing/
│   ├── 03-web-development/
│   ├── 04-algorithms/
│   └── 05-projects/
├── docs/                # MkDocs source (mirrors root structure)
│   ├── stylesheets/
│   └── javascripts/
└── .github/workflows/   # CI: auto-deploy to GitHub Pages
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add new tool documentation | `02-tools/new-tool.md` + update `mkdocs.yml` nav |
| Modify site theme/config | `mkdocs.yml` |
| Add example exercises | `06-examples/XX-category/` |
| Custom CSS/JS | `docs/stylesheets/`, `docs/javascripts/` |
| CI/deployment | `.github/workflows/ci.yml` |
| Deployment guides | `DEPLOY.md`, `WEBSITE.md` |

## CONVENTIONS

- **Dual structure**: Root dirs (`02-tools/`) are canonical; `docs/` is MkDocs source
- **Naming**: Numbered prefixes for ordering (`01-`, `02-`, etc.)
- **Language**: Chinese primary, English tool names preserved
- **Markdown extensions**: Mermaid diagrams, task lists, tabs, code annotations enabled

## COMMANDS

```bash
# Local development
pip install -r requirements.txt
mkdocs serve              # http://127.0.0.1:8000

# Build
mkdocs build              # Generates site/

# Deploy
mkdocs gh-deploy --force  # GitHub Pages (auto on push to main)
```

## NOTES

- No executable code in this repo - pure documentation
- `docs/` folder required by MkDocs; keep synced with root markdown
- opencode.yml enables `/oc` command in issues/PRs for AI assistance
