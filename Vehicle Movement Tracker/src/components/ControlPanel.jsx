import React from 'react';
import { Play, Pause, RotateCcw, MapPin, Clock, Gauge, Timer } from 'lucide-react';

export default function ControlPanel({
  isPlaying,
  position,
  currentIndex,
  totalPoints,
  elapsedTime,
  speed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange
}) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatCoordinate = (value) => {
    return value.toFixed(6);
  };

  const formatElapsedTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSpeedColor = (speed) => {
    if (speed < 20) return 'text-green-600';
    if (speed < 40) return 'text-yellow-600';
    if (speed < 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSpeedLabel = (speed) => {
    if (speed <= 0.5) return 'Very Slow';
    if (speed <= 1) return 'Slow';
    if (speed <= 2) return 'Normal';
    if (speed <= 3) return 'Fast';
    return 'Very Fast';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Vehicle Tracker</h2>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Tracking</span>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Speed Control</h3>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <span className="font-bold text-blue-600">{getSpeedLabel(speed)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="0.2"
            max="4"
            step="0.2"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Very Slow</span>
            <span>Normal</span>
            <span>Very Fast</span>
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          <button
            onClick={() => onSpeedChange(Math.max(0.2, speed - 0.2))}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
          >
            Slower
          </button>
          <button
            onClick={() => onSpeedChange(2)}
            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
          >
            Normal
          </button>
          <button
            onClick={() => onSpeedChange(Math.min(4, speed + 0.2))}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors"
          >
            Faster
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{currentIndex + 1} / {totalPoints}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalPoints) * 100}%` }}
          ></div>
        </div>
      </div>

      {position && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin size={18} className="text-blue-500" />
              <span className="font-medium text-gray-700">Location</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Lat: {formatCoordinate(position.lat)}</div>
              <div>Lng: {formatCoordinate(position.lng)}</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock size={18} className="text-green-500" />
              <span className="font-medium text-gray-700">Time</span>
            </div>
            <div className="text-sm text-gray-600">
              {formatTime(position.timestamp)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Timer size={18} className="text-purple-500" />
              <span className="font-medium text-gray-700">Elapsed</span>
            </div>
            <div className="text-sm text-gray-600">
              {formatElapsedTime(elapsedTime)}
            </div>
          </div>

          {position.speed !== undefined && (
            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2 lg:col-span-3">
              <div className="flex items-center space-x-2 mb-2">
                <Gauge size={18} className="text-orange-500" />
                <span className="font-medium text-gray-700">Speed</span>
              </div>
              <div className={`text-lg font-bold ${getSpeedColor(position.speed)}`}>
                {position.speed.toFixed(1)} km/h
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    position.speed < 20 ? 'bg-green-500' :
                    position.speed < 40 ? 'bg-yellow-500' :
                    position.speed < 60 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((position.speed / 80) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
