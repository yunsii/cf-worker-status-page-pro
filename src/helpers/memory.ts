const SCALE = 1024
export const aKiB = SCALE
export const aMiB = SCALE ** 2
export const aGiB = SCALE ** 3

// ref: https://gist.github.com/rajinwonderland/36887887b8a8f12063f1d672e318e12e
export function memorySizeOf(obj: unknown) {
  let bytes = 0

  function sizeOf(obj: unknown) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8
          break
        case 'string':
          bytes += obj.length * 2
          break
        case 'boolean':
          bytes += 4
          break
        case 'object': {
          const objClass = Object.prototype.toString.call(obj).slice(8, -1)
          if (objClass === 'Object' || objClass === 'Array') {
            for (const key in obj) {
              if (!Object.prototype.hasOwnProperty.call(obj, key)) {
                continue
              }
              sizeOf(obj[key as keyof typeof obj])
            }
          } else {
            bytes += obj.toString().length * 2
          }
          break
        }
      }
    }
    return bytes
  }

  function formatByteSize(bytes: number) {
    if (bytes < aKiB) {
      return `${bytes} bytes`
    } else if (bytes < aMiB) {
      return `${(bytes / aMiB).toFixed(3)} KiB`
    } else if (bytes < aGiB) {
      return `${(bytes / aMiB).toFixed(3)} MiB`
    } else {
      return `${(bytes / aGiB).toFixed(3)} GiB`
    }
  }

  return { bytes, humanize: formatByteSize(sizeOf(obj)) }
}
