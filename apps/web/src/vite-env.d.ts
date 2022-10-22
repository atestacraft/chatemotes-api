/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
