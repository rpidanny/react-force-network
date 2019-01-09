import React, { Component } from 'react'
// import PropTypes from 'prop-types'

class Link extends Component {
  render () {
    const { d, data } = this.props
    const { type, id, style } = data
    return (
      <g>
        <path
          id={id}
          style={style}
          d={d}
        />
        <text>
          <textPath
            dx={0}
            dy={5}
            href={`#${id}`}
            startOffset='50%'
            style={
              {
                pointerEvents: 'none',
                textAnchor: 'middle',
                fill: '#333'
              }
            }
          >
            {type}
          </textPath>
        </text>
      </g>
    )
  }
}

export default Link
