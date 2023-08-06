import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

import { Room } from './room.entities';
import { Cards } from './card.entities';

export type VoteDocument = HydratedDocument<Vote>;

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
export class Vote {
  id: ObjectId;

  @Prop({ required: true })
  name: string;

  // 개표 여부를 나타내는 상태 값
  @Prop({ required: true })
  status: boolean;

  @Prop(
    raw({
      type: { type: String, required: true },
      content: { type: Number, required: true },
    }),
  )
  cards: Cards;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Room',
  })
  room: Room;

  constructor(name: string, room: Room) {
    this.name = name;
    this.status = false;
    this.cards = {};
    this.room = room;
  }
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
