import { loadEmotes } from './api.js'
import { app } from './constants.js'
import { addEmoteToContainer, renderUploadForm } from './render.js'
import './style.css'

async function bootstrap() {
  const emotes = await loadEmotes()

  for (const emote of emotes) {
    addEmoteToContainer(emote.name)
  }

  const form = renderUploadForm()
  app.appendChild(form)
}

bootstrap()
