import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RoomModule } from './room/room.module';
import { MemberModule } from './member/member.module';
import { ChatGateway } from './chat.gateway';
import { Room, RoomSchema } from './entities/room.entities';
import { Member, MemberSchema } from './entities/member.entities';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Room.name, schema: RoomSchema },
        { name: Member.name, schema: MemberSchema },
      ],
      'chat',
    ),
    RoomModule,
    MemberModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
