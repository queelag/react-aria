import { KeyboardArrowDownRounded } from '@material-ui/icons'
import { Meta } from '@storybook/react'
import { Chance } from 'chance'
import { motion } from 'framer-motion'
import React, { Fragment } from 'react'
import { Disclosure } from '../src/components/Disclosure'
import { DisclosureStatus } from '../src/definitions/enums'
import { DisclosureSectionChildrenProps } from '../src/definitions/props'

const sections: { description: string; title: string }[] = new Array(6).fill(0).map((v) => ({
  description: Chance().paragraph({ sentences: 1 }),
  title: Chance().sentence({ words: 2 })
}))

export const Raw = () => (
  <Disclosure.Root>
    {sections.map((v, k) => (
      <Disclosure.Section>
        {(props: DisclosureSectionChildrenProps) => (
          <Fragment>
            <Disclosure.SectionHeader {...props}>
              <Disclosure.SectionHeaderButton {...props}>{v.title}</Disclosure.SectionHeaderButton>
            </Disclosure.SectionHeader>
            <Disclosure.SectionPanel {...props}>{props.status === DisclosureStatus.EXPANDED && v.description}</Disclosure.SectionPanel>
          </Fragment>
        )}
      </Disclosure.Section>
    ))}
  </Disclosure.Root>
)

export const Styled = () => (
  <Disclosure.Root className='flex flex-col rounded-md bg-white border border-gray-200 divide-y divide-gray-200'>
    {sections.map((v, k) => (
      <Disclosure.Section key={k}>
        {(props: DisclosureSectionChildrenProps) => (
          <Fragment>
            <Disclosure.SectionHeader {...props}>
              <Disclosure.SectionHeaderButton {...props} className='w-full flex justify-between items-center p-6 space-x-6 focus:bg-gray-50'>
                <span className='font-medium'>{v.title}</span>
                <motion.div animate={{ rotate: props.status === DisclosureStatus.EXPANDED ? 180 : 0 }}>
                  <KeyboardArrowDownRounded />
                </motion.div>
              </Disclosure.SectionHeaderButton>
            </Disclosure.SectionHeader>
            <Disclosure.SectionPanel {...props}>
              <motion.div
                animate={{ height: props.status === DisclosureStatus.EXPANDED ? 'auto' : 0 }}
                className='overflow-hidden bg-gray-100'
                initial={{ height: 0 }}
                transition={{ type: 'linear' }}
              >
                <div className='w-full h-px bg-gray-200' />
                <div className='p-6 text-sm'>{v.description}</div>
              </motion.div>
            </Disclosure.SectionPanel>
          </Fragment>
        )}
      </Disclosure.Section>
    ))}
  </Disclosure.Root>
)

export default {
  component: Disclosure.Root,
  title: 'Components/Disclosure'
} as Meta
