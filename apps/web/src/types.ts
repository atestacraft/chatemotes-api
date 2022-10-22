import type { Emoji, Emote } from '@chatemotes/prisma'

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
