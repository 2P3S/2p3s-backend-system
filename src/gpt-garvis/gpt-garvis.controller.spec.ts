import { Test, TestingModule } from '@nestjs/testing';
import { GptGarvisController } from './gpt-garvis.controller';

describe('GptGarvisController', () => {
  let controller: GptGarvisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GptGarvisController],
    }).compile();

    controller = module.get<GptGarvisController>(GptGarvisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
