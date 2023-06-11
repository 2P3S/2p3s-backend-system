import { Test, TestingModule } from '@nestjs/testing';
import { ScrumDiceGateway } from './scrum-dice.gateway';

describe('ScrumDiceGateway', () => {
  let gateway: ScrumDiceGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrumDiceGateway],
    }).compile();

    gateway = module.get<ScrumDiceGateway>(ScrumDiceGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
