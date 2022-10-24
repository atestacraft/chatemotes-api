import { FastifyInstance } from 'fastify'
import { Resourcepack } from '../resourcepack.js'

export function hash(fastify: FastifyInstance, done: () => void) {
  fastify.get('/hash', async (request, reply) => {
    const hash = await Resourcepack.hash()
    reply.send({ hash })
  })

  done()
}
