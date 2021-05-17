import { nanoid } from 'nanoid'
import { ComponentName } from '../definitions/enums'
import { ID } from '../definitions/types'

class ComponentStore {
  id: ID
  name: ComponentName

  constructor(name: ComponentName, update: () => void, id?: string) {
    this.id = id || name + '_' + nanoid()
    this.name = name
    this.update = update
  }

  update(): void {}
}

export default ComponentStore
