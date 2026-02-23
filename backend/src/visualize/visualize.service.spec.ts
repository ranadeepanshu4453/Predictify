import { Test, TestingModule } from '@nestjs/testing';
import { VisualizeService } from './visualize.service';

describe('VisualizeService', () => {
  let service: VisualizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisualizeService],
    }).compile();

    service = module.get<VisualizeService>(VisualizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
