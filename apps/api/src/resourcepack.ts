import { prisma } from './prisma.js'
import Zip from 'adm-zip'
import {
  resourcepackMeta,
  resourcepackOutputPath,
  resourcepackThumbnail
} from './constants.js'
import type { ResourcepackFont } from './types.js'

export class Resourcepack {
  private readonly zip = new Zip()
  private readonly fonts: ResourcepackFont[] = []

  constructor() {
    this.zip.addFile(
      'pack.mcmeta',
      Buffer.from(JSON.stringify(resourcepackMeta))
    )
    this.zip.addFile('pack.png', resourcepackThumbnail)
  }

  static async createArchive(): Promise<void> {
    const resourcepack = new Resourcepack()
    const emotes = await prisma.emote.findMany({
      select: {
        name: true,
        file: true,
        emoji: true
      }
    })

    for (const emote of emotes) {
      const emoteName = emote.name.toLowerCase()
      resourcepack.addEmote(emote.file, emoteName)
      resourcepack.addFont(emoteName, emote.emoji.char)
    }

    resourcepack.writeArchive()
  }

  addEmote(emote: Buffer, name: string): void {
    this.zip.addFile(`assets/minecraft/textures/font/${name}.png`, emote)
  }

  addFont(name: string, char: string): void {
    this.fonts.push({
      type: 'bitmap',
      file: `minecraft:font/${name}.png`,
      height: 10,
      ascent: 7,
      chars: [char]
    })
  }

  writeArchive(): void {
    this.zip.addFile(
      'assets/minecraft/font/default.json',
      Buffer.from(JSON.stringify({ providers: this.fonts }))
    )

    this.zip.writeZip(resourcepackOutputPath)
  }
}
