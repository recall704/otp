import type { Plugin } from "@opencode-ai/plugin"

// pytk OpenCode plugin — auto-rewrites Python commands to use `uv run`.
// Requires: uv in PATH.
//
// Detects Python-related commands (python, pytest, ruff, etc.) and
// prepends `uv run` so they execute inside the project's uv-managed
// virtual environment without manual activation.

const PYTHON_TOOLS = [
  "python",
  "python3",
  "pytest",
  "coverage",
  "tox",
  "ruff",
  "mypy",
  "black",
  "isort",
  "flake8",
  "pylint",
  "pyright",
  "pyproject-fmt",
  "pip",
  "pip3",
  "twine",
  "uvicorn",
  "gunicorn",
  "fastapi",
  "django-admin",
]

// Build a regex that matches any tool name at the start of a command,
// using a word boundary to avoid matching longer names by accident.
const TOOL_PATTERN = new RegExp(
  `^\\s*(?:${PYTHON_TOOLS.join("|")})\\b`,
)

const BLOCK_TOKENS = ["uv run", "uvx", "&&", "|", ";", ">", "<"]

const shouldRewrite = (command: string): boolean => {
  if (!TOOL_PATTERN.test(command)) return false
  for (const token of BLOCK_TOKENS) {
    if (command.includes(token)) return false
  }
  return true
}

export const PytkPlugin: Plugin = async ({ $ }) => {
  try {
    await $`which uv`.quiet()
  } catch {
    console.warn("[pytk] uv binary not found in PATH — plugin disabled")
    return {}
  }

  return {
    "tool.execute.before": async (input, output) => {
      const tool = String(input?.tool ?? "").toLowerCase()
      if (tool !== "bash" && tool !== "shell") return

      const args = output?.args
      if (!args || typeof args !== "object") return

      const command = (args as Record<string, unknown>).command
      if (typeof command !== "string" || !command) return

      if (!shouldRewrite(command)) return

      ;(args as Record<string, unknown>).command = `uv run ${command}`
    },
  }
}
