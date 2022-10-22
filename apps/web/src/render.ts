import { el } from '@zero-dependency/dom'
import { uploadEmote } from './api.js'
import { app } from './constants.js'

function renderEmotesContainer() {
  const emotesContainer = el('div', { className: 'emotes' })
  app.appendChild(emotesContainer)

  return (name: string) => {
    const emoteImage = el('img', {
      className: 'emote-image',
      src: `/api/emote/${name}`
    })

    const emoteName = el('span', {
      className: 'emote-name',
      textContent: name
    })

    const emoteCard = el(
      'div',
      {
        className: 'emote',
        onclick: () => {
          navigator.clipboard.writeText(name)
        }
      },
      emoteImage,
      emoteName
    )

    emotesContainer.appendChild(emoteCard)
  }
}

export const addEmoteToContainer = renderEmotesContainer()

export function renderUploadForm() {
  const nameInput = el('input', {
    placeholder: 'Name',
    name: 'name',
    type: 'text'
  })

  const urlInput = el('input', {
    placeholder: 'Url',
    name: 'url',
    type: 'text'
  })

  const submitButton = el('button', {
    textContent: 'Add',
    onclick: async (event) => {
      event.preventDefault()

      try {
        submitButton.disabled = true
        const payload = {
          name: nameInput.value,
          url: urlInput.value
        }
        const response = await uploadEmote(payload)
        addEmoteToContainer(payload.name)
        console.log({ response })
      } catch (err) {
        console.error(err)
      } finally {
        submitButton.disabled = false
        nameInput.value = ''
        urlInput.value = ''
      }
    }
  })

  const form = el(
    'div',
    {
      className: 'upload-form'
    },
    nameInput,
    urlInput,
    submitButton
  )

  return form
}
