import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToAssets } from './helpers.js'

export const resourcepackOutputPath = pathToAssets('resourcepack.zip')
export const resourcepack = async () => await readFile(resourcepackOutputPath)
export const resourcepackMeta = await readFile(pathToAssets('pack.mcmeta'))
export const resourcepackThumbnail = await readFile(pathToAssets('pack.png'))
export const emptyFile = await readFile(pathToAssets('empty.png'))
export const pathToStatic = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'web',
  'dist'
)
