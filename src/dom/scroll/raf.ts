interface RafMap {
  [id: number]: number
}

let id = 0
const ids: RafMap = {}

/**
 * 延迟指定帧调用requestAnimationFrame
 * @param callback
 * @param delayFrames
 */
export function wrapperRaf(callback: () => void, delayFrames = 1): number {
  const myId: number = id++
  let restFrames: number = delayFrames

  function internalCallback() {
    restFrames -= 1

    if (restFrames <= 0) {
      callback()
      delete ids[myId]
    } else {
      ids[myId] = requestAnimationFrame(internalCallback)
    }
  }

  ids[myId] = requestAnimationFrame(internalCallback)

  return myId
}

wrapperRaf.cancel = function cancel(pid?: number) {
  if (pid === undefined) return

  cancelAnimationFrame(ids[pid])
  delete ids[pid]
}

wrapperRaf.ids = ids
