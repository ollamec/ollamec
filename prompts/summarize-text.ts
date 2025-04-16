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
Follow these requirements:
1. Create a summary of 2-3 sentences maximum
2. Focus on key action items, decisions, and main concepts
3. Maintain the original tone (technical, casual, formal)
4. Preserve any critical numerical data or statistics
Respond with a plain-language summary following these guidelines.`,
};
