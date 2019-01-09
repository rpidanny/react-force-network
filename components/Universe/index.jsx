import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Node from '../Node'
import Link from '../Link'

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
    const { nodes, links } = this.state
    return (
      <g
        className={this.props.className}
        transform={this.props.transform}
      >
        <g className='nodes'>
          {
            nodes.map(node =>
              <Node
                data={node}
                onClick={this.props.onClick}
                onDoubleClick={this.props.onDoubleClick}
              />
            )
          }
        </g>
        <g className='links'>
          {
            links.map(link =>
              <Link
                data={link}
              />
            )
          }
        </g>
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
