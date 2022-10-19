import fs from 'node:fs/promises'
import { pathToAssets } from './helpers.js'

export const resourcepackOutputPath = pathToAssets('resourcepack.zip')
export const resourcepackMeta = await fs.readFile(pathToAssets('pack.mcmeta'))
export const resourcepackThumbnail = await fs.readFile(pathToAssets('pack.png'))
export const emptyFile = await fs.readFile(pathToAssets('empty.png'))
