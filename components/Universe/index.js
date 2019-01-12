import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { scaleOrdinal } from 'd3-scale'

import Node from '../Node'
import Link from '../Link'

class Universe extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this.props
    }

    this.getArcPath = this.getArcPath.bind(this)
    this.getLinks = this.getLinks.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ ...nextProps })
  }

  getLinks (source, target) {
    return this.state.links
      .filter(
        link =>
          link.source.id === source.id &&
          link.target.id === target.id
      )
      .map(l => l.type)
  }

  getArcPath (link, clockwise = true) {
    const x1 = clockwise ? link.source.x : link.target.x
    const y1 = clockwise ? link.source.y : link.target.y
    const x2 = clockwise ? link.target.x : link.source.x
    const y2 = clockwise ? link.target.y : link.source.y
    const dx = x2 - x1
    const dy = y2 - y1
    const siblings = this.getLinks(link.source, link.target)
    // const siblingCount = siblings.length
    const siblingCount = 2
    const xRotation = 0
    const largeArc = 0

    if (siblingCount > 1) {
      // console.log(siblings)
      const arcScale = scaleOrdinal()
        .domain(siblings)
        .range([1, siblingCount])
      const linkIdx = arcScale(link.type)
      let scale
      let sweep
      if (linkIdx === 1) {
        sweep = 1
        scale = 1
        // return `M${link.source.x},${link.source.y} L${link.target.x},${link.target.y}`
      } else if (linkIdx % 2 === 0) {
        sweep = 0
        scale = linkIdx / 2
      } else if (linkIdx % 3 === 0) {
        sweep = 1
        scale = linkIdx / 3 + 1
      }
      const dr =
        Math.sqrt(dx * dx + dy * dy) / (1 + (1 / siblingCount) * (scale - 1))
      return `M${x1},${y1}A${dr * 1.7},${dr *
        1.7} ${xRotation}, ${largeArc}, ${sweep} ${x2},${y2}`
    }
    return `M${link.source.x},${link.source.y} L${link.target.x},${link.target.y}`
  }

  render () {
    const { nodes, links } = this.state
    return (
      <g
        className={this.props.className}
        transform={this.props.transform}
      >
        <g className='links'>
          {
            links.reduce((acc, link, idx) => {
              if (typeof link.source === 'object' && typeof link.target === 'object') {
                acc.push(
                  <Link
                    key={idx}
                    data={link}
                    d={this.getArcPath(link)}
                    style={link.style}
                    id={link.id}
                    type={link.type}
                    arrowOffset={link.target.radius * 1.45}
                  />
                )
                return acc
              }
              return acc
            }, [])
          }
        </g>
        <g className='nodes'>
          {
            nodes.map((node, idx) =>
              <Node
                key={idx}
                onClick={this.props.onClick}
                onDoubleClick={this.props.onDoubleClick}
                {...node}
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

Universe.propTypes = {
  className: PropTypes.string,
  nodes: PropTypes.array,
  links: PropTypes.array
}

export default Universe
