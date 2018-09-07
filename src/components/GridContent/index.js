import React, { PureComponent } from 'react'
import styles from './index.less'

class GridContent extends PureComponent {
  render() {
    let className = `${styles.main}`
    return <div className={className}>{this.props.children}</div>
  }
}

export default GridContent
