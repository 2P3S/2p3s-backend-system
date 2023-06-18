import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vote } from '../entities/vote.entities';

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(Vote.name, 'scrum-dice') private voteModel: Model<Vote>,
  ) {}

  async createVote(voteData: Vote): Promise<Vote> {
    const createdVote = await new this.voteModel({ ...voteData });
    return createdVote.save();
  }
}
