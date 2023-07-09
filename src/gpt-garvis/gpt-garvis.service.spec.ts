import { Test, TestingModule } from '@nestjs/testing';
import { GptGarvisService } from './gpt-garvis.service';

describe('GptGarvisService', () => {
  let service: GptGarvisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GptGarvisService],
    }).compile();

    service = module.get<GptGarvisService>(GptGarvisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
