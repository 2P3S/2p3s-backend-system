import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrumDiceController } from './scrum-dice.controller';
import { ScrumDiceService } from './scrum-dice.service';
import { RoomModule } from './room/room.module';
import { MemberModule } from './member/member.module';
import { ScrumDiceGateway } from './scrum-dice.gateway';
import { RoomSchema } from './entities/room.entities';
import { MemberSchema } from './entities/member.entities';
import { CardSchema } from './entities/card.entities';
import { VoteSchema } from './entities/vote.entities';

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
  ],
  controllers: [ScrumDiceController],
  providers: [ScrumDiceService, ScrumDiceGateway],
})
export class ScrumDiceModule {}
