import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { api } from 'jm-blocks'

export interface PreviewProps {
  style?: React.CSSProperties
  files: api.Files[]
}

const Files = styled.div``
const Footer = styled.footer``

export const Preview: FC<PreviewProps> = props => {
  const { style, files, children } = props
  // TODO: 预览
  return (
    <div style={style}>
      <Files>
        {files.map(i => {
          return <div key={i.originPath}>{i.outputName}</div>
        })}
      </Files>
      <Footer>{children}</Footer>
    </div>
  )
}

export default Preview
