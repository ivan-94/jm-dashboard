import React, { FC, useEffect, useState } from 'react'
import { TextField, IconButton } from '@material-ui/core'
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import Alert from '~/components/Alert'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useInput } from '@gdjiami/hooks'
import useBlockStore from './store'
import { api } from 'jm-blocks'

const { SyncStatus } = api

const EntryWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const EntryForm = styled.form`
  width: 100%;
  text-align: center;
`

const Actions = styled.div`
  margin-top: 10px;
`

const Status = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: gray;
`

const status = {
  [SyncStatus.Initial]: '未初始化',
  [SyncStatus.Syncing]: '同步中',
  [SyncStatus.Error]: '异常',
  [SyncStatus.Synced]: '已同步',
}

export interface EntryProps {
  onShowList: () => void
}

const Entry: FC<EntryProps> = observer(props => {
  const { onShowList } = props
  const store = useBlockStore()
  const [isInitial] = useState(!store.source)
  const url = useInput(store.source)

  const handleSubmit: React.FormEventHandler = evt => {
    evt.preventDefault()
    if (url.value) {
      store.initialSource(url.value)
    }
  }

  useEffect(() => {
    if (store.status === SyncStatus.Synced && isInitial) {
      onShowList()
    }
  }, [store.status])

  return (
    <EntryWrapper>
      <EntryForm onSubmit={handleSubmit}>
        <TextField style={{ width: '100%' }} placeholder="输入区块源(git地址)" {...url.input}></TextField>
        <Actions>
          <IconButton type="submit">
            <FlightTakeoffIcon />
          </IconButton>
          {!isInitial && store.status === SyncStatus.Synced && (
            <IconButton>
              <ArrowBackIosIcon onClick={onShowList} />
            </IconButton>
          )}
          <Status>{status[store.status]}</Status>
        </Actions>
        {!!store.initialError && <Alert style={{ position: 'absolute' }}>{store.initialError.message}</Alert>}
      </EntryForm>
    </EntryWrapper>
  )
})

export default Entry
