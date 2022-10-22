import { Fetcher } from '@zero-dependency/dom'
import type {
  Emotes,
  UploadEmotePayload,
  UploadEmoteResponse
} from './types.js'

const api = new Fetcher(`${location.origin}/api/`, {
  headers: { Authorization: import.meta.env.API_TOKEN }
})

export async function loadEmotes(): Promise<Emotes[]> {
  return await api.get<Emotes[]>('emotes')
}

export async function uploadEmote({
  name,
  url
}: UploadEmotePayload): Promise<UploadEmoteResponse> {
  return await api.put<UploadEmoteResponse>('emote', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, url })
  })
}

export async function deleteEmote(name: string): Promise<unknown> {
  return await api.delete(`emote/${name}`)
}
