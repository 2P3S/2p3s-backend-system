import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardSchema } from './entities/card.entities';
import { MemberSchema } from './entities/member.entities';
import { RoomSchema } from './entities/room.entities';
import { VoteSchema } from './entities/vote.entities';
import { MemberModule } from './member/member.module';
import { RoomModule } from './room/room.module';
import { ScrumDiceController } from './scrum-dice.controller';
import { ScrumDiceGateway } from './scrum-dice.gateway';
import { ScrumDiceService } from './scrum-dice.service';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'Room', schema: RoomSchema },
        { name: 'Member', schema: MemberSchema },
        { name: 'Card', schema: CardSchema },
        { name: 'Vote', schema: VoteSchema },
      ],
      'scrum-dice',
    ),
    RoomModule,
    MemberModule,
    VoteModule,
  ],
  controllers: [ScrumDiceController],
  providers: [ScrumDiceService, ScrumDiceGateway],
})
export class ScrumDiceModule {}
