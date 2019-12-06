import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'

import useBlockStore from './store'
import List from './List'
import { SyncStatus } from 'jm-blocks/dist/api'

import Entry from './Entry'

export const Blocks = observer(() => {
  const store = useBlockStore()
  const [showEntry, setShowEntry] = useState(!store.source)

  return !showEntry && store.status === SyncStatus.Synced ? (
    <List
      onResetEntry={() => {
        setShowEntry(true)
      }}
    />
  ) : (
    <Entry
      onShowList={() => {
        setShowEntry(false)
      }}
    />
  )
})

export default Blocks
