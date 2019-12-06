import React, { FC } from 'react'
import { clipboard } from 'electron'
import { Accordion, Card, Button } from 'react-bootstrap'
import styled from 'styled-components/macro'
import { api } from 'jm-blocks'

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
`
const Code = styled.div`
  max-height: 800px;
  overflow: auto;
`
const Footer = styled.footer``

export const Preview: FC<PreviewProps> = props => {
  const { style, files, children } = props
  // TODO: 预览
  return (
    <div style={style}>
      <Files>
        <Accordion>
          {files.map(i => {
            return (
              <Card key={i.originPath}>
                {i.type === api.FileType.Dir ? (
                  <Card.Header>{i.outputName}</Card.Header>
                ) : (
                  <>
                    <Accordion.Toggle as={Card.Header} eventKey={i.originPath}>
                      <Header>
                        <span>{i.outputName}</span>
                        <Button
                          size="sm"
                          variant="light"
                          onClick={(evt: any) => {
                            evt.stopPropagation()
                            clipboard.writeText(i.content)
                          }}
                        >
                          复制
                        </Button>
                      </Header>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={i.originPath}>
                      <Card.Body>
                        <Code>
                          <pre>
                            <code>{i.content}</code>
                          </pre>
                        </Code>
                      </Card.Body>
                    </Accordion.Collapse>
                  </>
                )}
              </Card>
            )
          })}
        </Accordion>
      </Files>
      <Footer>{children}</Footer>
    </div>
  )
}

export default Preview
