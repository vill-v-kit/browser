export const resolveImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.src = src
    image.crossOrigin = ''
    image.onload = () => {
      resolve(image)
    }
    image.onerror = (event, _source, _lineno, _colno, error) => {
      reject(error || event)
    }
  })
