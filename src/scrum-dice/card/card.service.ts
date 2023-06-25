import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card } from '../entities/card.entities';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name, 'scrum-dice') private cardModel: Model<Card>,
  ) {}

  async createCard(submitCard: Card): Promise<Card> {
    const createdCard = await new this.cardModel({ ...submitCard });
    return createdCard.save();
  }
}
