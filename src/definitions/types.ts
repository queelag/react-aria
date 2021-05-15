import PopperJS from '@popperjs/core'

export type ID = string

export type PopperData = {
  styles: { [key: string]: React.CSSProperties }
  attributes: { [key: string]: { [key: string]: string } | undefined }
  state: PopperJS.State | null
  update: PopperJS.Instance['update'] | null
  forceUpdate: PopperJS.Instance['forceUpdate'] | null
}

export type PopperOptions<T> = Omit<Partial<PopperJS.Options>, 'modifiers'> & {
  createPopper?: typeof PopperJS.createPopper
  modifiers?: ReadonlyArray<Partial<PopperJS.Modifier<T, object>>>
}
