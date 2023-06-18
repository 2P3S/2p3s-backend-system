import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Member } from './member.entities';
import { Vote } from './vote.entities';

export type RoomDocument = HydratedDocument<Room>;
/**
 * FIBONACCI_NUMBERS: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
 * MODIFIED_FIBONACCI_NUMBERS: 0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100
 */
export type Deck = 'FIBONACCI_NUMBERS' | 'MODIFIED_FIBONACCI_NUMBERS';

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
export class Room {
  id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: [
      {
        type: Types.ObjectId,
        ref: 'Member',
      },
    ],
  })
  members: Member[];

  @Prop({
    required: true,
    type: [
      {
        type: Types.ObjectId,
        ref: 'Vote',
      },
    ],
  })
  votes: Vote[];

  @Prop({ required: true })
  deck: Deck;

  constructor(name: string, deck: Deck) {
    this.name = name;
    this.members = [];
    this.votes = [];
    this.deck = deck;
  }
}

export const RoomSchema = SchemaFactory.createForClass(Room);
