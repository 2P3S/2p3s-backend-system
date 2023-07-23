import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Member } from './member.entities';
import { Vote } from './vote.entities';

export type CardDocument = HydratedDocument<Card>;
export type Type = 'cost-type' | 'not-cost-type';
export type CostContent =
  | '0'
  | '0.5'
  | '1'
  | '2'
  | '3'
  | '5'
  | '8'
  | '13'
  | '20'
  | '21'
  | '34'
  | '40'
  | '55'
  | '89'
  | '100';
export type NotCostContent = 'coffee' | 'question' | 'king' | 'break';
export type Content = CostContent | NotCostContent;

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
    ref: 'Vote',
  })
  vote: Vote;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Member',
  })
  member: Member;

  @Prop({ required: true })
  type: Type;

  @Prop({ required: true })
  content: Content;

  constructor(vote: Vote, member: Member, type: Type, content: Content) {
    this.vote = vote;
    this.member = member;
    this.type = type;
    this.content = content;
  }
}

export const CardSchema = SchemaFactory.createForClass(Card);
