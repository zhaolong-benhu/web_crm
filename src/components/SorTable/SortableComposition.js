/**
 * Created by huangchao on 17/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { swapArrayElements, isMouseBeyond } from './helpers.js'

/* Higher-order component - this component works like a factory for draggable items */

export function SortableComposition(Component) {
  // var elementEdge = 0
  // let updateEdge = true

  class Sortable extends React.Component {
    static propTypes = {
      items: PropTypes.any.isRequired,
      updateState: PropTypes.func.isRequired,
      sortId: PropTypes.number,
      outline: PropTypes.string.isRequired, // list | grid
      draggingIndex: PropTypes.any,
      moveInMiddle: PropTypes.any,
    }
    state = {
      draggingIndex: null,
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        draggingIndex: nextProps.draggingIndex,
      })
    }

    sortEnd = (e) => {
      e.preventDefault()
      this.isDragging()
      this.props.updateState({
        draggingIndex: null,
      })
    }

    sortStart = (e) => {
      const draggingIndex = e.currentTarget.dataset.id
      this.props.updateState({
        draggingIndex: draggingIndex,
      })

      this.setState({
        draggingIndex: draggingIndex,
      })

      let dt = e.dataTransfer
      if (dt !== undefined) {
        e.dataTransfer.setData('text', e.target.innerHTML)
        // fix http://stackoverflow.com/questions/27656183/preserve-appearance-of-dragged-a-element-when-using-html5-draggable-attribute
        if (dt.setDragImage && e.currentTarget.tagName.toLowerCase() === 'a') {
          dt.setDragImage(e.target, 0, 0)
        }
      }
      // updateEdge = true
    }

    dragOver = (e) => {
      e.preventDefault()
      var mouseBeyond
      var positionX, positionY
      var height, topOffset
      var items = this.props.items
      const { outline, moveInMiddle } = this.props
      const overEl = e.currentTarget // underlying element
      const indexDragged = Number(overEl.dataset.id) // index of underlying element in the set DOM elements
      const indexFrom = Number(this.state.draggingIndex)

      height = overEl.getBoundingClientRect().height

      positionX = e.clientX
      positionY = e.clientY
      topOffset = overEl.getBoundingClientRect().top

      if (outline === 'list') {
        mouseBeyond = isMouseBeyond(positionY, topOffset, height, moveInMiddle)
      }

      if (outline === 'grid') {
        mouseBeyond = isMouseBeyond(positionX, overEl.getBoundingClientRect().left, overEl.getBoundingClientRect().width, moveInMiddle)
      }

      if (indexDragged !== indexFrom && mouseBeyond) {
        items = swapArrayElements(items, indexFrom, indexDragged)
        this.props.updateState({
          items: items, draggingIndex: indexDragged,
        })
      }
    }

    isDragging = () => {
      const { draggingIndex, sortId } = this.props
      return draggingIndex === sortId
    }

    render() {
      let newProps = Object.assign({}, this.props)
      delete newProps.updateState
      delete newProps.draggingIndex
      const { sortId, ...props } = newProps
      return (
        <Component
          draggable
          onDragOver={this.dragOver}
          onDragStart={this.sortStart}
          onDragEnd={this.sortEnd}
          onTouchStart={this.sortStart}
          onTouchMove={this.dragOver}
          onTouchEnd={this.sortEnd}
          data-id={sortId}
          {...props}
        />
      )
    }
  }
  return Sortable
}

// Sortable.propTypes = {
//   items: PropTypes.array.isRequired,
//   updateState: PropTypes.func.isRequired,
//   sortId: PropTypes.number,
//   outline: PropTypes.string.isRequired, // list | grid
//   draggingIndex: PropTypes.any,
// }

// Sortable.defaultProps = {
//   moveInMiddle: false,
// }
