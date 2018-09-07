/**
 * Created by huangchao on 17/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
// import { Sortable } from 'react-sortable';
import { SortableComposition as Sortable } from './SortableComposition'

class Item extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  }

  render() {
    return (
      <div {...this.props} className="grid-item">
        {this.props.children}
      </div>
    )
  }
}

export default Sortable(Item)
