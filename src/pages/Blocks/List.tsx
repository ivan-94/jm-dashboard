import React, { useState, useEffect, FC } from 'react'
import styled from 'styled-components/macro'
import { Dialog, AppBar, IconButton, Toolbar, Card, CardContent, CardActions, Chip, InputBase } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import SettingsIcon from '@material-ui/icons/Settings'
import RefreshIcon from '@material-ui/icons/Refresh'
import ProgressUnderButton from '~/components/ProgressUnderButton'
import { usePromise, useInput } from '@gdjiami/hooks'
import { observer } from 'mobx-react-lite'
import { BlockConfig } from '@gdjiami/blocks'

import useBlockStore from './store'
import Details from './Details'
import Alert from '~/components/Alert'

const Cards = styled.div`
  padding: 20px;
  & .MuiPaper-root {
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

const Title = styled.div`
  font-size: 18px;
`
const SubTitle = styled.div`
  font-size: 16px;
`
const Text = styled.div`
  font-size: 14px;
`

const Tags = styled.div`
  & > .badge {
    margin-right: 5px;
  }
`

export interface ListProps {}

const List: FC<ListProps> = observer(props => {
  const store = useBlockStore()
  const { syncing, pull } = store
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
    if (syncing) {
      return
    }

    setQuery(queryInput.value || '')
  }

  useEffect(() => {
    list.call(query)
  }, [query])

  return (
    <Wrapper>
      <Header>
        <form onSubmit={handleSubmit}>
          <InputBase placeholder="区块名称" {...queryInput.input} />
          <IconButton type="submit">
            <SearchIcon />
          </IconButton>
          <IconButton onClick={() => (store.showList = false)} disabled={syncing}>
            <SettingsIcon></SettingsIcon>
          </IconButton>
          <IconButton onClick={pull} disabled={syncing}>
            <RefreshIcon></RefreshIcon>
            {syncing && <ProgressUnderButton />}
          </IconButton>
        </form>
      </Header>
      <Cards>
        {!!list.error && <Alert>{list.error.message}</Alert>}
        {list.value?.map(i => {
          return (
            <Card key={i.id} onClick={() => setSelected(i)}>
              <CardContent>
                <Title>{i.name}</Title>
                <SubTitle>{i.description}</SubTitle>
                <Text>
                  {i.author && <div>作者: {i.author}</div>}
                  {i.version && <div>版本号: {i.version}</div>}
                </Text>
              </CardContent>
              <CardActions>
                <Tags>
                  {i.tag?.map((tag, i) => {
                    return <Chip key={i} label={tag} />
                  })}
                </Tags>
              </CardActions>
            </Card>
          )
        })}
      </Cards>

      <Dialog fullScreen open={!!selected} onClose={handleClose}>
        <AppBar style={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {selected && <Details config={selected}></Details>}
      </Dialog>
    </Wrapper>
  )
})

List.displayName = 'List'

export default List
