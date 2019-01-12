import React from 'react'
import ReactDOM from 'react-dom'
import NetworkGraph from 'react-network-graph'

import { nodes, links } from './books-data.json'

import './style.css'

ReactDOM.render(<NetworkGraph
  nodes={nodes}
  links={links}
  attraceForceStrength={-500}
  chargeStrength={350}
  velocityDecay={0.2}
  collisionStrength={0.6}
/>, document.getElementById('root'))

module.hot.accept()
