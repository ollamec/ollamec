# @ollamec/framework

> Core developer framework for building MCP-compliant LLM agents with Ollama and Bun.

This is the foundational package in the **Ollamec** ecosystem. It provides a modular, strategy-based architecture for building developer-first LLM tools using the Model Context Protocol (MCP).

## ✨ Features

- Fully pluggable architecture via `tsyringe` dependency injection
- Core service interfaces:
    - `PromptManagerInterface`
    - `ToolManagerInterface`
    - `MemoryStoreInterface`
    - `LLMClientInterface`
    - `TransportInterface`
- Default in-memory and echo-style implementations for rapid prototyping
- Designed for Bun runtime — fast, lightweight, and zero polyfill
- Override behavior cleanly in `ollamec.config.ts`

## 🧩 Pluggable Services

| Service         | Interface Name          | Default Implementation       | DI Token         |
|-----------------|-------------------------|-------------------------------|------------------|
| PromptManager   | `PromptManagerInterface`| `DefaultPromptManager`        | `TOKENS.PromptManager` |
| ToolManager     | `ToolManagerInterface`  | `DefaultToolManager`          | `TOKENS.ToolManager`   |
| MemoryStore     | `MemoryStoreInterface`  | `InMemorySlidingMemory`       | `TOKENS.MemoryStore`   |
| LLMClient       | `LLMClientInterface`    | `DefaultLLMClient`            | `TOKENS.LLMClient`     |
| Transport       | `TransportInterface`    | `DefaultTransport`            | `TOKENS.Transport`     |

## 🔧 Example Override

To override a default strategy in your own app:

```ts
// src/config/ollamec.config.ts
import { container } from 'tsyringe';
import { TOKENS } from '@ollamec/framework/config/ollamec.config.ts';
import { MyCustomPromptManager } from '../services/MyCustomPromptManager.ts';

container.register(TOKENS.PromptManager, {
  useClass: MyCustomPromptManager,
});
```

## 📦 Package Status

This package is considered **MVP-complete**:

- [x] DI container scaffolded
- [x] Core service interfaces defined
- [x] Default implementations registered
- [x] Strategy pattern applied across LLM, tools, memory, and transport

## 🧪 Next Steps

- Add unit + integration tests for each service
- Implement real Ollama client adapter
- Wire CLI to use DI-backed runtime
