import 'dotenv/config'
import { cleanEnv, num, str } from 'envalid'

export const env = cleanEnv(process.env, {
  HOST: str({ default: 'localhost' }),
  PORT: num({ default: 5005 })
})
