import type { FastifyInstance } from 'fastify'
import { Resourcepack } from '../resourcepack.js'

export function pack(fastify: FastifyInstance, done: () => void) {
  fastify.get('/pack', async (request, reply) => {
    const pack = await Resourcepack.readPack()
    reply.type('application/zip')
    reply.send(pack)
  })

  done()
}
