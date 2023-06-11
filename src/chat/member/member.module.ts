import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberService } from './member.service';
import { Member, MemberSchema } from '../entities/member.entities';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Member.name, schema: MemberSchema }],
      'chat',
    ),
  ],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
