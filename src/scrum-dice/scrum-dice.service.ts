import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CreateRoomDto } from './dto/room/create-room.dto';
import { EnterRoomDto } from './dto/room/enter-room.dto';
import { Member } from './entities/member.entities';
import { Room } from './entities/room.entities';
import { MemberService } from './member/member.service';
import { RoomService } from './room/room.service';

@Injectable()
export class ScrumDiceService {
  private readonly logger = new Logger(ScrumDiceService.name);

  constructor(
    private readonly roomManager: RoomService,
    private readonly memberManager: MemberService,
  ) {}

  async createRoom(roomData: CreateRoomDto): Promise<Room> {
    const { roomName, deckType } = roomData;

    const createdRoom = await this.roomManager.createRoom(
      new Room(roomName, deckType),
    );
    if (!createdRoom) {
      throw new HttpException(
        'Room create is failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return createdRoom;
  }

  async enterRoom(roomId: string, userData: EnterRoomDto): Promise<Member> {
    const room = await this.roomManager.getRoom(roomId);
    if (!room) {
      throw new HttpException(
        '요청한 방의 정보가 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const { memberName } = userData;
    const newMember = await this.memberManager.createMember(
      new Member(memberName, room),
    );
    if (!newMember) {
      throw new HttpException(
        '방의 멤버 생성에 실패하였습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    this.roomManager.updateRoomForAddMember(roomId, newMember).catch((err) => {
      this.logger.error(err);
      throw new HttpException(
        '방의 멤버 정보 업데이트에 실패하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    return await this.memberManager.getMember(newMember.id);
  }
}
