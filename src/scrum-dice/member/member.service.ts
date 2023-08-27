import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member } from '../entities/member.entities';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name, 'scrum-dice') private memberModel: Model<Member>,
  ) {}

  async getMember(memberId: string | ObjectId): Promise<Member> {
    return this.memberModel.findById(memberId);
  }

  async createMember(memberData: Member): Promise<Member> {
    const createdMember = await new this.memberModel({ ...memberData });
    return createdMember.save();
  }

  async updateMemberConnected(
    roomId: string | ObjectId,
    memberId: string | ObjectId,
    socketId?: string,
  ): Promise<Member> {
    const member = await this.memberModel.findByIdAndUpdate(memberId, {
      $set: { status: true, socketId },
    });

    if (!member || member.room.toString() !== roomId) {
      throw new NotFoundException(`${memberId} 는 존재하지 않는 멤버입니다.`);
    }

    return this.getMember(memberId);
  }

  async updateMemberDisconnected(socketId: string): Promise<Member> {
    const member = await this.memberModel.findOneAndUpdate(
      { socketId },
      { $set: { status: false, socketId: null } },
    );

    if (!member) {
      throw new NotFoundException(`${socketId} 는 존재하지 않는 소켓입니다.`);
    }

    return this.getMember(member.id);
  }
}
