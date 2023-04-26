import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Room } from './room.entities';

export type MemberDocument = HydratedDocument<Member>;

@Schema()
export class Member {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  status: boolean;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  })
  room: Room;

  constructor(id: string, name: string, room: Room) {
    this.id = id;
    this.name = name;
    this.status = false;
    this.room = room;
  }

  getId(): string {
    return this.id;
  }
}

export const MemberSchema = SchemaFactory.createForClass(Member);
