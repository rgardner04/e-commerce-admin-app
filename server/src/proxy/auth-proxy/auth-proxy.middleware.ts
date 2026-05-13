import { Injectable, Inject, Logger, NestMiddleware } from '@nestjs/common';
import { RequestHandler } from '@nestjs/common/interfaces';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class AuthProxyMiddleware implements NestMiddleware {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.authProxy = createProxyMiddleware({
      target: this.configService.get<string>('AUTH_SERVICE_URL'),
      changeOrigin: true,
      secure: false,
      on: {
        proxyReq: (proxyReq, req: Request, _res: Response) => {
          this.logger.log(`Proxying request to the Auth Service`, {
            requestPath: req.path,
          });

          if (!req.body) return;

          const bodyData = JSON.stringify(req.body);

          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));

          proxyReq.write(bodyData);
        },
        proxyRes: (proxyRes, _req: Request, _res: Response) => {
          this.logger.log('Handling proxied response from Auth Service.', {
            responseStatus: proxyRes.statusCode,
          });
        },
        error: (error, req: Request, res: Response) => {
          this.logger.error(
            `An error occurred while proxying the request to the Auth Service.`,
            {
              error: error instanceof Error ? error?.message : '',
              requestPath: req.path,
            },
          );
        },
      },
    });
  }

  private authProxy: RequestHandler;
  use(req: Request, res: any, next: () => void) {
    this.authProxy(req, res, next);
  }
}
