/**
 * Created by huangchao on 20/12/2017.
 * @param {string} title - this is title description.
 *
 */

import React from 'react'
import { Link } from 'react-router-dom'

const NewTable = (props) => {
  return (
    <Link to={props.url} target="_blank">
      {props.text}
    </Link>
  )
}

export default NewTable
