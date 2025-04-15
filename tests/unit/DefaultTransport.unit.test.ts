import { describe, expect, it } from 'bun:test';
import { DefaultTransport } from '@ollamec/framework/mcp/DefaultTransport';

describe('DefaultTransport', () => {
  it('should instantiate without error', () => {
    const transport = new DefaultTransport();
    expect(transport).toBeDefined();
  });
});
