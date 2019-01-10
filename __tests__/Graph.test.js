/* global it */
import React from 'react'
import ReactDOM from 'react-dom'
import NetworkGraph from '../'

import { nodes, links } from './test-data.json'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<NetworkGraph
    nodes={nodes}
    links={links}
  />, div)
  ReactDOM.unmountComponentAtNode(div)
})
