import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member } from '../entities/member.entities';
import { Room } from '../entities/room.entities';
import { Vote } from '../entities/vote.entities';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name, 'scrum-dice') private roomModel: Model<Room>,
  ) {}

  async createRoom(roomData: Room): Promise<Room> {
    const createdRoom = await new this.roomModel({ ...roomData });
    return createdRoom.save();
  }

  async getRoom(roomId: string | ObjectId): Promise<Room> {
    return this.roomModel.findById(roomId);
  }

  async updateRoomForAddMember(
    roomId: string,
    updateMember: Member,
  ): Promise<Room> {
    const room = await this.roomModel.findByIdAndUpdate(
      roomId,
      { $push: { members: updateMember } },
      { new: true },
    );

    if (!room) {
      throw new NotFoundException(`${roomId} 는 존재하지 않는 방입니다.`);
    }

    return this.getRoom(roomId);
  }

  async updateRoomForCreateVote(
    roomId: string | ObjectId,
    createdVote: Vote,
  ): Promise<Room> {
    const room = await this.roomModel.findByIdAndUpdate(
      roomId,
      { $push: { votes: createdVote } },
      { new: true },
    );

    if (!room) {
      throw new NotFoundException(`${room.id} 는 존재하지 않는 방입니다.`);
    }

    return this.getRoom(room.id);
  }
}
