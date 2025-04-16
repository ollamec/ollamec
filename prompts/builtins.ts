import type { PromptTemplateInterface } from './PromptTemplateInterface.ts';
import { formatAsJson } from './format-as-json.ts';
import { summarizeText } from './summarize-text.ts';

/**
 * A registry of built-in prompt templates shipped with Ollamec.
 *
 * These templates can be resolved via DI and used by PromptManager.
 */
export const builtInPromptTemplates: Record<string, PromptTemplateInterface> = {
  [summarizeText.name]: summarizeText,
  [formatAsJson.name]: formatAsJson,
};
