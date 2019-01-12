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
import { uniqBy } from 'lodash'

import Universe from './components/Universe'
// import './style.css'

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

    // to timit fps
    this.interval = (1000 / this.props.fps)
    this.millis = Date.now()
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

  componentWillReceiveProps (newProps) {
    this.setState({
      ...newProps
    }, () => {
      this.interval = (1000 / this.state.fps)
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
    const {
      nodes,
      links,
      simulation,
      width,
      height,
      attraceForceStrength,
      chargeStrength,
      collisionRadiusOffset,
      collisionStrength,
      animation,
      velocityDecay,
      alphaStart,
      cluster,
      clusterRadiusScale
    } = this.state

    this.nodes = nodes
    this.links = []

    // bind nodes to links
    links.forEach(link => {
      const sourceNode = this.nodes.filter(
        node => node.id === link.source
      )[0]
      const targetNode = this.nodes.filter(
        node => node.id === link.target
      )[0]
      if (sourceNode && targetNode) {
        this.links.push({
          ...link,
          source: sourceNode,
          target: targetNode
        })
      }
    })
    simulation
      .nodes(this.nodes)
      .on('tick', this.onTick)
    simulation.force('link').links(this.links)
    simulation
      .force('center', forceCenter(width / 2, height / 2))
      .force('attraceForce', forceManyBody().strength(attraceForceStrength))
      .force('charge', forceManyBody().strength(chargeStrength))
      .force(
        'collision',
        forceCollide()
          .radius(node => node.radius + collisionRadiusOffset)
          .strength(collisionStrength)
      )

    // Enable clustering of nodes of same type
    if (cluster) {
      const clusters = {}
      const nodeTypes = uniqBy(this.nodes, 'type').map(type => type.type)

      nodeTypes.forEach((type, idx, arr) => {
        if (!clusters[type]) {
          const radius = width > height ? height * clusterRadiusScale : width * clusterRadiusScale
          clusters[type] = {
            x: Math.cos((idx + 1) / arr.length * 2 * Math.PI) * radius + width / 2 + Math.random(),
            y: Math.sin((idx + 1) / arr.length * 2 * Math.PI) * radius + height / 2 + Math.random(),
            radius
          }
        }
      })

      simulation.force('cluster', alpha =>
        applyClusterForce(alpha, this.nodes, clusters)
      )
    }
    simulation
      .alpha(alphaStart)
      .alphaTarget(0)
      .velocityDecay(velocityDecay)
      .restart()

    if (!animation) {
      while (simulation.alpha() >= 0.02) {
        simulation.tick()
      }
    }
  }

  onTick (e) {
    // limit rendering
    const currentTime = Date.now()
    if (currentTime - this.millis > this.interval) {
      this.millis = currentTime
      this.setState({
        nodes: this.nodes,
        links: this.links
      })
    }
  }

  render () {
    const { nodes, links, transform } = this.state
    return (
      <div
        className='networkGraph'
        style={{
          height: '100%',
          width: '100%'
        }}
      >
        <svg
          className='svgGraph'
          width='100%'
          height='100%'
          ref={this.svg}
        >
          <Universe
            nodes={nodes}
            links={links}
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

// node cluster handler
const applyClusterForce = (alpha, nodes, clusters) => {
  nodes.forEach(node => {
    const cluster = clusters[node.type]
    if (cluster.x !== node.x && cluster.y !== node.y) {
      const k = alpha * 0.5
      node.vx -= (node.x - cluster.x) * k
      node.vy -= (node.y - cluster.y) * k
    }
  })
}

NetworkGraph.defaultProps = {
  nodes: [],
  links: [],
  attraceForceStrength: 10,
  chargeStrength: -10,
  collisionRadiusOffset: 15,
  collisionStrength: 0.5,
  animation: true,
  cluster: false,
  fps: 60,
  alphaStart: 1,
  velocityDecay: 0.4,
  clusterRadiusScale: 2
}

NetworkGraph.propTypes = {
  nodes: PropTypes.array,
  links: PropTypes.array,
  attraceForceStrength: PropTypes.number,
  chargeStrength: PropTypes.number,
  collisionRadiusOffset: PropTypes.number,
  collisionStrength: PropTypes.number,
  animation: PropTypes.bool,
  fps: PropTypes.number,
  alphaStart: PropTypes.number,
  velocityDecay: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  cluster: PropTypes.bool,
  clusterRadiusScale: PropTypes.number
}

export default NetworkGraph
