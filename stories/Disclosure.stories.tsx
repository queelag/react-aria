import { KeyboardArrowDownRounded } from '@material-ui/icons'
import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import { motion } from 'framer-motion'
import React, { Fragment, useState } from 'react'
import * as Component from '../src/components/Disclosure'
import { DisclosureStatus } from '../src/definitions/enums'
import { DisclosureProps, DisclosureSectionChildrenProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const Template: Story<DisclosureProps> = (args: DisclosureProps) => {
  const [sections] = useState(
    new Array(6).fill(0).map((v) => ({
      description: Chance().paragraph({ sentences: 1 }),
      title: Chance().sentence({ words: 2 })
    }))
  )

  return (
    <Component.Root {...args} className='flex flex-col rounded-md bg-white border border-gray-200'>
      {sections.map((v, k) => (
        <Component.Section key={k}>
          {(props: DisclosureSectionChildrenProps) => (
            <Fragment>
              <Component.SectionHeader>
                <Component.SectionHeaderButton
                  {...props}
                  className={ArrayUtils.joinStrings(
                    'w-full flex justify-between items-center p-6 space-x-6 transition-all duration-200',
                    'hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-50',
                    k > 0 && 'border-t border-gray-200'
                  )}
                >
                  <span className='font-medium'>{v.title}</span>
                  <motion.div animate={{ rotate: props.status === DisclosureStatus.EXPANDED ? 180 : 0 }}>
                    <KeyboardArrowDownRounded />
                  </motion.div>
                </Component.SectionHeaderButton>
              </Component.SectionHeader>
              <Component.SectionPanel {...props}>
                <motion.div
                  animate={{ height: props.status === DisclosureStatus.EXPANDED ? 'auto' : 0 }}
                  className='overflow-hidden bg-gray-50'
                  initial={{ height: 0 }}
                  transition={{ type: 'linear' }}
                >
                  <div className='w-full h-px bg-gray-200' />
                  <div className='p-6 text-sm'>{v.description}</div>
                </motion.div>
              </Component.SectionPanel>
            </Fragment>
          )}
        </Component.Section>
      ))}
    </Component.Root>
  )
}

export const Disclosure = Template.bind({})
Disclosure.args = {}

export default {
  component: Component.Root,
  subcomponents: {
    Section: Component.Section,
    SectionHeader: Component.SectionHeader,
    SectionHeaderButton: Component.SectionHeaderButton,
    SectionPanel: Component.SectionPanel
  },
  title: 'Components/Disclosure'
} as Meta
