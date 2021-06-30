export function createLocalStorage<T extends string>(name: T) {
  type SetAction = `set${Capitalize<T>}`
  type GetAction = `get${Capitalize<T>}`
  type RemoveAction = `remove${Capitalize<T>}`

  const action = name[0].toUpperCase() + name.slice(1)
  const setAction = `set${action}`
  const getAction = `get${action}`
  const removeAction = `remove${action}`
  const key = 'web-ubuntu-' + name + '-key'

  return {
    [setAction](value: string) {
      localStorage.setItem(key, value)
    },
    [getAction]() {
      return localStorage.getItem(key)
    },
    [removeAction]() {
      localStorage.removeItem(key)
    }
  } as {
    [P in SetAction | GetAction | RemoveAction]: P extends SetAction
      ? (value: string) => void
      : P extends GetAction
      ? () => string | null
      : () => void
  }
}
