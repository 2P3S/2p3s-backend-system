import { Card, CardSchema } from '../entities/card.entities';

import { CardService } from './card.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Card.name, schema: CardSchema }],
      'scrum-dice',
    ),
  ],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
