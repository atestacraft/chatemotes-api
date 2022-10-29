import 'dotenv/config'
import { cleanEnv, num, str } from 'envalid'

export const env = cleanEnv(process.env, {
  HOST: str({ default: '0.0.0.0', devDefault: 'localhost' }),
  PORT: num({ default: 5005 }),
  API_TOKEN: str(),
  PACK_DESCRIPTION: str({ default: 'Chat Emotes' })
})
