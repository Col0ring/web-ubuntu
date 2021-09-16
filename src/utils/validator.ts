export const urlReg = /^https?:\/\/.*/

export function validateUrl(url: string) {
  return urlReg.test(url)
}
