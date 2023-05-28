import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Room } from './room.entities';

export type MemberDocument = HydratedDocument<Member>;

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
export class Member {
  id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  status: boolean;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Room',
  })
  room: Room;

  @Prop({ required: true })
  socketId: string;

  constructor(name: string, room: Room) {
    this.name = name;
    this.status = false;
    this.room = room;
    this.socketId = '';
  }
}

export const MemberSchema = SchemaFactory.createForClass(Member);
