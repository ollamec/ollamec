# Ollamec Overview

Ollamec is a lightweight backend framework for building MCP-compliant developer agents and orchestration systems. It provides dependency-injected components for working with LLMs, memory stores, tools, and structured prompt pipelines.

---

## Goals

- Provide a minimal, dependency-injected backend framework for building LLM-driven agents
- Emphasize tool augmentation, memory layering, and structured prompting
- Support both local-first CLI usage and remote API integration
- Make it easy for developers to swap in their own strategies without rewriting core logic

---

## The Problem We're Solving

Existing agent frameworks often force developers into specific patterns, such as:
- Long-running HTTP servers
- Fully-coupled memory and prompt strategies
- Non-extensible tool management

Ollamec lets developers build their own agents using composable, DI-powered parts — not a monolith.

---

## What Exists vs What We're Building

| Existing Stack         | Ollamec's Direction                                   |
|------------------------|--------------------------------------------------------|
| LangChain             | Heavy, opinionated, runtime-coupled                   |
| Semantic Kernel       | API-driven orchestration via plugins                  |
| OpenLLM               | Server-focused, LLM runtime abstraction               |
| Ollama                | Model runner, not an orchestrator                     |

---

## Developer Experience

- Install and run with minimal configuration
- Use default strategies or swap in your own
- Extend core interfaces like `PromptManagerInterface`, `ToolManagerInterface`, etc.
- Compose orchestration flows using a single injectable client

```ts
const ollamec = new OllamecClient({ sessionId: 'xyz' });
const result = await ollamec.chat({ input: 'What is the weather today?' });
```

---

## Dependency Injection and Configuration

Ollamec uses `tsyringe` to provide local, override-friendly dependency injection. Each `OllamecClient` owns its own container and resolves:

- `PromptManagerInterface`
- `LLMClientInterface`
- `ToolManagerInterface`
- `MemoryStoreInterface`
- `PromptTemplates`

This makes it easy to override behavior or create scoped clients without global side effects.

---

## Tech Stack

- **Language:** TypeScript
- **Runner:** Bun
- **DI:** tsyringe
- **Testing:** Bun test
- **Prompt Format:** OpenAI-style message arrays
- **Core Interfaces:** PromptManagerInterface, ToolManagerInterface, LLMClientInterface, MemoryStoreInterface, TransportInterface

---

## Key Concepts

See the sections below for how DI, prompt formatting, tools, and memory strategies work together in the client runtime.

---

## Core Features

Ollamec exposes a set of injectable strategies and runtime utilities that developers can compose as needed.

See [framework-layout.md](./framework-layout.md) for a breakdown of how these are organized in the filesystem.

---

## OllamecClient Architecture

OllamecClient is the central orchestrator for MCP-style agents. It abstracts away CLI logic and allows direct control via code. Developers can:

- Extend `BaseOllamecClient` to create custom clients
- Use the default `OllamecClient` for plug-and-play usage
- Register custom tools, memory strategies, or prompt templates via DI

Each client instance owns its own DI container, allowing scoped overrides.

---

## Prompt Composition

Prompt construction is handled by the `PromptManagerInterface`. It accepts a `PromptContext` containing:

- Raw user input
- Tool response objects
- Previously stored memory messages

`BaseOllamecClient` is responsible for injecting system prompts at the start of a session. These come from the `PromptTemplates` registry (injected via DI).

---

## Memory Model

Memory is no longer limited to load/save. Ollamec supports a session-aware lifecycle:

```ts
connect(session: MemorySession): Promise<boolean>
load(options?: { limit?: number }): Promise<ChatMessage[]>
append(messages: ChatMessage[]): Promise<boolean>
```

This allows richer implementations and improves safety for distributed contexts.

---

## LLMClient Expectations

The `LLMClientInterface` should implement:

```ts
chat(request: ChatRequest): Promise<ChatResponse>
```

The response must include at least one message (`choices[0].message`).

---



## Use Cases

> See also: [framework-layout.md](./framework-layout.md) for how these use cases map to directory and runtime structure.


- Local-first CLI agents that call local models or Ollama
- Serverless API agents for OpenAI/Claude
- Streaming LLM responses with intermediate tool augmentation
- Custom agents for automating task execution or search

---

Ollamec aims to be the backend LLM runtime you reach for when you want full control over tools, memory, and prompt logic — but don’t want to rebuild the framework every time.

