import { AuthProxyMiddleware } from './auth-proxy.middleware';

describe('AuthProxyMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthProxyMiddleware()).toBeDefined();
  });
});
