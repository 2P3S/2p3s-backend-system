import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from '../entities/member.entities';

@Injectable()
export class MemberService {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}

  async createMember(memberData: Member): Promise<Member> {
    const createdMember = await new this.memberModel({ ...memberData });
    return createdMember.save();
  }
}
