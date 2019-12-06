import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { api } from 'jm-blocks'

import useBlockStore from './store'
import List from './List'

import Entry from './Entry'

export const Blocks = observer(() => {
  const store = useBlockStore()
  const [showEntry, setShowEntry] = useState(!store.source)

  return !showEntry && store.status === api.SyncStatus.Synced ? (
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
