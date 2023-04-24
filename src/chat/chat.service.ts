import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createHashString } from 'src/util';
import { CreateRoomDto } from './dto/room/create-room.dto';
import { EnterRoomDto } from './dto/room/enter-room.dto';
import { Room } from './entities/room.entities';
import { Member } from './entities/member.entities';
import { RoomService } from './room/room.service';
import { MemberService } from './member/member.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly roomManager: RoomService,
    private readonly memberManager: MemberService,
  ) {}

  create(roomData: CreateRoomDto): Room {
    const { roomName } = roomData;
    const roomId = createHashString(roomName, 'room');

    const createdRoom = new Room(roomId, roomName);
    this.roomManager.createRoom(createdRoom).catch((err) => {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    });

    return createdRoom;
  }

  enterRoom(roomId: string, userData: EnterRoomDto): Member {
    // TODO Redis 에서 roomId 에 해당하는 방 정보를 가져온다.
    // TODO 존재하지 않을 경우 에러를 발생시킨다.

    const { memberName } = userData;
    const memberId = createHashString(memberName, 'member');

    const room = new Room(roomId, 'roomName');
    // TODO 가져온 방 정보에 userData 를 추가한다.
    // TODO Redis 에 새롭게 생성한 방 정보를 저장한다.
    const newMember = new Member(memberId, memberName, room);

    return newMember;
  }
}
