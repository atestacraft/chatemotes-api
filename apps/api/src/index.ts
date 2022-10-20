import Fastify from 'fastify'
import FastifyStatic from '@fastify/static'
import { env } from './config.js'
import { pathToStatic } from './constants.js'
import { prisma } from './prisma.js'
import { emote } from './routes/emote.js'
import { emotes } from './routes/emotes'
import { resourcepack } from './routes/resourcepack.js'

const fastify = Fastify()

fastify.register(FastifyStatic, {
  root: pathToStatic
})

fastify.register(
  (fastify, options, done) => {
    emote(fastify, done)
    emotes(fastify, done)
    resourcepack(fastify, done)
  },
  { prefix: '/api' }
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
