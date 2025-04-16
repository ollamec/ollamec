import type { PromptTemplateInterface } from './PromptTemplateInterface.ts';

/**
 * Built-in prompt template: Format as JSON
 *
 * Reformats raw input into a structured JSON object.
 */
export const formatAsJson: PromptTemplateInterface = {
  name: 'format-as-json',
  description: 'Reformats input into structured JSON format.',
  systemPrompt: `You are a structured output generator.
When the user provides unstructured information, return a well-formed JSON object.
Only return raw JSON with no explanations or formatting.`,
};
