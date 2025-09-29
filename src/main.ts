import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const appConfig = AppConfig(configService);
  const PORT = appConfig.PORT;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: [appConfig.CORS_ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // API Documentation setup
  const config = new DocumentBuilder()
    .setTitle('BLUSALT DRONE LOGISTICS API')
    .setDescription('BLUSALT DRONE LOGISTICS API DOCUMENTATION')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.PORT);
  logger.log(
    `🚀🚀🚀 Application is running on: http://localhost:${PORT}/api/v1`,
  );
  logger.log(`API Documentation available at: http://localhost:${PORT}/api`);
}
bootstrap().catch((error) => {
  console.error('Error starting the server:', error);
  process.exit(1);
});
