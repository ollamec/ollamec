import { describe, expect, it } from 'bun:test';
import { DefaultPromptManager } from '@ollamec/framework//core/DefaultPromptManager';

describe('DefaultPromptManager', () => {
  it('should instantiate without error', () => {
    const manager = new DefaultPromptManager();
    expect(manager).toBeDefined();
  });
});
