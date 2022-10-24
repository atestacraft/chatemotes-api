import Zip from 'adm-zip'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { pathApiAssets } from './constants.js'
import { prisma } from './prisma.js'
import type { ResourcepackFont } from './types.js'

export class Resourcepack {
  private readonly zip = new Zip()
  private readonly fonts: ResourcepackFont[] = []

  static async generatePack(): Promise<void> {
    const resourcepack = new Resourcepack()
    const emotes = await prisma.emote.findMany({
      select: {
        name: true,
        file: true,
        emoji: true
      }
    })

    for (const emote of emotes) {
      const emoteName = createHash('sha1').update(emote.file).digest('hex')
      resourcepack.addEmote(emote.file, emoteName)
      resourcepack.addFont(emoteName, emote.emoji.char)
    }

    resourcepack.addMeta()
    resourcepack.writeArchive()
  }

  static async readPack() {
    return await readFile(Resourcepack.pathToPack)
  }

  static async hash(): Promise<string> {
    const pack = await this.readPack()
    return createHash('sha1').update(pack).digest('hex')
  }

  static get pathToPack(): string {
    return pathApiAssets('chat_emotes.zip')
  }

  private addMeta(): void {
    this.zip.addFile(
      'pack.mcmeta',
      Buffer.from(
        JSON.stringify({
          pack: {
            description: process.env['PACK_DESCRIPTION'],
            pack_format: 9
          }
        })
      )
    )
  }

  private addEmote(emote: Buffer, name: string): void {
    this.zip.addFile(`assets/minecraft/textures/font/${name}.png`, emote)
  }

  private addFont(name: string, char: string): void {
    this.fonts.push({
      type: 'bitmap',
      file: `minecraft:font/${name}.png`,
      height: 10,
      ascent: 7,
      chars: [char]
    })
  }

  private writeArchive(): void {
    this.zip.addFile(
      'assets/minecraft/font/default.json',
      Buffer.from(JSON.stringify({ providers: this.fonts }))
    )

    this.zip.writeZip(Resourcepack.pathToPack)
  }
}
