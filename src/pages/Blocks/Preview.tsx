import React, { FC } from 'react'
import { clipboard } from 'electron'
import { ExpansionPanel, Button, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import styled from 'styled-components/macro'
import { api } from '@gdjiami/blocks'

export interface PreviewProps {
  style?: React.CSSProperties
  files: api.Files[]
}

const Files = styled.div`
  margin-bottom: 1em;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const Code = styled.div`
  max-height: 800px;
  overflow: auto;
`
const Footer = styled.footer``

export const Preview: FC<PreviewProps> = props => {
  const { style, files, children } = props
  return (
    <div style={style}>
      <Files>
        {files.map(i => {
          return i.type === api.FileType.Dir ? (
            <ExpansionPanel key={i.originPath}>
              <ExpansionPanelSummary>{i.outputName}</ExpansionPanelSummary>
            </ExpansionPanel>
          ) : (
            <ExpansionPanel key={i.originPath}>
              <ExpansionPanelSummary>
                <Header>
                  <span>{i.outputName}</span>
                  <Button
                    size="small"
                    onClick={(evt: any) => {
                      evt.stopPropagation()
                      clipboard.writeText(i.content)
                    }}
                  >
                    复制
                  </Button>
                </Header>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Code>
                  <pre>
                    <code>{i.content}</code>
                  </pre>
                </Code>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
        })}
      </Files>
      <Footer>{children}</Footer>
    </div>
  )
}

export default Preview
