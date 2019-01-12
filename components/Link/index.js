import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Link extends Component {
  render () {
    const { d, pointer, style, id } = this.props
    return (
      <g>
        { getPointer(this.props) }
        <path
          id={id}
          style={style}
          d={d}
          markerEnd={pointer ? `url(#${id}_pointer)` : pointer}
        />
        { getLabel(this.props) }
      </g>
    )
  }
}

const getPointer = (props) => {
  if (props.pointer) {
    return (
      <defs>
        <marker
          id={`${props.id}_pointer`}
          viewBox='0 -5 10 10'
          refX={props.arrowOffset}
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
      </defs>
    )
  }
}

const getLabel = (props) => {
  if (props.type) {
    return (
      <text>
        <textPath
          dx={0}
          dy={5}
          href={`#${props.id}`}
          startOffset='50%'
          style={props.textStyle}
        >
          {props.type}
        </textPath>
      </text>
    )
  }
}

Link.defaultProps = {
  style: {
    strokeWidth: 1.5,
    fill: 'none',
    stroke: 'gba(50, 50, 50, 0.2)'
  },
  textStyle: {
    pointerEvents: 'none',
    textAnchor: 'middle',
    fill: '#333'
  },
  pointer: true
}

Link.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  d: PropTypes.string.isRequired,
  pointer: PropTypes.bool
}

export default Link
