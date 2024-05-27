import {
  BadRequestException,
  Module,
  ValidationPipe,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceInstance from 'src/config/database/connections/default';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { first, has, values } from 'lodash';
import { LoggerModule } from 'nestjs-pino';
import helmet from 'helmet';
import { AuthModule } from 'src/auth/auth.module';
import { TokenService } from 'src/auth/token/token.service';
import { CartModule } from 'src/cart/cart.module';
import appConfig from 'src/config/envs/app.config';
import awsConfig from 'src/config/envs/aws.config';
import { pathFromRoot } from 'src/helpers/general';
import { OrderModule } from 'src/order/order.module';
import { ProductModule } from 'src/product/product.module';
import { ExtractTokenMiddleWare } from 'src/shared/extractToken.middleware';
import { SharedModule } from 'src/shared/shared.module';
import { UserService } from 'src/user/services/user.service';
import { UserModule } from 'src/user/user.module';
import { AppService } from './services/app.service';
import { SharedService } from 'src/shared/services/shared.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');

const validator = new ValidationPipe({
  whitelist: false,
  transform: true,
  exceptionFactory(errors) {
    const formattedErrors = errors;
    return new BadRequestException(
      {
        type: 'VALIDATION_ERROR',
        errors: formattedErrors,
        message: 'Invalid data',
      },
      'Bad Request',
    );
  },
});

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [appConfig.KEY],
      async useFactory(applicationConfig: ConfigType<typeof appConfig>) {
        const nodeEnv = applicationConfig.NODE_ENV;

        return {
          pinoHttp: {
            transport: {
              target: 'pino-pretty',
              options:
                nodeEnv === 'production'
                  ? {
                      destination: pathFromRoot('./logs/pm2/out.log'),
                      colorize: false,
                      mkdir: true,
                      crlf: true,
                    }
                  : undefined,
            },
          },
        };
      },
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [appConfig, awsConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        if (!dataSourceInstance.isInitialized) {
          dataSourceInstance.setOptions({ entities: ['dist/**/*.entity.js'] });
          await dataSourceInstance.initialize();
        }

        return dataSourceInstance;
      },
    }),
    JwtModule.registerAsync({
      async useFactory(configService: ConfigService) {
        await ConfigModule.envVariablesLoaded;

        return {
          signOptions: {
            expiresIn: configService.get('app.JWT_EXPIRY', '8h'),
          },
          secret: configService.get('app.JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    SharedModule,
    UserModule,
    CartModule,
    OrderModule,
    ProductModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: validator,
    },
    SharedService,
    JwtService,
    AppService,
    TokenService,
    UserService,
    // OrderService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors(), helmet(), ExtractTokenMiddleWare)
      .exclude('/auth/*')
      .exclude('')
      .forRoutes('*');
  }
}
