import React, { Component } from 'react'
import PropTypes from 'prop-types'

// import './style.css'

class Node extends Component {
  constructor () {
    super()
    this.clickHandler = this.clickHandler.bind(this)
    this.doubleClickHandler = this.doubleClickHandler.bind(this)
    this.mouseOverHandler = this.mouseOverHandler.bind(this)
    this.mouseOutHandler = this.mouseOutHandler.bind(this)
    // for click vs dblclick
    this.clickTimeout = null
  }

  clickHandler () {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout)
      this.clickTimeout = null
      this.doubleClickHandler()
    } else {
      this.clickTimeout = setTimeout(() => {
        if (this.props.onClick) {
          this.props.onClick({
            type: 'NODE',
            data: this.props.id
          })
        }
      }, 300)
    }
  }

  doubleClickHandler () {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick({
        type: 'NODE',
        data: this.props.id
      })
    }
  }

  mouseOverHandler (event, x) {
    if (this.props.onMouseOver) {
      this.props.onMouseOver({
        type: 'NODE',
        data: {
          id: this.props.id,
          text: this.props.text,
          type: this.props.type
        },
        event
      })
    }
  }

  mouseOutHandler (event) {
    if (this.props.onMouseOut) {
      this.props.onMouseOut({
        type: 'NODE',
        data: {
          id: this.props.id,
          text: this.props.text,
          type: this.props.type
        },
        event
      })
    }
  }

  render () {
    const {
      className,
      radius,
      color,
      x,
      y,
      style
    } = this.props
    return (
      <g
        className={className}
        transform={`translate(${x},${y})`}
        onClick={this.clickHandler}
        style={{
          cursor: 'pointer'
        }}
        onMouseOver={this.mouseOverHandler}
        onMouseOut={this.mouseOutHandler}
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
  const { id, img, radius, shortText, textStyle } = props
  if (img) {
    return (
      <g>
        <defs>
          <clipPath
            id={`clip_${id}`}
          >
            <circle
              r={radius - 1}
              // fill={bgColor}
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
  radius: 35,
  color: '#FFFFFF',
  style: {
    r: 35,
    stroke: '#375E97',
    strokeWidth: '3px'
  },
  textStyle: {
    fontSize: 15,
    fill: '#fff',
    strokeWidth: '3px',
    fontWeight: 'normal'
  }
}

Node.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  text: PropTypes.string,
  shortText: PropTypes.string,
  className: PropTypes.string,
  img: PropTypes.string,
  color: PropTypes.string,
  radius: PropTypes.number,
  style: PropTypes.shape({
    r: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.string
  }),
  textStyle: PropTypes.shape({
    fontSize: PropTypes.number,
    fill: PropTypes.string,
    strokeWidth: PropTypes.string,
    fontWeight: PropTypes.string
  }),
  x: PropTypes.number,
  y: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseOver: PropTypes.func
}

export default Node
