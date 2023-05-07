import { Model, ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
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
}
