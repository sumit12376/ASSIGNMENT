import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React from 'react';
import VehicleMap from './components/VehicleMap';
import ControlPanel from './components/ControlPanel';
import useVehicleTracking from './hooks/useVehicleTracking';

function App() {
  const {
    isPlaying,
    position,
    currentIndex,
    route,
    traveledPath,
    fullRoute,
    elapsedTime,
    speed,
    play,
    pause,
    reset,
    changeSpeed,
  } = useVehicleTracking();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Movement Tracker</h1>
          <p className="text-gray-600 mt-1">Real-time vehicle tracking simulation</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4 h-[600px]">
              <VehicleMap
                position={position}
                traveledPath={traveledPath}
                fullRoute={fullRoute}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <ControlPanel
              isPlaying={isPlaying}
              position={position}
              currentIndex={currentIndex}
              totalPoints={route.length}
              elapsedTime={elapsedTime}
              speed={speed}
              onPlay={play}
              onPause={pause}
              onReset={reset}
              onSpeedChange={changeSpeed}
            />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">Live Tracking</div>
              <div className="text-sm text-gray-600">Real-time simulation</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Route Display</div>
              <div className="text-sm text-gray-600">Complete path visualization</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Speed Calculation</div>
              <div className="text-sm text-gray-600">Dynamic speed metrics</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Responsive Design</div>
              <div className="text-sm text-gray-600">Mobile & desktop ready</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App
