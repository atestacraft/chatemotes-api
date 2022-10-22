import { FastifyInstance } from 'fastify'
import { createHash } from 'node:crypto'
import { resourcepack } from '../constants.js'

export function hash(fastify: FastifyInstance, done: () => void) {
  fastify.get('/hash', async (request, reply) => {
    const pack = await resourcepack()
    const hash = createHash('sha1').update(pack).digest('hex')
    reply.send({ hash })
  })
}
