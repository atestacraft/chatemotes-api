import type { FastifyInstance } from 'fastify'
import { readFile } from 'node:fs/promises'
import { resourcepackOutputPath } from '../constants'

export function resourcepack(fastify: FastifyInstance, done: () => void) {
  fastify.get('/resourcepack', async (request, reply) => {
    const resourcepack = await readFile(resourcepackOutputPath)
    reply.type('application/zip')
    reply.send(resourcepack)
  })

  done()
}
