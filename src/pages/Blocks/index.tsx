import React from 'react'
import { observer } from 'mobx-react-lite'
import PageLoader from '~/components/PageLoader'

import useBlockStore from './store'
import List from './List'

import Entry from './Entry'

export const Blocks = observer(() => {
  const store = useBlockStore()
  const { initialing, showList } = store

  return initialing ? <PageLoader>初始化中</PageLoader> : showList ? <List /> : <Entry />
})

Blocks.displayName = 'Blocks'

export default Blocks
