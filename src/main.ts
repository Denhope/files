import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  setupSwagger(app);

  const port = configService.get<number>('app.http.port');
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📑 Swagger documentation is available at: http://localhost:${port}/docs`);
}

bootstrap().catch((error) => {
  Logger.error(`❌ Error starting server:`, error);
  process.exit(1);
});
