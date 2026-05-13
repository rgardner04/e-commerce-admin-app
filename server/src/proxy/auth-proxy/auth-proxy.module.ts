import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthProxyMiddleware } from './auth-proxy.middleware';

@Module({
  providers: [Logger],
})
export class AuthProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthProxyMiddleware).forRoutes({
      path: '/auth/*path',
      method: RequestMethod.ALL,
    });
  }
}
