export type UrlHandlers = [RegExp, (matches: RegExpMatchArray) => string][]

export interface ResourcepackFont {
  type: 'bitmap'
  file: string
  height: number
  ascent: number
  chars: string[]
}

export interface EmoteBody {
  Body: {
    name: string
    url: string
  }
}

export interface EmoteParams {
  Params: {
    name: string
  }
}
