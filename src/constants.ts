import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const resoucepackPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'assets',
  'resourcepack.zip'
)

const thumbnailPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'assets',
  'pack.png'
)

export const resourcePackThumbnail = await fs.readFile(thumbnailPath)
