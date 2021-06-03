import { KeyboardArrowDownRounded } from '@material-ui/icons'
import { Meta, Story } from '@storybook/react'
import Chance from 'chance'
import { motion } from 'framer-motion'
import React, { Fragment } from 'react'
import * as Component from '../src/components/Accordion'
import { AccordionProps } from '../src/definitions/props'

const Template: Story<AccordionProps> = (args: AccordionProps) => {
  const sections = new Array(3).fill(0).map(() => ({
    description: Chance().paragraph({ sentences: 1 }),
    title: Chance().sentence({ words: 2 })
  }))

  return (
    <Component.Root {...args} className='flex flex-col rounded-md bg-white border border-gray-200 divide-y divide-gray-200'>
      {(props) => (
        <Fragment>
          {sections.map((v, k) => (
            <Component.Section {...props} className='flex flex-col' key={k}>
              {(props) => (
                <Fragment>
                  <Component.SectionHeader {...props} className='rounded-md ring-offset-2 ring-blue-400 focus:ring-2 z-10'>
                    <div className='flex justify-between items-center p-6 space-x-6'>
                      <span className='font-medium'>{v.title}</span>
                      <motion.div animate={{ rotate: props.expanded ? 180 : 0 }}>
                        <KeyboardArrowDownRounded />
                      </motion.div>
                    </div>
                  </Component.SectionHeader>
                  <Component.SectionPanel {...props}>
                    <motion.div
                      animate={{ height: props.expanded ? 'auto' : 0 }}
                      className='overflow-hidden bg-gray-100'
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
        </Fragment>
      )}
    </Component.Root>
  )
}

export const Accordion = Template.bind({})
Accordion.args = {}

export default {
  component: Component.Root,
  subcomponents: { Section: Component.Section, SectionHeader: Component.SectionHeader, SectionPanel: Component.SectionPanel },
  title: 'Components/Accordion'
} as Meta
