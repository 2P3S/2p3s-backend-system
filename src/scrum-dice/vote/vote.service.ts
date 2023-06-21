import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getVote(voteId: string): Promise<Vote> {
    return this.voteModel.findById(voteId);
  }

  async updateVoteName(
    roomId: string,
    voteId: string,
    voteName: string,
  ): Promise<Vote> {
    const vote = await this.getVote(voteId);

    if (!vote || vote.room.toString() !== roomId) {
      throw new NotFoundException(`${voteId} 는 존재하지 않는 투표입니다.`);
    }

    const updatedVote = await this.voteModel.findByIdAndUpdate(voteId, {
      $set: { name: voteName },
    });

    return updatedVote;
  }
}