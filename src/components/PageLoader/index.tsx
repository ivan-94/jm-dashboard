import React, { FC } from 'react'
import { CircularProgress } from '@material-ui/core'
import styled from 'styled-components'

const Loader = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 13px;
  line-height: 5em;
  color: gray;
`

export const PageLoader: FC = props => {
  return (
    <Loader>
      <CircularProgress />
      <div>{props.children}</div>
    </Loader>
  )
}

export default PageLoader
