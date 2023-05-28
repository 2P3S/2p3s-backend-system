import { Test, TestingModule } from '@nestjs/testing';
import { ScrumDiceController } from './scrum-dice.controller';

describe('ScrumDiceController', () => {
  let controller: ScrumDiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrumDiceController],
    }).compile();

    controller = module.get<ScrumDiceController>(ScrumDiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
