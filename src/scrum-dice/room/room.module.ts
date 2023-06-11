import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomService } from './room.service';
import { Room, RoomSchema } from '../entities/room.entities';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Room.name, schema: RoomSchema }],
      'scrum-dice',
    ),
  ],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
