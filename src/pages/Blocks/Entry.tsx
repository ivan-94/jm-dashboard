import React, { FC } from 'react'
import { TextField, IconButton } from '@material-ui/core'
import GetAppIcon from '@material-ui/icons/GetApp'
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp'
import Alert from '~/components/Alert'
import Progress from '~/components/ProgressUnderButton'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { useInput } from '@gdjiami/hooks'
import useBlockStore from './store'

const EntryWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 100px 10%;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const EntryForm = styled.form`
  width: 100%;
  text-align: center;
`

const Actions = styled.div`
  margin-top: 10px;
`

export interface EntryProps {}

const Entry: FC<EntryProps> = observer(props => {
  const store = useBlockStore()
  const { initialing, syncing, source } = store
  const url = useInput(source)

  const handleSubmit: React.FormEventHandler = evt => {
    evt.preventDefault()
    if (url.value) {
      store.sync(url.value)
    }
  }

  return (
    <EntryWrapper>
      <EntryForm onSubmit={handleSubmit}>
        <TextField
          disabled={syncing || initialing}
          style={{ width: '100%' }}
          placeholder="输入区块源(git地址)"
          {...url.input}
        ></TextField>
        <Actions>
          <IconButton type="submit">
            <GetAppIcon />
            {(syncing || initialing) && <Progress></Progress>}
          </IconButton>
          {!!source && (
            <IconButton onClick={() => (store.showList = true)} disabled={syncing}>
              <ExitToAppSharpIcon />
            </IconButton>
          )}
        </Actions>
        {!!store.initialError && <Alert style={{ width: '100%' }}>{store.initialError.message}</Alert>}
        {!!store.syncError && <Alert style={{ width: '100%' }}>{store.syncError.message}</Alert>}
      </EntryForm>
    </EntryWrapper>
  )
})

export default Entry
