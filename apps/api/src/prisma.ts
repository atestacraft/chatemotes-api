import { PrismaClient } from '@chatemotes/prisma'

class Prisma extends PrismaClient {
  constructor() {
    super()
    this.$connect()
  }
}

export const prisma = new Prisma()
