# 🔧 Ollamec Post-MVP Planning Tracker

This document tracks issues and inconsistencies across the orchestration flow, DI setup, and interface implementations in the Ollamec CLI and framework internals. Each entry should be addressed to ensure stable and predictable behavior across prompt building, tool execution, memory usage, and LLM integration.

---

## Major Changes

### `MemoryStoreInterface` needs expanded lifecycle control

- Symptom: Memory implementations have unclear behavior around session lifecycle, causing brittle assumptions (e.g., `load()` throws if session isn't initialized).
- Proposal:
    - Replace existing `load/save` contract with a more expressive lifecycle model:
      ```ts
      connect(session: MemorySession): Promise<boolean>;
      load(options: { limit?: number; offset?: number }): Promise<ChatMessage[]>;
      append(messages: ChatMessage[]): Promise<boolean>;
      ```
    - Benefits:
        - Enables richer memory implementations (streaming, persistent, remote)
        - Makes it explicit when memory sessions begin
        - Avoids `load()` failures on uninitialized state

### `Refactor MemoryStoreInterface`

- Symptom: Memory implementations have unclear behavior around session lifecycle, causing brittle assumptions (e.g., `load()` throws if session isn't initialized).
- Proposal:
    - Replace existing `load/save` contract with a more expressive lifecycle model:
      ```ts
      connect(session: MemorySession): Promise<boolean>;
      load(options: { limit?: number; offset?: number }): Promise<ChatMessage[]>;
      append(messages: ChatMessage[]): Promise<boolean>;
      ```
    - Include diagnostics and fail-safe behavior in `InMemorySlidingMemory`
    - Benefits:
        - Enables richer memory implementations (streaming, persistent, remote)
        - Makes it explicit when memory sessions begin
        - Avoids `load()` failures on uninitialized state
        - Improves developer experience when testing custom clients

---

### `ToolManagerInterface.runTools()`

- Expected Output: Should return name-keyed outputs for prompt injection.
- Issue: Too loosely defined — `toolResults` format isn't ideal for DI or prompt usage.
- Fix Plan:
    - Keep current return type (`ToolResult[]`) but introduce a utility function
    - Create `extractToolResponses()` in `core/utils/toolHelpers.ts` to convert `ToolResult[]` to `Record<string, unknown>` for use in `PromptContext`
    - Avoids interface churn while making prompt integration easier and testable

### `PromptManagerInterface.buildPrompt()`

- Issue: Doesn’t specify default/system message behavior
- Decision: System prompt injection should be the responsibility of the `OllamecClient`, not `PromptManager`.
- Rationale: `PromptManager` should remain focused purely on transforming `PromptContext` into a structured prompt. Session state, system message injection, and prompt seeding logic belong to the orchestration layer (`OllamecClient`).
- Fix Plan:
    - Remove responsibility for system prompt injection from `PromptManager`
    - `OllamecClient` should detect if session is new (e.g., `chatHistory.length === 0`) and prepend a named system prompt from `TOKENS.PromptTemplates`
    - `PromptManager.buildPrompt()` should remain deterministic: history → tools → user input

### `LLMClientInterface.chat()`

- Issue: Assumes OpenAI-style output with `choices[0].message`
- Fix Plan:
    - Add contract enforcement for `choices.length >= 1`
    - Normalize interface to support single-message shorthand

---

### Create `OllamecClient`

- Objective: Define a structured, developer-friendly entrypoint for programmatic and CLI-based agents, and phase out the `commander`-based CLI system.
  Define a structured, developer-friendly entrypoint for programmatic and CLI-based agents.
- Scope:
    - Create `OllamecClientInterface`: contract for agents that wish to handle input/session orchestration
    - Create `BaseOllamecClient`: handles tool execution, prompt building, memory, LLM dispatch
    - Create default `OllamecClient`: pre-configured with default strategies for quick usage
    - Move orchestration logic out of CLI and into `BaseOllamecClient`, removing `commander` entirely
- Rationale:
    - Promotes clean separation between orchestration and invocation layers
    - Gives developers flexibility to subclass, replace, or extend
    - Removes dependency on CLI frameworks, and promotes `OllamecClient` as the primary orchestration interface

---

## 🧱 Developer-Facing OllamecClient Design Direction

### Built-in Prompt Template Handling

- BaseOllamecClient should resolve a named startup template from `TOKENS.PromptTemplates`

- This should be injected into the message flow if the session is new (e.g., empty memory)

- PromptManager should **not** be responsible for loading templates — it should receive them via `PromptContext`

- This enables:

    - Developer-defined onboarding/system prompts
    - Clear separation of template registry vs. prompt construction logic

- Developers should be able to subclass a base `OllamecClient` and customize the following:

    - MemoryStore implementation
    - LLMClientInterface implementation (e.g. local, OpenAI, Claude)
    - Initial system prompt (via named entry in `PromptTemplates`)
    - MCP tools to register in DI

- Each `OllamecClient` instance should own its own DI container (not global), initialized on construction.

- That container should be responsible for registering or swapping in:

    - PromptManager
    - ToolManager
    - MemoryStore
    - LLMClientInterface
    - PromptTemplates and session config (optional)

- The base `.chat()` method should orchestrate the standard flow:

    - Load memory
    - Run tools
    - Build prompt
    - Send to LLMClient
    - Save output to memory

- This enables:

```ts
const ollamec = new OllamecClient({ sessionId: 'thread-abc' });
const response = await ollamec.chat({ input: 'Who won the game?' });
```

- Developers may extend `BaseOllamecClient` to build richer clients:

```ts
class CustomOllamecClient extends BaseOllamecClient {
  async askOpenAI(input: string) { ... }
  async askLlama(input: string) { ... }
}
```

- This encourages a flexible, testable, injectable agent architecture with DI-scoped strategies and zero reliance on global registration.

---

> This file is canonical for tracking issues in the orchestration layer. All inconsistencies should be logged here before patches.

---

## 📌 Task Order

Defines the preferred sequence for tackling post-mvp issues based on architectural dependencies and build confidence:

1. **Improve Error Diagnostics in Orchestration**
2. **Add extractToolResponses() utility**
3. **Refactor MemoryStoreInterface**
4. **Harden LLMClientInterface.chat() contract**
5. **Implement OllamaClient**
6. **Create OllamecClient**

## 🔄 Milestone Changes

### Milestone Renaming

- The `v1` milestone has been renamed to **post-mvp**
- The `v2` milestone has been renamed to **v1**



## 📋 New Issues for new milestone post-mvp

These issues should be created and assigned to the `post-mvp` milestone based on the Major Changes section above:

1. **Refactor MemoryStoreInterface**

    - Redesign the core memory contract with `connect/load/append`
    - Add diagnostics and fail-safes to `InMemorySlidingMemory`

2. **Create OllamecClient**

    - Create `OllamecClientInterface`, `BaseOllamecClient`, and default `OllamecClient`
    - Move CLI orchestration logic into `BaseOllamecClient`
    - Phase out `commander`

3. **Add extractToolResponses() utility**

    - Add helper to convert `ToolResult[]` → `Record<string, unknown>` for prompt injection

4. **Harden LLMClientInterface.chat() contract**

    - Ensure `choices.length >= 1`
    - Normalize single-message response fallback behavior

5. **Improve Error Diagnostics in Orchestration**

    - Add try/catch handling, verbose logs, and `--debug` support for dev UX
    - Introduce a centralized logger to be used by orchestration, tools, and memory
    - Ensure the logger supports configurable levels (info, debug, error) and optional CLI colorization

These updates reflect milestone reassignments or removals made after initial issue triage:

- ✅ Closed: **#8 Bootstrap Ollamec CLI** (CLI orchestration now moved into `OllamecClient`)
- 🔄 Moved to post-mvp: **#12 Implement OllamaClient** (core runtime requirement)

> Additional issues from this doc will be added to the `post-mvp` milestone where appropriate.

