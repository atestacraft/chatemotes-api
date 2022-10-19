import Fastify from 'fastify'
import got from 'got'
import fs from 'node:fs/promises'
import sharp from 'sharp'
import FastifyStatic from '@fastify/static'
import { PrismaClient } from '../node_modules/.prisma/client'
import { env, uploadBodySchema } from './config.js'
import { emptyFile, pathToStatic, resourcepackOutputPath } from './constants.js'
import { ResourcePack } from './resourcepack.js'

const fastify = Fastify()

fastify.register(FastifyStatic, {
  root: pathToStatic
})

const prisma = new PrismaClient()
await prisma.$connect()

fastify.get('/resourcepack', async (request, reply) => {
  const resourcepack = await fs.readFile(resourcepackOutputPath)
  reply.type('application/zip')
  reply.send(resourcepack)
})

fastify.get('/emotes', async (request, reply) => {
  const emotes = await prisma.emote.findMany({
    select: {
      name: true,
      emoji: true
    }
  })

  reply.send(emotes)
})

fastify.get<{ Params: { name: string } }>(
  '/emote/:name',
  async (request, reply) => {
    const emote = await prisma.emote.findFirst({
      where: {
        name: request.params.name
      }
    })

    reply.type('image/png')
    reply.send(emote?.file ?? emptyFile)
  }
)

fastify.post<{ Body: { name: string; url: string } }>(
  '/upload',
  { schema: uploadBodySchema },
  async (request, reply) => {
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
  }
)

fastify
  .listen({ host: env.HOST, port: env.PORT })
  .then(() => console.log(`http://${env.HOST}:${env.PORT}\n`))
  .catch(console.log)

function onClose() {
  fastify.close()
  prisma.$disconnect()
}

process.on('SIGTERM', onClose)
process.on('SIGINT', onClose)
