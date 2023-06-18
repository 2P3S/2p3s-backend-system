import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Member } from './member.entities';
import { Vote } from './vote.entities';

export type RoomDocument = HydratedDocument<Room>;
export type Deck = 'origin' | 'sub';

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
