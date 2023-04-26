import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { createHashString } from 'src/util';
import { CreateRoomDto } from './dto/room/create-room.dto';
import { EnterRoomDto } from './dto/room/enter-room.dto';
import { Room } from './entities/room.entities';
import { Member } from './entities/member.entities';
import { RoomService } from './room/room.service';
import { MemberService } from './member/member.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly roomManager: RoomService,
    private readonly memberManager: MemberService,
  ) {}

  create(roomData: CreateRoomDto): Room {
    const { roomName } = roomData;
    const roomId = createHashString(roomName, 'room');

    const createdRoom = new Room(roomId, roomName);
    this.roomManager.createRoom(createdRoom).catch((err) => {
      this.logger.error(err);
      throw new HttpException(
        'Room create is failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    return createdRoom;
  }

  async enterRoom(roomId: string, userData: EnterRoomDto): Promise<Member> {
    const room = await this.roomManager.getRoom(roomId);
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    const { memberName } = userData;
    const memberId = createHashString(memberName, 'member');
    const newMember = new Member(memberId, memberName, room);

    const createdMember = await this.memberManager.createMember(newMember);
    if (!createdMember) {
      throw new HttpException('Member create is failed', HttpStatus.NOT_FOUND);
    }

    this.roomManager
      .updateRoomForAddMember(roomId, createdMember)
      .catch((err) => {
        this.logger.error(err);
        throw new HttpException(
          'Room update is failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return createdMember;
  }
}
