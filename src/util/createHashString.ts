import * as crypto from 'crypto';

export default function createHashString(
  name: string,
  category: 'room' | 'member',
): string {
  const hash = crypto.createHash('sha256');
  hash.update(`${category}-${name}-${Date.now().toString()}`);

  return hash.digest('hex');
}
