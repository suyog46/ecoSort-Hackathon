'use client'

import React, { useState, useEffect } from 'react'

const ChargingAnimation = () => {
  const [charge, setCharge] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCharge((prevCharge) => (prevCharge < 100 ? prevCharge + 1 : 0))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-64 h-128 bg-white rounded-3xl border-4 border-gray-300 overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 bg-green-500 transition-all duration-300 ease-in-out"
          style={{ height: `${charge}%` }}
        >
          <div className="absolute inset-0 animate-wave">
            <div className="absolute inset-0 bg-green-400 opacity-30" />
            <div className="absolute inset-0 bg-green-300 opacity-30 translate-y-2" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">{charge}%</span>
        </div>
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-300 rounded-t-lg" />
      </div>
    </div>
  )
}

export default ChargingAnimation

