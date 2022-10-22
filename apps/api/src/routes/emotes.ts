import type { FastifyInstance } from 'fastify'
import { prisma } from '../prisma.js'

export function emotes(fastify: FastifyInstance, done: () => void) {
  fastify.get('/emotes', async (request, reply) => {
    const emotes = await prisma.emote.findMany({
      select: {
        name: true,
        emoji: true
      }
    })

    reply.send(
      emotes.map((emote) => ({ name: emote.name, char: emote.emoji.char }))
    )
  })

  done()
}
