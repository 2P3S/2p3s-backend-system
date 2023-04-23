import { Injectable } from '@nestjs/common';
import { CreateRoomDto, EnterRoomDto } from './dto/room';
import { createHashString } from 'src/util';
import { Member, Room } from './entities/chat';

@Injectable()
export class ChatService {
  create(roomData: CreateRoomDto): Room {
    const { roomName } = roomData;
    const roomId = createHashString(roomName, 'room');

    const createdRoom = new Room(roomId, roomName);
    // TODO Redis 에 새롭게 생성한 방 정보를 저장한다.

    return createdRoom;
  }

  enterRoom(roomId: string, userData: EnterRoomDto): Member {
    // TODO Redis 에서 roomId 에 해당하는 방 정보를 가져온다.
    // TODO 존재하지 않을 경우 에러를 발생시킨다.

    const { memberName } = userData;
    const memberId = createHashString(memberName, 'member');

    // TODO 가져온 방 정보에 userData 를 추가한다.
    // TODO Redis 에 새롭게 생성한 방 정보를 저장한다.
    const newMember = new Member(memberId, memberName, roomId);

    return newMember;
  }
}
