/**
 * Represents a reusable system prompt template.
 *
 * Used by the PromptManager to inject predefined behavior
 * into the initial message flow.
 */
export interface PromptTemplateInterface {
  /** Unique identifier for the template */
  name: string;

  /** Short description of the template’s purpose */
  description: string;

  /** The system prompt string used to guide the LLM */
  systemPrompt: string;
}
