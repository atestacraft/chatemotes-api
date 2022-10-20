import { fetcher } from '@zero-dependency/dom'
import type {
  Emotes,
  UploadEmotePayload,
  UploadEmoteResponse
} from './types.js'

export async function loadEmotes(): Promise<Emotes[]> {
  return await fetcher<Emotes[]>('/api/emotes', {
    method: 'GET'
  })
}

export async function uploadEmote({
  name,
  url
}: UploadEmotePayload): Promise<UploadEmoteResponse> {
  return await fetcher<UploadEmoteResponse>('/api/emote', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, url })
  })
}

export async function deleteEmote(name: string): Promise<unknown> {
  return await fetcher(`/api/emote/${name}`, {
    method: 'DELETE'
  })
}
