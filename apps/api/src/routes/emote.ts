import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import sharp from 'sharp'
import { env } from '../config.js'
import { emoteBodySchema, emptyFile } from '../constants.js'
import { fetchImage } from '../helpers.js'
import { prisma } from '../prisma.js'
import { Resourcepack } from '../resourcepack.js'
import type { EmoteBody, EmoteParams } from '../types.js'

function preValidation(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) {
  const bearerToken = request.headers.authorization
  if (bearerToken === env.API_TOKEN) {
    done()
  } else {
    reply.code(401).send({ error: 'Unauthorized' })
  }
}

export function emote(fastify: FastifyInstance, done: () => void) {
  fastify.put<EmoteBody>(
    '/emote',
    { schema: emoteBodySchema, preValidation },
    async (request, reply) => {
      const { name, url } = request.body

      const emoji = await prisma.emoji.findFirst({
        where: { emote: null }
      })

      const { body, requestUrl } = await fetchImage(url)
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

      const resourcepack = new Resourcepack()
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

      resourcepack.writeArchive()

      reply.send({ name, url, requestUrl })
    }
  )

  fastify.delete<EmoteParams>(
    '/emote/:name',
    { preValidation },
    async (request, reply) => {
      const emoteName = request.params.name
      try {
        await prisma.emote.delete({
          where: {
            name: emoteName
          }
        })
        reply.send({ message: `Emote "${emoteName}" has been deleted` })
      } catch {
        reply.send({ error: `Emote "${emoteName}" not found` })
      }
    }
  )

  fastify.get<EmoteParams>('/emote/:name', async (request, reply) => {
    const emote = await prisma.emote.findFirst({
      where: {
        name: request.params.name
      }
    })

    reply.type('image/png')
    reply.send(emote?.file ?? emptyFile)
  })

  done()
}
