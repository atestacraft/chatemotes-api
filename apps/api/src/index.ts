import Fastify from 'fastify'
import Jimp from 'jimp'
import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaClient } from '@rs/prisma'
import { ResourcePack } from './resourcepack.js'

const fastify = Fastify()
const prisma = new PrismaClient()
await prisma.$connect()

fastify.get('/resourcepack', async (request, reply) => {
  const resoucepackPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    'assets',
    'resourcepack.zip'
  )

  try {
    const file = await fs.readFile(resoucepackPath)
    reply.type('application/zip')
    reply.send(file)
  } catch {
    reply.send({})
  }
})

fastify.get('/emotes', async (request, reply) => {
  try {
    const emotes = await prisma.emote.findMany({
      select: {
        name: true,
        emoji: true
      }
    })

    reply.send(emotes)
  } catch {
    reply.send({})
  }
})

fastify.get<{ Params: { id: string } }>(
  '/emote/:id',
  async (request, reply) => {
    const emote = await prisma.emote.findFirst({
      where: {
        emojiId: Number(request.params.id)
      }
    })

    if (emote) {
      reply.type('image/png')
      reply.send(emote!.file)
    } else {
      reply.send({})
    }
  }
)

fastify.route<{ Body: { name: string; url: string } }>({
  url: '/rs',
  method: 'POST',
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
  handler: async (request, reply) => {
    try {
      const { name, url } = request.body
      const image = await Jimp.read(request.body.url)
      const imageBuffer = await image.getBufferAsync('image/png')

      const emoji = await prisma.emoji.findFirst({
        where: { emote: null }
      })

      if (emoji) {
        await prisma.emote.upsert({
          where: {
            name
          },
          create: {
            name,
            url,
            file: imageBuffer,
            emojiId: emoji.id
          },
          update: {
            name,
            url,
            file: imageBuffer
          }
        })
      }

      const resourcepack = new ResourcePack()

      const emotes = await prisma.emote.findMany({
        select: {
          name: true,
          file: true,
          emoji: true
        }
      })

      for (const emote of emotes) {
        resourcepack.addEmote(emote.file, emote.name)
        resourcepack.addFont(emote.name, emote.emoji.char)
      }

      reply.type('application/zip')
      reply.send(resourcepack.getArchive())
    } catch (err) {
      console.log(err)
      reply.send(request.body)
    }
  }
})

fastify
  .listen({ host: '0.0.0.0', port: 5050 })
  .then(() => console.log('http://0.0.0.0:5050'))

function disconnect() {
  fastify.close()
  prisma.$disconnect()
}

process.on('SIGTERM', disconnect)
process.on('SIGINT', disconnect)
