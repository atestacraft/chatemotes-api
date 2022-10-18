import Zip from 'adm-zip'
import { resoucepackPath, resourcePackThumbnail } from './constants'

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
    this.zip.addFile('pack.png', resourcePackThumbnail)
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

  getArchive(): Buffer {
    this.zip.addFile(
      'assets/minecraft/font/default.json',
      Buffer.from(JSON.stringify({ providers: this.fonts }, null, 2))
    )

    this.zip.writeZip(resoucepackPath)
    return this.zip.toBuffer()
  }
}
