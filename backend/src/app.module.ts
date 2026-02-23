import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisualizeModule } from './visualize/visualize.module';

@Module({
  imports: [VisualizeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
