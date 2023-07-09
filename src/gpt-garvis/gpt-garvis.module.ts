import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GptGarvisController } from './gpt-garvis.controller';
import { GptGarvisService } from './gpt-garvis.service';
import { RoomModule } from './room/room.module';
import { MemberModule } from './member/member.module';
import { GptGarvisGateway } from './gpt-garvis.gateway';
import { Room, RoomSchema } from './entities/room.entities';
import { Member, MemberSchema } from './entities/member.entities';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Room.name, schema: RoomSchema },
        { name: Member.name, schema: MemberSchema },
      ],
      'gpt-garvis',
    ),
    RoomModule,
    MemberModule,
  ],
  controllers: [GptGarvisController],
  providers: [GptGarvisService, GptGarvisGateway],
})
export class GptGarvisModule {}
