import React, { Component } from 'react'

import './style.css'

class NetworkGraph extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <svg className='networkGraph' width='100%' height='100%' />
      </div>
    )
  }
}

export default NetworkGraph