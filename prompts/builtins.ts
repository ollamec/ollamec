import type { PromptTemplateInterface } from './PromptTemplateInterface.ts';
import { formatAsJson } from './format-as-json.ts';
import { summarizeText } from './summarize-text.ts';

/** Internal constant keys for built-in prompt templates. */
const TEMPLATE_KEYS = {
  FORMAT_AS_JSON: 'format-as-json',
  SUMMARIZE_TEXT: 'summarize-text',
} as const;

/**
 * A registry of built-in prompt templates shipped with Ollamec.
 *
 * These templates can be resolved via DI and used by PromptManager.
 */
export const builtInPromptTemplates: Record<string, PromptTemplateInterface> = {
  [TEMPLATE_KEYS.SUMMARIZE_TEXT]: summarizeText,
  [TEMPLATE_KEYS.FORMAT_AS_JSON]: formatAsJson,
};
