import { useToggle } from '@gdjiami/hooks'
import { cls } from '@gdjiami/jslib'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem as _ListItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
} from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import AspectRatio from '@material-ui/icons/AspectRatio'
import MenuIcon from '@material-ui/icons/Menu'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import styled from 'styled-components/macro'

import history from '~/history'

const drawerWidth = 200
const navs = [{ name: 'Block', link: '/', icon: <AspectRatio /> }]

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const AppBarShift = styled(AppBar)`
  z-index: 1201 !important;
  transition: all 0.3s ease-in-out !important;
  &.open {
    margin-left: ${drawerWidth}px;
    width: calc(100% - ${drawerWidth}px) !important;
  }
`

const MenuIconButton = styled(IconButton)`
  margin-right: 36px;
  &.hide {
    display: none !important;
  }
`

const NavList = styled(Drawer)`
  white-space: nowrap;
  & .MuiDrawer-paper {
    position: relative;
    overflow: hidden;
    width: 58px;
    transition: all 0.3s ease-in-out;
  }

  &.open .MuiDrawer-paper {
    width: ${drawerWidth}px !important;
  }
`

const ListItem = styled(_ListItem)`
  &.active {
    background: #ddd;
  }
`

const DrawerToolbar = styled(Toolbar)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const Main = styled.div`
  padding-top: 64px;
`

export const Navigation = observer(props => {
  const [open, openToggle] = useToggle(false)
  const path = window.location.hash.split('#')[1]

  const [current, setCurrent] = useState(path || navs[0].link)

  const handleClick = (link: string) => {
    history.push(link)
    setCurrent(link)
  }

  return (
    <Container>
      <CssBaseline />
      <AppBarShift className={cls({ open })} position="fixed">
        <Toolbar>
          <MenuIconButton className={cls({ hide: open })} color="inherit" onClick={openToggle} edge="start">
            <MenuIcon />
          </MenuIconButton>
          <Typography variant="h6" noWrap>
            jm-dashboard
          </Typography>
        </Toolbar>
      </AppBarShift>
      <NavList className={cls({ open })} variant="permanent">
        <DrawerToolbar>
          <IconButton onClick={openToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerToolbar>
        <Divider />
        <List>
          {navs.map(item => (
            <ListItem
              button
              key={item.name}
              className={cls({ active: current === item.link })}
              onClick={() => handleClick(item.link)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </NavList>
      <Main>{props.children}</Main>
    </Container>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation
