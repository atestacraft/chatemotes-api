import Zip from 'adm-zip'
import fs from 'fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const thumbnailPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'assets',
  'pack.png'
)

const thumbnail = await fs.readFile(thumbnailPath)

export interface ResourcePackFont {
  type: 'bitmap'
  file: string
  height: number
  ascent: number
  chars: string[]
}

export class ResourcePack {
  private zip: Zip
  private fonts: ResourcePackFont[] = []

  constructor() {
    this.zip = new Zip()

    const mcMeta = {
      pack: {
        description: 'Atestacraft Chat Emotes',
        pack_format: 9
      }
    }

    this.zip.addFile('pack.mcmeta', Buffer.from(JSON.stringify(mcMeta)))
    this.zip.addFile('pack.png', thumbnail)
  }

  addEmote(emote: Buffer, name: string): void {
    this.zip.addFile(`assets/minecraft/textures/font/${name}.png`, emote)
  }

  addFont(name: string, char: string): void {
    this.fonts.push({
      type: 'bitmap',
      file: `minecraft:font/${name}.png`,
      height: 7,
      ascent: 7,
      chars: [char]
    })
  }

  getArchive(): Buffer {
    this.zip.addFile(
      'assets/minecraft/font/default.json',
      Buffer.from(JSON.stringify({ providers: this.fonts }, null, 2))
    )

    const output = resolve(
      dirname(fileURLToPath(import.meta.url)),
      '..',
      'assets',
      'resourcepack.zip'
    )

    this.zip.writeZip(output)
    return this.zip.toBuffer()
  }
}
