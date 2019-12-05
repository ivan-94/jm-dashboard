import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useInput, usePromise, useOnMount } from '@gdjiami/hooks'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { BlockConfig } from 'jm-blocks'

import useBlockStore from './store'
import Details from './Details'

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

const Entry = observer(() => {
  const store = useBlockStore()
  const url = useInput('')
  const handleClick = () => {
    console.log('click console')
    if (url.value) {
      store.initialSource(url.value)
    }
  }
  return (
    <EntryWrapper>
      <EntryForm>
        <Form.Group>
          <Form.Control placeholder="输入区块源(git地址)" {...url.input}></Form.Control>
        </Form.Group>
        <Button onClick={handleClick}>加载{store.status}</Button>
      </EntryForm>
    </EntryWrapper>
  )
})

const Operation = observer(() => {
  const store = useBlockStore()
  const [selected, setSelected] = useState<BlockConfig>()

  const list = usePromise(async () => {
    return store.search()
  })

  const handleClose = () => {
    setSelected(undefined)
  }

  useOnMount(list.call)

  return (
    <div>
      {list.value?.map(i => {
        return (
          <div key={i.id} onClick={() => setSelected(i)}>
            {i.name}
          </div>
        )
      })}
      {selected && <Details config={selected} onClose={handleClose}></Details>}
    </div>
  )
})

export const Blocks = observer(() => {
  const store = useBlockStore()

  return store.source ? <Operation></Operation> : <Entry></Entry>
})

export default Blocks
