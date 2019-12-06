import { remote } from 'electron'
import React, { FC, useState } from 'react'
import { Button } from '@material-ui/core'
import { usePromise, useOnMount } from '@gdjiami/hooks'
import styled from 'styled-components/macro'
import { BlockConfig } from 'jm-blocks'
import { withTheme } from 'react-jsonschema-form'
import { Theme as MuiTheme } from 'rjsf-material-ui'
import Alert from '~/components/Alert'

import { api } from 'jm-blocks'
import { observer } from 'mobx-react-lite'

import Preview from './Preview'
const Form = withTheme(MuiTheme)

export interface DetailsProps {
  config: BlockConfig
}

const Container = styled.div`
  position: relative;
  padding: 17px;
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

export const Details: FC<DetailsProps> = observer(props => {
  const { config } = props
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
    <Container>
      <Header>
        <Name>{config.name}</Name>
        <Desc>{config.description}</Desc>
      </Header>
      <Body>
        {!!render.value && preview && (
          <Preview files={render.value}>
            <Footer>
              <Button variant="contained" size="small" onClick={handleExport} disabled={render.loading}>
                {render.loading ? '正在导出...' : '导出'}
              </Button>
              {!!config.model && (
                <Button variant="contained" size="small" color="secondary" onClick={() => setPreview(false)}>
                  返回
                </Button>
              )}
            </Footer>
          </Preview>
        )}
        <div style={{ display: preview ? 'none' : 'block' }}>
          {!!render.error && <Alert>{render.error.message}</Alert>}
          {!!config.model && (
            <FormWrapper>
              <Form schema={config.model} onSubmit={handleSubmit}>
                <Footer>
                  <Button variant="contained" size="small" type="submit" disabled={render.loading}>
                    {render.loading ? '正在生成' : '预览'}
                  </Button>
                </Footer>
              </Form>
            </FormWrapper>
          )}
        </div>
      </Body>
    </Container>
  )
})

export default Details
