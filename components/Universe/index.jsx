import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Node from '../Node'

class Universe extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this.props
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ ...nextProps })
  }

  render () {
    const { nodes } = this.state
    return (
      <g
        className={this.props.className}
        transform={this.props.transform}
      >
        <g className='nodes'>
          {
            nodes.map(node => <Node data={node} />)
          }
        </g>
        <g className='links' />
      </g>
    )
  }
}

Universe.defaultProps = {
  className: 'universe',
  nodes: [],
  links: []
}

export default Universe
