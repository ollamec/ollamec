import type { PromptTemplateInterface } from './PromptTemplateInterface.ts';

/**
 * Built-in prompt template: Format as JSON
 *
 * Reformats raw input into a structured JSON object.
 */
export const formatAsJson: PromptTemplateInterface = {
  name: 'format-as-json',
  description: 'Reformats input into structured JSON format.',
  systemPrompt: '', // Will be filled in during Step 3
};
