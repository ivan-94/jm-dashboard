import React, { FC, useEffect } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
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

const EntryForm = styled(Form)`
  width: 100%;
  text-align: center;
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
  const url = useInput(store.source)

  const handleClick = () => {
    if (url.value) {
      store.initialSource(url.value)
    }
  }

  useEffect(() => {
    if (store.status === SyncStatus.Synced) {
      onShowList()
    }
  }, [store.status])

  return (
    <EntryWrapper>
      <EntryForm>
        <Form.Group>
          <Form.Control placeholder="输入区块源(git地址)" {...url.input}></Form.Control>
        </Form.Group>
        <div>
          <Button onClick={handleClick}>加载</Button>
          <span>{status[store.status]}</span>
        </div>
        {!!store.initialError && <Alert variant="danger">{store.initialError.message}</Alert>}
      </EntryForm>
    </EntryWrapper>
  )
})

export default Entry
