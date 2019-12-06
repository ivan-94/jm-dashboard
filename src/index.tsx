/**
 * App entry
 */
import React from 'react'
import ReactDOM from 'react-dom'
import App from '~/pages'
import { clone } from '~/utils/git-sync'

import './global.css'

// @ts-ignore
window.clone = clone

ReactDOM.render(<App />, document.getElementById('root'))
