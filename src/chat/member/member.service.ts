import { Model, ObjectId } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from '../entities/member.entities';

@Injectable()
export class MemberService {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}

  async getMember(memberId: string | ObjectId): Promise<Member> {
    return this.memberModel.findById(memberId);
  }

  async createMember(memberData: Member): Promise<Member> {
    const createdMember = await new this.memberModel({ ...memberData });
    return createdMember.save();
  }

  async updateMemberStatus(
    memberId: string | ObjectId,
    status: boolean,
  ): Promise<Member> {
    const member = await this.memberModel.findByIdAndUpdate(memberId, {
      $set: { status },
    });

    if (!member) {
      throw new NotFoundException(`Member ${memberId} is not found`);
    }

    return this.getMember(memberId);
  }
}
