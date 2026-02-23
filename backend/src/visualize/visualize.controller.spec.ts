import { Test, TestingModule } from '@nestjs/testing';
import { VisualizeController } from './visualize.controller';
import { VisualizeService } from './visualize.service';

describe('VisualizeController', () => {
  let controller: VisualizeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisualizeController],
      providers: [VisualizeService],
    }).compile();

    controller = module.get<VisualizeController>(VisualizeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
