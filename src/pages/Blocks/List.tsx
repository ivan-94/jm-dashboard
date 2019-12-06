import React, { useState, useEffect, FC } from 'react'
import styled from 'styled-components/macro'
import { usePromise, useInput } from '@gdjiami/hooks'
import { Card, Badge, InputGroup, Form, FormControl, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { BlockConfig } from 'jm-blocks'

import useBlockStore from './store'
import { ReactComponent as SettingIcon } from './setting.svg'
import Details from './Details'

const Cards = styled.div`
  padding: 20px;
  & .card {
    display: inline-block;
    min-width: 253px;
    margin: 10px;
    cursor: pointer;
  }
`

const Wrapper = styled.div`
  padding: 10px;
`

const Header = styled.header`
  margin: 20px 10px;
`

const Tags = styled.div`
  & > .badge {
    margin-right: 5px;
  }
`

export interface ListProps {
  onResetEntry: () => void
}

const List: FC<ListProps> = observer(props => {
  const { onResetEntry } = props
  const store = useBlockStore()
  const [selected, setSelected] = useState<BlockConfig>()
  const queryInput = useInput('')
  const [query, setQuery] = useState('')

  const list = usePromise(async (q: string) => {
    return store.search(q)
  })

  const handleClose = () => {
    setSelected(undefined)
  }

  const handleSubmit: React.FormEventHandler = evt => {
    evt.preventDefault()
    setQuery(queryInput.value || '')
  }

  useEffect(() => {
    list.call(query)
  }, [query])

  return (
    <Wrapper>
      <Header>
        <Form onSubmit={handleSubmit}>
          <InputGroup size="sm">
            <FormControl placeholder="区块名称" {...queryInput.input}></FormControl>
            <InputGroup.Append>
              <Button type="submit">{list.loading ? '搜索中...' : '搜索'}</Button>
            </InputGroup.Append>
          </InputGroup>
          <SettingIcon onClick={onResetEntry}></SettingIcon>
        </Form>
      </Header>
      <Cards>
        {list.value?.map(i => {
          return (
            <Card key={i.id} onClick={() => setSelected(i)}>
              <Card.Img variant="top"></Card.Img>
              <Card.Body>
                <Card.Title>{i.name}</Card.Title>
                <Card.Subtitle>{i.description}</Card.Subtitle>
                <Card.Text>
                  {i.author && <div>作者: {i.author}</div>}
                  {i.version && <div>版本号: {i.version}</div>}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Tags>
                  {i.tag?.map((tag, i) => {
                    return (
                      <Badge key={i} variant="secondary">
                        {tag}
                      </Badge>
                    )
                  })}
                </Tags>
              </Card.Footer>
            </Card>
          )
        })}
      </Cards>

      {selected && <Details config={selected} onClose={handleClose}></Details>}
    </Wrapper>
  )
})

export default List
