import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from '../entities/room.entities';
import { Member } from '../entities/member.entities';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async createRoom(roomData: Room): Promise<Room> {
    const createdRoom = await new this.roomModel({ ...roomData });
    return createdRoom.save();
  }

  async getRoom(roomId: string): Promise<Room> {
    return await this.roomModel.findOne({ id: roomId });
  }

  async updateRoomForAddMember(
    roomId: string,
    updateMember: Member,
  ): Promise<Room> {
    const existingRoom = await this.roomModel.findOneAndUpdate(
      { id: roomId },
      { $push: { members: updateMember } },
      { new: true },
    );

    if (!existingRoom) {
      throw new NotFoundException(`Room ${roomId} is  not found`);
    }
    return existingRoom;
  }
}
