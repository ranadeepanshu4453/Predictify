import { Module } from '@nestjs/common';
import { VisualizeService } from './visualize.service';
import { VisualizeController } from './visualize.controller';
import { VisualiseHelper } from './visualise.helper';

@Module({
  controllers: [VisualizeController],
  providers: [VisualizeService,VisualiseHelper],
})
export class VisualizeModule {}
