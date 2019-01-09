import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { select, event } from 'd3-selection'
import {
  forceLink,
  forceSimulation,
  forceCenter,
  forceManyBody,
  forceCollide
} from 'd3-force'
import { zoom } from 'd3-zoom'
import Universe from './components/Universe'
import './style.css'

class NetworkGraph extends Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: [],
      links: [],
      simulation: this.initSimulation(),
      width: 100,
      height: 100,
      transform: {
        x: 0,
        y: 0,
        k: 1
      }
    }
    this.initSimulation = this.initSimulation.bind(this)
    this.initZoomHandler = this.initZoomHandler.bind(this)
    this.updateSimulation = this.updateSimulation.bind(this)
    this.onTick = this.onTick.bind(this)
    this.svg = React.createRef()
    this.nodes = []
    this.links = []
  }

  componentDidMount () {
    this.initZoomHandler()
    this.setState({
      ...this.props,
      width: this.svg.current.clientWidth,
      height: this.svg.current.clientHeight
    }, () => {
      this.updateSimulation()
    })
  }

  initSimulation () {
    const linkForce = forceLink()
      .id(link => link.id)
      .strength(link => link.strength)
      .distance(link => link.distance)
    const simulation = forceSimulation().force('link', linkForce)

    return simulation
  }

  initZoomHandler () {
    // TODO: replace select dependency
    // add zoom capabilities
    const svg = select('.svgGraph')
    const zoomHandler = zoom().on('zoom', () => {
      this.setState({
        transform: event.transform
      })
    })
    svg.call(zoomHandler).on('dblclick.zoom', null)
  }

  updateSimulation () {
    const { nodes, links, simulation, width, height } = this.state
    this.nodes = nodes
    this.links = links
    simulation
      .nodes(this.nodes)
      .on('tick', this.onTick)
    // simulation.force('link').links(this.links)
    simulation
      .force('center', forceCenter(width / 2, height / 2))
      .force('attraceForce', forceManyBody().strength(10))
      .force('charge', forceManyBody().strength(-10))
      .force(
        'collision',
        forceCollide()
          .radius(node => 45)
          .strength(0.7)
      )

    simulation
      .alpha(0.4)
      .alphaTarget(0)
      .velocityDecay(0.4)
      .restart()
    // while (simulation.alpha() >= 0.02) {
    //   simulation.tick()
    // }
  }

  onTick (e) {
    this.setState({
      nodes: this.nodes
    })
  }

  render () {
    const { nodes, transform } = this.state

    return (
      <div
        className='networkGraph'
      >
        <svg
          className='svgGraph'
          width='100%'
          height='100%'
          ref={this.svg}
        >
          <Universe
            nodes={nodes}
            transform={
              `translate(${transform.x},${transform.y}) scale(${transform.k})`
            }
            onClick={this.props.onClick}
            onDoubleClick={this.props.onDoubleClick}
          />
        </svg>
        <span className='zoomIndicator'>{parseInt(transform.k * 100, 10)} %</span>
      </div>
    )
  }
}

NetworkGraph.defaultProps = {
  nodes: [],
  links: []
}

NetworkGraph.propTypes = {
  nodes: PropTypes.array,
  links: PropTypes.array,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func
}

export default NetworkGraph
