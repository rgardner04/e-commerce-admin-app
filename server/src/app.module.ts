import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthProxyModule } from './proxy/auth-proxy/auth-proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
      exclude: ['/api/{*path}'],
      serveStaticOptions: {
        fallthrough: true,
      },
    }),
    AuthProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
