import { nanoid } from 'nanoid'
import { MutableRefObject } from 'react'
import { ComponentName } from '../definitions/enums'
import { ID } from '../definitions/types'

class ComponentStore<T extends HTMLElement = HTMLDivElement> {
  id: ID
  name: ComponentName
  ref: MutableRefObject<T>

  constructor(name: ComponentName, ref: MutableRefObject<T>, update: () => void, id?: string) {
    this.id = id || name + '_' + nanoid()
    this.name = name
    this.ref = ref
    this.update = update
  }

  update(): void {}

  get element(): T {
    return this.ref.current || document.createElement('div')
  }
}

export default ComponentStore
