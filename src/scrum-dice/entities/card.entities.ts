import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Member } from './member.entities';
import { Vote } from './vote.entities';

export type CardDocument = HydratedDocument<Card>;
export type Type = 'cost-type' | 'not-cost-type';
export type CostContent =
  | '1'
  | '2'
  | '3'
  | '5'
  | '8'
  | '13'
  | '20'
  | '40'
  | '100';
export type NotCostContent = 'coffee' | 'question' | 'infinity' | 'break';
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

  // 투표 여부를 나타내는 상태 값
  @Prop({ required: true })
  status: boolean;

  constructor(vote: Vote, member: Member, type: Type, content: Content) {
    this.vote = vote;
    this.member = member;
    this.type = type;
    this.content = content;
    this.status = false;
  }
}

export const CardSchema = SchemaFactory.createForClass(Card);
