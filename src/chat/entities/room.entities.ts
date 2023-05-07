import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Member } from './member.entities';

export type RoomDocument = HydratedDocument<Room>;

@Schema({
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

  constructor(name: string) {
    this.name = name;
    this.members = [];
  }
}

export const RoomSchema = SchemaFactory.createForClass(Room);
