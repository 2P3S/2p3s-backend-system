import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from '../entities/vote.entities';

import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Vote.name, schema: VoteSchema }],
      'scrum-dice',
    ),
  ],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
