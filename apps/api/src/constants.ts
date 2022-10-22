import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToAssets } from './helpers.js'
import { UrlHandlers } from './types.js'

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

export const urlHandlers: UrlHandlers = [
  // 7tv
  [
    new RegExp(/^https:\/\/7tv.app\/emotes\/(\w+)/),
    (matches) => `https://cdn.7tv.app/emote/${matches[1]}/2x`
  ],
  [
    new RegExp(/^https:\/\/cdn.7tv.app\/emote\/(\w+)/),
    (matches) => `${matches[0]}/2x`
  ],
  // bttv
  [
    new RegExp(/^https:\/\/cdn.betterttv.net\/emote\/(\w+)/),
    (matches) => `${matches[0]}/2x`
  ],
  [
    new RegExp(/^https:\/\/betterttv.com\/emotes\/(\w+)/),
    (matches) => `https://cdn.betterttv.net/emote/${matches[1]}/2x`
  ],
  // ffz
  [
    new RegExp(/^https:\/\/www.frankerfacez.com\/emoticon\/(\d+)/),
    (matches) => `https://cdn.frankerfacez.com/emoticon/${matches[1]}/2`
  ],
  [
    new RegExp(/^https:\/\/cdn.frankerfacez.com\/emoticon\/(\w+)/),
    (matches) => `${matches[0]}/2`
  ]
]
