import type { FastifyInstance } from 'fastify'
import { resourcepack } from '../constants.js'

export function pack(fastify: FastifyInstance, done: () => void) {
  fastify.get('/pack', async (request, reply) => {
    const pack = await resourcepack()
    reply.type('application/zip')
    reply.send(pack)
  })

  done()
}
