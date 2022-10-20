import type { FastifyInstance } from 'fastify'
import got from 'got'
import sharp from 'sharp'
import { emptyFile } from '../constants.js'
import { prisma } from '../prisma.js'
import { ResourcePack } from '../resourcepack.js'

const schema = {
  body: {
    type: 'object',
    required: ['name', 'url'],
    properties: {
      name: { type: 'string' },
      url: { type: 'string' }
    }
  }
}

interface EmoteBody {
  Body: {
    name: string
    url: string
  }
}

interface EmoteParams {
  Params: { name: string }
}

export function emote(fastify: FastifyInstance, done: () => void) {
  fastify.put<EmoteBody>('/emote', { schema }, async (request, reply) => {
    const { name, url } = request.body

    const emoji = await prisma.emoji.findFirst({
      where: { emote: null }
    })

    const { body } = await got(request.body.url, {
      responseType: 'buffer'
    })

    const imageBuffer = await sharp(body).toFormat('png').toBuffer()

    await prisma.emote.upsert({
      where: {
        name
      },
      create: {
        name,
        url,
        file: imageBuffer,
        emojiId: emoji!.id
      },
      update: {
        name,
        url,
        file: imageBuffer
      }
    })

    const resourcepack = new ResourcePack()
    const emotes = await prisma.emote.findMany({
      select: {
        name: true,
        file: true,
        emoji: true
      }
    })

    for (const emote of emotes) {
      const emoteName = emote.name.toLowerCase()
      resourcepack.addEmote(emote.file, emoteName)
      resourcepack.addFont(emoteName, emote.emoji.char)
    }

    const hash = resourcepack.writeArchive()
    reply.send({ hash })
  })

  fastify.get<EmoteParams>('/emote/:name', async (request, reply) => {
    const emote = await prisma.emote.findFirst({
      where: {
        name: request.params.name
      }
    })

    reply.type('image/png')
    reply.send(emote?.file ?? emptyFile)
  })

  fastify.delete<EmoteParams>('/emote/:name', async (request, reply) => {
    return await prisma.emote.delete({
      where: {
        name: request.params.name
      }
    })
  })

  done()
}
