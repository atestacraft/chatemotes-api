import type { Emoji, Emote } from '../../api/node_modules/.prisma/client'

export interface Emotes extends Pick<Emote, 'name'> {
  emoji: Emoji
}

export interface UploadEmoteResponse {
  hash: string
}

export interface UploadEmotePayload {
  name: string
  url: string
}
