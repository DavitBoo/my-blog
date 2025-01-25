import React from 'react'
import { AiOutlineLoading } from "react-icons/ai";

const Loader = ({ message = "Cargando..." }) => {
  return (
    <div className='loaderContainer'>
        <AiOutlineLoading className="loader" />
        <p>{message}</p>
    </div>
  )
}

export default Loader