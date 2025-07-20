import { useState, useEffect, useCallback } from 'react';
import routeData from '../data/dummy-route.json';

const BASE_ANIMATION_INTERVAL = 1500; // 1.5 seconds

export default function useVehicleTracking() {
  const [state, setState] = useState({
    isPlaying: false,
    currentIndex: 0,
    position: null,
    route: routeData,
    traveledPath: []
  });

  const [elapsedTime, setElapsedTime] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [animationInterval, setAnimationInterval] = useState(BASE_ANIMATION_INTERVAL / 2);

  const calculateSpeed = (current, previous) => {
    const currentTime = new Date(current.timestamp).getTime();
    // "2023-07-18T11:00:00Z"-> 1689678000000 ms


    const previousTime = new Date(previous.timestamp).getTime();
    const timeDiffHours = (currentTime - previousTime) / (1000 * 60 * 60);
//     (1689678000000 - 1689674400000) = 3600000 ms
// 3600000 / (1000 * 60 * 60) = 1 hour


    // Haversine formula
    const lat1 = previous.latitude * Math.PI / 180;//Degrees -> Radians
    const lat2 = current.latitude * Math.PI / 180;
    const deltaLat = (current.latitude - previous.latitude) * Math.PI / 180;
    const deltaLng = (current.longitude - previous.longitude) * Math.PI / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c; // erth radius in km

    return timeDiffHours > 0 ? distance / timeDiffHours : 0;
  };

  const changeSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
    const newInterval = Math.max(BASE_ANIMATION_INTERVAL / newSpeed, 300);
    setAnimationInterval(newInterval);
  }, []);

  const updatePosition = useCallback(() => {
    setState(prevState => {
      if (!prevState.isPlaying || prevState.currentIndex >= prevState.route.length - 1) {

// If playback is not active (isPlaying === false) Or We've reached the last point in the route
        return { ...prevState, isPlaying: false };
      }

      const currentPoint = prevState.route[prevState.currentIndex];
      const previousPoint = prevState.currentIndex > 0 ? prevState.route[prevState.currentIndex - 1] : null;

      const baseSpeed = previousPoint ? calculateSpeed(currentPoint, previousPoint) : 0;
      const calculatedSpeed = baseSpeed * speed;

      const newPosition = {
        lat: currentPoint.latitude,
        lng: currentPoint.longitude,
        timestamp: currentPoint.timestamp,
        speed: calculatedSpeed
      };

      const newTraveledPath = [
        ...prevState.traveledPath,
        [currentPoint.latitude, currentPoint.longitude]
      ];

      return {
        ...prevState,
        currentIndex: prevState.currentIndex + 1,
        position: newPosition,
        traveledPath: newTraveledPath
      };
    });
  }, [speed]);

  useEffect(() => {
    let interval;
    let timeInterval;

    if (state.isPlaying) {
      interval = setInterval(updatePosition, animationInterval);
      timeInterval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeInterval) clearInterval(timeInterval);
    };
  }, [state.isPlaying, updatePosition, animationInterval]);

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentIndex: 0,
      position: null,
      traveledPath: []
    }));
    setElapsedTime(0);
    setSpeed(2);
    setAnimationInterval(BASE_ANIMATION_INTERVAL / 2);
  }, []);

  const fullRoute = state.route.map(point => [point.latitude, point.longitude]);

  return {
    ...state,
    fullRoute,
    elapsedTime,
    speed,
    play,
    pause,
    reset,
    changeSpeed
  };
}
