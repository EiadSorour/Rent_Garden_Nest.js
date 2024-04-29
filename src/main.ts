import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppExceptionFilter } from './utils/app.ExceptionFilter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Garden Rent API")
    .setDescription('This is API for rent garden app endpoints')
    .setVersion('1.0')
    .addBearerAuth({type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'headers'})
    .build(); 
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.useGlobalFilters(new AppExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  await app.listen(3000);
}
bootstrap();
