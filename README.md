# uv-plugin

OpenCode plugin that auto-rewrites Python-related shell commands to use
`uv run`, so they execute inside the project's uv-managed virtual
environment without manual activation.

Detected commands — any of:

<p>
<code>python</code>, <code>python3</code>, <code>pytest</code>,
<code>coverage</code>, <code>tox</code>, <code>ruff</code>,
<code>mypy</code>, <code>black</code>, <code>isort</code>,
<code>flake8</code>, <code>pylint</code>, <code>pyright</code>,
<code>pyproject-fmt</code>, <code>pip</code>, <code>pip3</code>,
<code>twine</code>, <code>uvicorn</code>, <code>gunicorn</code>,
<code>fastapi</code>, <code>django-admin</code>
</p>

— are rewritten from `<tool>` to `uv run <tool>`.

Commands that already contain `uv run`, `uvx`, or shell operators
(`&&`, `|`, `;`, `>`, `<`) are left untouched.

## Requirements

- [uv](https://docs.astral.sh/uv/) must be in `PATH`.
- The plugin auto-disables if `uv` is not found.

## Install

Copy `uv-plugin.ts` to `~/.config/opencode/plugins/`:

```sh
cp uv-plugin.ts ~/.config/opencode/plugins/
```
