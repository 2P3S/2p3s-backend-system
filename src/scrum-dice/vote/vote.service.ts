import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { Vote } from '../entities/vote.entities';
import { Card } from '../entities/card.entities';

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
    // TODO room check 추가 필요
    return this.voteModel.findById(voteId).populate('cards');
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

  async updateVoteForSubmitCard(
    voteId: string | ObjectId,
    submitCard: Card,
  ): Promise<Vote> {
    const vote = await this.voteModel.findByIdAndUpdate(
      voteId,
      { $push: { cards: submitCard } },
      { new: true },
    );

    if (!vote) {
      throw new NotFoundException(`${voteId}는 존재하지 않는 투표입니다.`);
    }

    return this.getVote(vote.id);
  }

  async updateVoteForOpenCard(voteId: string | ObjectId): Promise<Vote> {
    const vote = await this.voteModel.findByIdAndUpdate(voteId, {
      $set: { status: true },
    });

    if (!vote) {
      throw new NotFoundException(`${voteId}의 개표에 실패하였습니다.`);
    }

    return this.getVote(vote.id);
  }
}
