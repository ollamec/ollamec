import type { PromptTemplateInterface } from './PromptTemplateInterface.ts';

/**
 * Built-in prompt template: Summarize Text
 *
 * Produces a concise summary from a block of input text.
 */
export const summarizeText: PromptTemplateInterface = {
  name: 'summarize-text',
  description: 'Produces a concise summary from input text.',
  systemPrompt: '', // Will be filled in during Step 3
};
