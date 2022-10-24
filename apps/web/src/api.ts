import { Fetcher } from '@zero-dependency/dom'
import type {
  Emotes,
  UploadEmotePayload,
  UploadEmoteResponse
} from './types.js'

const api = new Fetcher(`${location.origin}/api/`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('API_TOKEN')!
  }
})

export async function loadEmotes(): Promise<Emotes[]> {
  return await api.get<Emotes[]>('emotes')
}

export async function uploadEmote({
  name,
  url
}: UploadEmotePayload): Promise<UploadEmoteResponse> {
  return await api.put<UploadEmoteResponse>('emote', {
    body: JSON.stringify({ name, url })
  })
}

export async function deleteEmote(name: string): Promise<unknown> {
  return await api.delete(`emote/${name}`)
}

export async function renameEmote(name: string, newName: string) {
  return await api.post(`emote/${name}`, {
    body: JSON.stringify({ name: newName })
  })
}
