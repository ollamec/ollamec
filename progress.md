# Ollamec Task List

This document defines all currently scoped development tasks for the Ollamec project, grouped by milestone. Each task includes its purpose, implementation path(s), behavior expectations, and status checklist.

## 🥇 MVP (Minimum Viable Prototype)
These tasks lay the foundation for the core framework, CLI, DI system, and base developer experience.

- [x] **Scaffold Core Project Structure**  
  **Purpose:** Initialize project using Bun, establish standard layout and baseline config.  
  **Paths:** `core/`, `cli/`, `config/`, `memory/`, `llm/`, `mcp/`, `prompts/`, `custom/`  
  **Details:**
  - Initialize with `bun init`
  - Create `bunfig.toml`, `tsconfig.json`
  - Add scaffolded folders and entry files for each layer

- [x] **Set Up DI Container using tsyringe**  
  **Purpose:** Establish global injectable config registry  
  **Path:** `config/ollamec.config.ts`  
  **Details:**
  - Register default strategies (PromptManager, MemoryStore, etc.)
  - Enable developer overrides via user-facing config

- [x] **Define Core Interfaces**  
  **Purpose:** Contract-first design for pluggable services  
  **Path:** `core/interfaces/`  
  **Details:**
  - `LLMClientInterface`
  - `PromptManagerInterface`
  - `ToolManagerInterface`
  - `MemoryStoreInterface`
  - `TransportInterface`

- [x] **Register Built-In Strategy Implementations**  
  **Purpose:** Link default services into the DI container  
  **Paths:** `core/`, `memory/`, `mcp/`  
  **Details:**
  - Bind defaults to DI tokens
  - Cover strategies for memory, transport, prompt, tools

- [x] **Implement PromptManager**  
  **Purpose:** Compose final LLM prompt array from input, memory, tools  
  **Path:** `core/PromptManager.ts`  
  **Details:**
  - Format OpenAI-style messages
  - Include injected memory and tool responses

- [x] **Implement ToolManager**  
  **Purpose:** Parse and route tool calls  
  **Path:** `core/ToolManager.ts`  
  **Details:**
  - Support tool call syntax: `toolName(args)`
  - Inject outputs into LLM message flow

- [x] **Register MemoryStore via DI**  
  **Purpose:** Wire up `InMemorySlidingMemory` as the default `MemoryStoreInterface` in the DI container  
  **Path:** `memory/`, `config/ollamec.config.ts`  
  **Details:**
  - Use `tsyringe` to register `InMemorySlidingMemory` to the `MemoryStoreInterface` token
  - Make this the default fallback unless overridden by a user
  - Add test that resolves the store from the DI container
  - Ensure TypeDoc-compatible comments are present in the config
  - This builds on an existing implementation and test stub

- [ ] **Bootstrap Ollamec CLI**  
  **Purpose:** Add command entrypoint and CLI structure  
  **Paths:** `bin/ollamec.ts`, `cli/commands/`  
  **Details:**
  - Use Commander.js
  - Add `run`, `plugin`, `config` commands

- [ ] **Add Built-in Prompt Templates**  
  **Purpose:** Provide ready-made system prompts  
  **Path:** `prompts/`  
  **Details:**
  - Include `summarize-text`, `format-as-json`
  - Allow auto-discovery

- [x] **Setup Test Structure**  
  **Purpose:** Establish testing directories and integrate coverage reporting  
  **Path:** `tests/`  
  **Details:**
  - Create `unit/`, `integration/`, and `e2e/` folders
  - Use Bun's test runner
  - Add minimal test coverage for:
    - `core/DefaultPromptManager.ts`
    - `core/DefaultToolManager.ts`
    - `llm/DefaultLLMClient.ts`
    - `mcp/DefaultTransport.ts`
    - `memory/InMemorySlidingMemory.ts`
  - Integrate Codecov via GitHub Actions
  - Add `.codecov.yml` config and `codecov` badge

## 🚀 v1 (Functional First Release)

These tasks complete the full runtime for local and remote usage, including LLM client, memory strategies, transports, and documentation.

- [ ] **Implement OllamaClient (LLMClientInterface)**  
  **Purpose:** Send/receive chat messages from Ollama  
  **Path:** `llm/OllamaClient.ts`  
  **Details:**
  - Bun-native fetch
  - OpenAI-style message format

- [ ] **Implement Core Memory Strategies**  
  **Purpose:** Add production-ready memory adapters  
  **Path:** `memory/`  
  **Details:**
  - Add `StatelessMemory`, `SqliteSlidingMemory`, `RedisSlidingMemory`

- [ ] **Implement MCPClient**  
  **Purpose:** Connect and serve structured prompts over MCP  
  **Path:** `mcp/MCPClient.ts`  
  **Details:**
  - JSON-RPC parsing
  - Routed prompt execution

- [ ] **Implement StdioTransport and SSETransport**  
  **Purpose:** Allow CLI and streaming interfaces  
  **Path:** `mcp/transports/`  
  **Details:**
  - `StdioTransport`: sync command-line
  - `SSETransport`: long-lived connection

- [ ] **Scaffold Docs Folder**  
  **Purpose:** Document usage, extension, and architecture  
  **Path:** `docs/`  
  **Details:**
  - Docusaurus preferred
  - Include task-based guides and API references

