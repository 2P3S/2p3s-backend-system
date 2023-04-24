import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from '../entities/room.entities';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async createRoom(roomData: Room): Promise<Room> {
    const createdRoom = await new this.roomModel({ ...roomData });
    console.log(createdRoom);

    return createdRoom.save();
  }
}
