import { describe, expect, it } from 'bun:test';
import { DefaultLLMClient } from '@ollamec/framework/llm/DefaultLLMClient';

describe('DefaultLLMClient', () => {
  it('should instantiate without error', () => {
    const client = new DefaultLLMClient();
    expect(client).toBeDefined();
  });
});
