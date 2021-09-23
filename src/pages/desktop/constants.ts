import { addBase } from '@/utils/prod'

export enum SpecialFolder {
  Application = '/application',
  Desktop = '/desktop',
  Trash = '/Trash',
  Settings = '/application/Settings',
}

export enum Filetype {
  Link = 'link',
  Js = 'js',
  Php = 'php',
  App = 'app',
}

export const fileIcon: Record<string, string> = {
  js: addBase('/themes/filetypes/js.png'),
  php: addBase('/themes/filetypes/php.png'),
  zip: addBase('/themes/filetypes/zip.png'),
  txt: addBase('/themes/filetypes/file.svg'),
}
