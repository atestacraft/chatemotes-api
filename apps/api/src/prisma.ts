import { PrismaClient } from '../node_modules/.prisma/client'

class Prisma extends PrismaClient {
  constructor() {
    super()
    this.$connect()
  }
}

export const prisma = new Prisma()
