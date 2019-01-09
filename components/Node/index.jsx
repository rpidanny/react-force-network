import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Node extends Component {
  render () {
    const { radius, color, x, y, style } = this.props.data
    return (
      <g
        className={this.props.className}
        transform={`translate(${x},${y})`}
      >
        <circle
          r={radius}
          fill={color}
          style={style}
        />
        {
          getThumbnail(this.props)
        }
      </g>
    )
  }
}

const getThumbnail = (props) => {
  const { id, img, radius, shortText, textStyle } = props.data
  if (img) {
    return (
      <g>
        <defs>
          <clipPath
            id={`clip_${id}`}
          >
            <circle
              r={radius - 1}
              fill='#fff'
            />
          </clipPath>
        </defs>
        <image
          xlinkHref={img}
          clipPath={`url(#clip_${id})`}
          x={-radius}
          y={-radius}
          width={radius * 2}
        />
      </g>
    )
  } else {
    return (
      <text
        dx={-radius / 2}
        dy={textStyle.fontSize / 2}
        style={textStyle}
      >
        {shortText}
      </text>
    )
  }
}

Node.defaultProps = {
  className: 'node',
  radius: '25',
  color: '#cc3'
}

Node.PropTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string,
  color: PropTypes.string,
  radius: PropTypes.string,
  style: PropTypes.style,
  x: PropTypes.number,
  y: PropTypes.number
}

export default Node
