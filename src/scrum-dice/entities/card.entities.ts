import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Member } from './member.entities';

export type CardDocument = HydratedDocument<Card>;
export type CardType = 'cost-type' | 'not-cost-type';
export type CostCardContent =
  | '1'
  | '2'
  | '3'
  | '5'
  | '8'
  | '13'
  | '20'
  | '40'
  | '100';
export type NotCostCardContent = 'coffee' | 'question' | 'infinity' | 'break';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Card {
  id: ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Member',
  })
  member: Member;

  @Prop({ required: true })
  cardType: CardType;

  @Prop({ required: true })
  cardContent: CostCardContent | NotCostCardContent;

  constructor(
    member: Member,
    cardType: CardType,
    cardContent: CostCardContent | NotCostCardContent,
  ) {
    this.member = member;
    this.cardType = cardType;
    this.cardContent = cardContent;
  }
}

export const CardSchema = SchemaFactory.createForClass(Card);
