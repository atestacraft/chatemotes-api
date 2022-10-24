import got from 'got'
import sharp from 'sharp'
import { urlHandlers } from './constants.js'

export async function fetchImage(imageUrl: string) {
  for (const [regexp, to] of urlHandlers) {
    const matches = imageUrl.match(regexp)
    if (matches && matches[1]) {
      imageUrl = to(matches)
      break
    }
  }

  const response = await got(imageUrl, {
    responseType: 'buffer',
    timeout: {
      lookup: 100,
      connect: 100,
      secureConnect: 1000,
      response: 1000
    }
  })

  if (response.statusCode !== 200) {
    throw new Error(`Invalid response code: ${response.statusCode}`)
  }

  if (response.body.byteLength >= 256 * 1024) {
    throw new Error(
      `Emote is too large (${(response.body.byteLength / 1024).toFixed(2)} KB)`
    )
  }

  return response
}

export async function emptyImage(): Promise<Buffer> {
  const width = 100
  const height = 100
  const text = 'Image not found'

  const svg = `
    <svg width="${width}" height="${height}">
      <text x="50%" y="50%" font-weight="bold" text-anchor="middle">
        ${text}
      </text>
    </svg>
  `

  return await sharp(Buffer.from(svg)).toBuffer()
}
