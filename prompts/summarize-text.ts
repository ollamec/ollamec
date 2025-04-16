import type { PromptTemplateInterface } from './PromptTemplateInterface.ts';

/**
 * Built-in prompt template: Summarize Text
 *
 * Produces a concise summary from a block of input text.
 */
export const summarizeText: PromptTemplateInterface = {
  name: 'summarize-text',
  description: 'Produces a concise summary from input text.',
  systemPrompt: `You are a helpful assistant that summarizes information clearly and concisely.
Focus only on the most important details. Avoid repetition or filler.
Respond with a plain-language summary of the user's message.`,
};
