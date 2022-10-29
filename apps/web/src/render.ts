import { el } from '@zero-dependency/dom'
import { deleteEmote, renameEmote, uploadEmote } from './api.js'
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
        onclick: (event) => {
          if (event.ctrlKey) {
            const promptNewName = prompt(`Set new the emote name:`, name)

            if (promptNewName && promptNewName !== name) {
              renameEmote(name, promptNewName)
                .then(() => {
                  name = promptNewName
                  emoteName.textContent = name
                })
                .catch(console.error)
            }
          } else {
            navigator.clipboard.writeText(name)
          }
        },
        oncontextmenu: (event) => {
          event.preventDefault()
          const promptDelete = prompt(
            `Are you sure you want to delete the emote "${name}"?\nPlease type "${name}" to confirm.`
          )

          if (promptDelete === name) {
            deleteEmote(name)
              .then(() => emoteCard.remove())
              .catch(console.error)
          }
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
  const tokenInput = el('input', {
    placeholder: 'Token',
    name: 'token',
    type: 'password',
    required: true,
    tabIndex: -1,
    value: localStorage.getItem('API_TOKEN')!,
    oninput: () => {
      localStorage.setItem('API_TOKEN', tokenInput.value)
    }
  })

  const nameInput = el('input', {
    placeholder: 'Name',
    name: 'name',
    type: 'text',
    maxLength: 16,
    minLength: 1,
    required: true
  })

  const urlInput = el('input', {
    placeholder: 'Url',
    name: 'url',
    type: 'text',
    required: true
  })

  const submitButton = el('input', {
    textContent: 'Upload',
    type: 'submit'
  })

  const form = el(
    'form',
    {
      className: 'upload-form'
    },
    tokenInput,
    nameInput,
    urlInput,
    submitButton
  )

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    try {
      if (!nameInput.value || !urlInput.value) return
      submitButton.disabled = true

      const payload = {
        name: nameInput.value,
        url: urlInput.value
      }

      await uploadEmote(payload)
      addEmoteToContainer(payload.name)

      nameInput.value = ''
      urlInput.value = ''
    } catch (err) {
      urlInput.value = ''
    } finally {
      submitButton.disabled = false
    }
  })

  return form
}
