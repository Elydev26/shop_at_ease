import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import processEnvObj from './config/envs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appName = processEnvObj.PROJECT_NAME || 'Nest Js app';
  const port = Number(processEnvObj.SERVER_PORT || 4200);
  await app.listen(port);
  Logger.log('', `${appName} started on port ${port}`);

  // Get the HTTP server instance
  const httpServer = app.getHttpServer();

  // Get the router instance from the HTTP server
  const router = httpServer._events.request._router;

  const availableRoutes: [] = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter((item) => item !== undefined);
  Logger.log(availableRoutes, 'Available routes');
}
bootstrap();
