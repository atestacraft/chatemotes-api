import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import sharp from 'sharp'
import { env } from '../config.js'
import { emptyImage, fetchImage } from '../helpers.js'
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
  // upload emote
  fastify.put<EmoteBody>(
    '/emote',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'url'],
          properties: {
            name: { type: 'string' },
            url: { type: 'string' }
          }
        }
      },
      preValidation
    },
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

      await Resourcepack.generatePack()
      reply.send({ name, url, requestUrl })
    }
  )

  // rename emote
  fastify.post<{ Body: Omit<EmoteBody['Body'], 'url'> } & EmoteParams>(
    '/emote/:name',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' }
          }
        }
      },
      preValidation
    },
    async (request, reply) => {
      const currentEmoteName = request.params.name
      const newEmoteName = request.body.name

      await prisma.emote.update({
        where: {
          name: currentEmoteName
        },
        data: {
          name: newEmoteName
        }
      })

      await Resourcepack.generatePack()
      reply.send({
        message: `Emote was successfully renamed to "${newEmoteName}".`
      })
    }
  )

  // delete emote by name
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

        await Resourcepack.generatePack()
        reply.send({
          message: `Emote "${emoteName}" was successfully deleted.`
        })
      } catch {
        reply
          .code(404)
          .send({ message: `Emote "${emoteName}" does not exists` })
      }
    }
  )

  // get emote image
  fastify.get<EmoteParams>('/emote/:name', async (request, reply) => {
    const emote = await prisma.emote.findFirst({
      where: {
        name: request.params.name
      }
    })

    reply.type('image/png')
    reply.send(emote?.file ?? (await emptyImage()))
  })

  done()
}
