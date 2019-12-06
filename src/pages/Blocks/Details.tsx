import { remote } from 'electron'
import React, { FC, useState } from 'react'
import { Button, Alert } from 'react-bootstrap'
import { usePromise, useOnMount } from '@gdjiami/hooks'
import styled from 'styled-components/macro'
import { BlockConfig } from 'jm-blocks'
import Form from 'react-jsonschema-form'
import { api } from 'jm-blocks'
import { observer } from 'mobx-react-lite'

import Preview from './Preview'
import { ReactComponent as CloseIcon } from './close.svg'

export interface DetailsProps {
  config: BlockConfig
  onClose: () => void
}

const Mask = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #00000036;
  z-index: 11;
  overflow: auto;
`

const Container = styled.div`
  position: relative;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid gray;
  padding: 17px;
  border-radius: 3px;
  width: 86%;
  box-shadow: 1px 11px 12px -5px #cacaca;
`

const Header = styled.header``
const Body = styled.main`
  padding: 1em;
`
const FormWrapper = styled.div`
  padding: 80px;
`
const Name = styled.span`
  font-size: 18px;
  margin-right: 5px;
`
const Desc = styled.span`
  font-size: 13px;
  color: gray;
`
const Footer = styled.footer`
  text-align: center;

  & > .btn:not(:last-child) {
    margin-right: 5px;
  }
`
const Close = styled(CloseIcon)`
  color: #b75252;
  position: absolute;
  right: 1em;
  top: 1em;
  font-size: 20px;
  cursor: pointer;
`

export const Details: FC<DetailsProps> = observer(props => {
  const { config, onClose } = props
  const [preview, setPreview] = useState(false)
  const [renderer] = useState(() => {
    return new api.Render(config.basePath, config)
  })

  const render = usePromise(async (model: any) => {
    const rtn = await renderer.render(model)
    setPreview(true)
    console.log(rtn)
    return rtn
  })

  const handleSubmit = (e: any) => {
    render.call(e.formData)
  }

  const handleExport = async () => {
    try {
      render.setLoading(true)
      const { filePaths } = await remote.dialog.showOpenDialog({
        title: '选择导出路径',
        properties: ['openDirectory'],
      })
      if (filePaths && filePaths.length) {
        await renderer.output(filePaths[0])
      }
    } catch (err) {
      render.setError(err)
    } finally {
      render.setLoading(false)
    }
  }

  useOnMount(async () => {
    if (config.model == null) {
      render.call({})
    }
  })

  return (
    <Mask>
      <Container>
        <Header>
          <Name>{config.name}</Name>
          <Desc>{config.description}</Desc>
          <Close onClick={onClose}></Close>
        </Header>
        <Body>
          {!!render.value && preview && (
            <Preview files={render.value}>
              <Footer>
                <Button size="sm" onClick={handleExport} disabled={render.loading}>
                  {render.loading ? '正在导出...' : '导出'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => setPreview(false)}>
                  返回
                </Button>
              </Footer>
            </Preview>
          )}
          <div style={{ display: preview ? 'none' : 'block' }}>
            {!!render.error && <Alert variant="danger">{render.error.message}</Alert>}
            {!!config.model && (
              <FormWrapper>
                <Form schema={config.model} onSubmit={handleSubmit}>
                  <Footer>
                    <Button size="sm" type="submit" disabled={render.loading}>
                      {render.loading ? '正在生成' : '预览'}
                    </Button>
                  </Footer>
                </Form>
              </FormWrapper>
            )}
          </div>
        </Body>
      </Container>
    </Mask>
  )
})

export default Details
