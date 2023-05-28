import { Test, TestingModule } from '@nestjs/testing';
import { ScrumDiceService } from './scrum-dice.service';

describe('ScrumDiceService', () => {
  let service: ScrumDiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrumDiceService],
    }).compile();

    service = module.get<ScrumDiceService>(ScrumDiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
