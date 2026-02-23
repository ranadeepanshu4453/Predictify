import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
  }
  
  // Create visualizations directory if it doesn't exist
  const visualizationsDir = join(process.cwd(), 'visualizations');
  if (!fs.existsSync(visualizationsDir)) {
    fs.mkdirSync(visualizationsDir, { recursive: true });
    console.log('📁 Created visualizations directory');
  }
  
  // Serve static files from visualizations directory
  app.useStaticAssets(visualizationsDir, {
    prefix: '/visualizations/',
  });
  
  await app.listen(3000);
  console.log('🚀 Backend running on http://localhost:3000');
  console.log('📊 Visualizations available at http://localhost:3000/visualizations/');
}
bootstrap();