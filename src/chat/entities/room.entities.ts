import { Member } from './member.entities';

export class Room {
  id: string;
  name: string;
  members: Member[];
}
