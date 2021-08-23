import { noop } from '@queelag/core'
import { ReactUtils } from '@queelag/react-core'
import { IconArrowLeft, IconArrowRight } from '@queelag/react-feather-icons'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import * as Component from '../src/components/Pagination'
import { PaginationChildrenProps, PaginationProps } from '../src/definitions/props'

const Template: Story<PaginationProps> = (args: PaginationProps) => {
  return (
    <Component.Root {...args}>
      {(props: PaginationChildrenProps) => (
        <Component.List className='flex items-center space-x-2'>
          <Component.PreviousListItemLink
            {...props}
            className={ReactUtils.joinClassNames(
              'h-12 flex items-center pr-2 cursor-pointer',
              'transition duration-200 focus:text-blue-500',
              props.canGoToPreviousListItem ? 'transform transition duration-200 hover:-translate-x-2' : 'opacity-50 cursor-not-allowed'
            )}
            href='#'
            target='_self'
          >
            <IconArrowLeft />
          </Component.PreviousListItemLink>
          {props.iterablePages.map((v: number) => (
            <Component.ListItem key={v}>
              <Component.ListItemLink
                {...props}
                className={ReactUtils.joinClassNames(
                  'w-12 h-12 flex justify-center items-center rounded-md cursor-pointer border border-gray-200',
                  'transition duration-200 hover:bg-gray-100 active:bg-white ring-offset-2 ring-blue-400 focus:ring-2',
                  props.isListItemActive(v) && 'bg-gray-50'
                )}
                href='#'
                target='_self'
                index={v}
              >
                {v}
              </Component.ListItemLink>
            </Component.ListItem>
          ))}
          <Component.NextListItemLink
            {...props}
            className={ReactUtils.joinClassNames(
              'h-12 flex items-center pl-2 cursor-pointer',
              'transition duration-200 focus:text-blue-500',
              props.canGoToNextListItem ? 'transform transition duration-200 hover:translate-x-2' : 'opacity-50 cursor-not-allowed'
            )}
            href='#'
            target='_self'
          >
            <IconArrowRight />
          </Component.NextListItemLink>
        </Component.List>
      )}
    </Component.Root>
  )
}

export const Pagination = Template.bind({})
Pagination.args = {
  activeListItemIndex: 3,
  label: 'Pagination',
  listItemsIndexOffset: 1,
  numberOfListItems: 100,
  numberOfListItemsPerPage: 20,
  onChangeActiveListItemIndex: noop
} as PaginationProps

export default {
  component: Component.Root,
  subcomponents: {
    List: Component.List,
    ListItem: Component.ListItem,
    ListItemLink: Component.ListItemLink,
    PreviousListItemLink: Component.PreviousListItemLink,
    NextListItemLink: Component.NextListItemLink
  },
  title: 'Components/Pagination'
} as Meta
