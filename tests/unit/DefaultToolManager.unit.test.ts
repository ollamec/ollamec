import { describe, expect, it } from 'bun:test';
import { DefaultToolManager } from '@ollamec/framework/core/DefaultToolManager';

describe('DefaultToolManager', () => {
  it('should instantiate without error', () => {
    const manager = new DefaultToolManager();
    expect(manager).toBeDefined();
  });
});
