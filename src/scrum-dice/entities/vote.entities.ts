import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

import { Card } from './card.entities';
import { Room } from './room.entities';

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

  @Prop({ required: true })
  status: boolean;

  @Prop({ required: true })
  cards: Card[];

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Room',
  })
  room: Room;

  constructor(name: string, room: Room) {
    this.name = name;
    this.status = false;
    this.cards = [];
    this.room = room;
  }
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
