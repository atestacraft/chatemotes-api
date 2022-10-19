import { fetcher } from '@zero-dependency/dom'
import type { Emoji, Emote } from '../../api/node_modules/.prisma/client'

interface Emotes extends Pick<Emote, 'name'> {
  emoji: Emoji
}

export async function loadEmotes(): Promise<Emotes[]> {
  return await fetcher<Emotes[]>('/emotes', {
    method: 'GET'
  })
}

interface UploadEmoteResponse {
  hash: string
}

interface UploadEmotePayload {
  name: string
  url: string
}

export async function uploadEmote({
  name,
  url
}: UploadEmotePayload): Promise<UploadEmoteResponse> {
  return await fetcher<UploadEmoteResponse>('/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, url })
  })
}
