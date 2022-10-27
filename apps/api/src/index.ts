import Fastify from 'fastify'
import FastifyCors from '@fastify/cors'
import FastifyStatic from '@fastify/static'
import { env } from './config.js'
import { pathWebStatic } from './constants.js'
import { prisma } from './prisma.js'
import { emote, emotes, hash, pack } from './routes/index.js'

const fastify = Fastify({
  logger: env.isDev
})

fastify.register(FastifyStatic, {
  root: pathWebStatic
})

fastify.register(FastifyCors, {
  origin: '*'
})

fastify.register(
  (fastify, options, done) => {
    hash(fastify, done)
    pack(fastify, done)
    emote(fastify, done)
    emotes(fastify, done)
  },
  { prefix: '/api' }
)

fastify.listen({ host: env.HOST, port: env.PORT }, (err) => {
  if (err) throw err
  console.log(`http://${env.HOST}:${env.PORT}\n`)
})

function onClose() {
  fastify.close()
  prisma.$disconnect()
}

process.on('SIGTERM', onClose)
process.on('SIGINT', onClose)
