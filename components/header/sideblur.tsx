import React, { useState } from "react"

const Sideblur = ({ isOpen }) => {
    
    return (
      <div
        className={`top-0 left-0 w-[100vw] fixed h-full bg-gray-200 bg-opacity-50 backdrop-blur-sm z-10 transition-opacity ease-in-out duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
      </div>
    )
}
  
export default Sideblur
  