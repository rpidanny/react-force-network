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
  const { img, radius } = props.data
  if (img) {
    return (
      <image
        xlinkHref={img}
        // clip-path="url(#thumbnailClip_656)"
        x={-radius}
        y={-radius}
        width={radius * 2}
      />
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
