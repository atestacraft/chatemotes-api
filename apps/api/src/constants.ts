import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToAssets } from './helpers.js'

export const resourcepackOutputPath = pathToAssets('resourcepack.zip')
export const resourcepackMeta = await fs.readFile(pathToAssets('pack.mcmeta'))
export const resourcepackThumbnail = await fs.readFile(pathToAssets('pack.png'))
export const emptyFile = await fs.readFile(pathToAssets('empty.png'))
export const pathToStatic = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'web',
  'dist'
)
