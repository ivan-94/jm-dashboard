import React from 'react'
import { CircularProgress } from '@material-ui/core'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export default function ProgressUnderButton() {
  return (
    <Wrapper>
      <CircularProgress size={40} />
    </Wrapper>
  )
}
