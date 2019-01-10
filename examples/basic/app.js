import React from 'react'
import ReactDOM from 'react-dom'
import NetworkGraph from 'react-network-graph'

import { nodes, links } from './books-data.json'

import './style.css'

ReactDOM.render(<NetworkGraph
  nodes={nodes}
  links={links}
/>, document.getElementById('root'))

module.hot.accept()
