# Ollamec Framework Layout

This document provides a structural overview of the Ollamec framework and how developers can integrate and extend it within their own applications. It complements the [Ollamec Overview](./ollamec-overview.md), which explains the architectural intent, design principles, and client orchestration model.

---

## 📁 Core Framework Layout (Ollamec)

This is the internal folder structure of the Ollamec project itself:

```
ollamec/
├── bin/                            # Thin entrypoints (e.g., `ollamec.ts` CLI launcher)
├── config/                         # DI container setup, tokens, and registration helpers
├── core/                           # Interfaces and default implementations (Prompt, Memory, LLM, etc.)
├── llm/                            # Built-in LLM clients (e.g., `DefaultLLMClient`, `OllamaClient`)
├── memory/                         # Built-in memory strategies (e.g., `InMemorySlidingMemory`)
├── prompts/                        # Built-in prompt templates and registry loader
├── tests/                          # Bun-based unit and integration tests
├── tsconfig.json                   # TS config for the framework
├── bunfig.toml                     # Bun project configuration
└── .config/*                       # Biome, Lefthook, and commit-lint config files
```

### Notes:

- `cli/` and `commander` usage is being phased out. The CLI will become a thin launcher around `OllamecClient`.
- `plugins/` and `custom/` have been deprecated in favor of DI-based extension through user projects.

---

## 🧑‍💻 Developer Project Layout (Using Ollamec)

Here’s how a consumer of the Ollamec framework might structure their project:

```
my-ollamec-app/
├── src/
│   ├── config/                     # Contains `ollamec.config.ts` for registering custom strategies
│   ├── llm/                        # Custom LLM client implementations
│   ├── memory/                     # Custom memory strategies (if any)
│   ├── prompts/                    # Custom prompt templates (JSON or modules)
│   ├── tools/                      # Custom tool functions or dispatchers
│   └── index.ts                    # Entry point — instantiates and runs `OllamecClient`
├── tests/                          # Unit, integration, or end-to-end tests
├── .biomerc.json                   # BiomeJS configuration
├── .lefthook.yml                   # Lefthook hooks (e.g., pre-commit)
├── .commitlintrc.json              # Conventional commit configuration
├── tsconfig.json                   # App-wide TypeScript config
├── bunfig.toml                     # Bun project config
└── README.md                       # Project-specific documentation
```

### Notes:

- All customization is handled via `ollamec.config.ts` or subclassing `BaseOllamecClient`
- Developers can override any default behavior by binding their own class to a DI token
- CLI execution is optional — developers can run Ollamec fully programmatically

---

## 🤖 Integration Workflow

> For an explanation of how this structure maps to runtime behavior and design patterns, see [ollamec-overview.md](./ollamec-overview.md).


1. **Install Ollamec via Bun**

   ```sh
   bun add ollamec
   ```

2. **Create **`` Register custom implementations using `registerClass()` or `registerValue()`

3. **Subclass or Instantiate **``

   ```ts
   const client = new OllamecClient({ sessionId: 'abc' });
   const result = await client.chat({ input: 'hello' });
   ```

4. **Write Custom Tools, Memory Strategies, and Prompt Templates**

5. **Write Tests to Verify Extension Points**

---

This document is intended as a quick reference for onboarding contributors and app developers. For deeper context on architecture, refer to `ollamec-overview.md`.

