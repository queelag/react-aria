import { ReactNode } from 'react'
import { ID } from './types'

export type AccordionProps = {
  children: (props: AccordionChildProps) => ReactNode
  size: number
} & Omit<HTMLDivProps, 'children'>

export type AccordionChildProps = {
  expandedSections: boolean[]
  onKeyDown: (event: KeyboardEvent) => void
  setExpandedSection: (expanded: boolean, index: number) => void
}

export type AccordionSectionProps = {
  children: (props: AccordionSectionChildProps) => ReactNode
  index: number
  isExpanded?: boolean
} & AccordionChildProps &
  Omit<HTMLDivProps, 'children'>

export type AccordionSectionChildProps = {
  contentID: ID
  expanded: boolean
  headerID: ID
  setExpanded: (expanded: boolean) => void
}

export type AccordionSectionContentProps = AccordionSectionChildProps & HTMLDivProps
export type AccordionSectionHeaderProps = AccordionSectionChildProps & HTMLButtonProps

export type HTMLButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export type HTMLDivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export type HTMLElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
export type HTMLImageProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
export type HTMLInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export type HTMLLabelProps = React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
export type HTMLFormProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLFormElement>, HTMLFormElement>
export type HTMLSpanProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
