import React, { Component } from 'react'
// import PropTypes from 'prop-types'

class Link extends Component {
  render () {
    const { d, data } = this.props
    const { type, id, style } = data
    return (
      <g>
        <defs>
          <marker
            id={`${id}_pointer`}
            viewBox='0 -5 10 10'
            refX={data.target.radius * 1.45}
            refY='-2'
            markerWidth='6'
            markerHeight='6'
            orient='auto'
          >
            <path
              d='M0,-5L10,0L0,5'
              fill='#666'
              style={{
                opacity: 1
              }} />
          </marker>
          {/* <marker id='endTransparent' viewBox='0 -5 10 10' refX='37' refY='0' markerWidth='6' markerHeight='6' orient='auto'>
            <path d='M0,-5L10,0L0,5' fill='#666' style='opacity: 0.1;' />
          </marker> */}
        </defs>
        <path
          id={id}
          style={style}
          d={d}
          markerEnd={`url(#${id}_pointer)`}
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
