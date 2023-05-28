import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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

  async createRoom(roomData: CreateRoomDto): Promise<Room> {
    // TODO 예외처리 추가
    const { roomName } = roomData;

    const createdRoom = await this.roomManager.createRoom(new Room(roomName));
    if (!createdRoom) {
      throw new HttpException(
        'Room create is failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return createdRoom;
  }

  async enterRoom(roomId: string, userData: EnterRoomDto): Promise<Member> {
    // TODO 예외처리 추가
    const room = await this.roomManager.getRoom(roomId);
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    const { memberName } = userData;
    const newMember = await this.memberManager.createMember(
      new Member(memberName, room),
    );
    if (!newMember) {
      throw new HttpException('Member create is failed', HttpStatus.NOT_FOUND);
    }

    this.roomManager.updateRoomForAddMember(roomId, newMember).catch((err) => {
      this.logger.error(err);
      throw new HttpException(
        'Room update is failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    return await this.memberManager.getMember(newMember.id);
  }
}
