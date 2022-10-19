import 'dotenv/config'
import { cleanEnv, num, str } from 'envalid'

export const env = cleanEnv(process.env, {
  HOST: str({ default: 'localhost' }),
  PORT: num({ default: 5005 })
})

export const uploadBodySchema = {
  body: {
    type: 'object',
    required: ['name', 'url'],
    properties: {
      name: { type: 'string' },
      url: { type: 'string' }
    }
  }
}
