import { describe, expect, it } from 'bun:test';
import { builtInPromptTemplates } from '@ollamec/framework/prompts/builtins.ts';

describe('builtInPromptTemplates', () => {
  it('should include summarize-text template', () => {
    const tpl = builtInPromptTemplates['summarize-text'];
    expect(tpl).toBeDefined();
    expect(tpl.name).toBe('summarize-text');
    expect(typeof tpl.systemPrompt).toBe('string');
    expect(tpl.systemPrompt.length).toBeGreaterThan(0);
  });

  it('should include format-as-json template', () => {
    const tpl = builtInPromptTemplates['format-as-json'];
    expect(tpl).toBeDefined();
    expect(tpl.name).toBe('format-as-json');
    expect(typeof tpl.systemPrompt).toBe('string');
    expect(tpl.systemPrompt.length).toBeGreaterThan(0);
  });

  it('should expose exactly two templates', () => {
    expect(Object.keys(builtInPromptTemplates)).toHaveLength(2);
  });
});
