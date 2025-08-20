'use client';

import type { Map, Station, UserRunProgress } from '@/types';
import { motion } from 'framer-motion';
import { Lock, MapPin, Play, Trophy, Unlock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MapCanvasProps {
  map: Map;
  userProgress: UserRunProgress | null;
  onStationClick: (station: Station) => void;
}

export default function MapCanvas({ map, userProgress, onStationClick }: MapCanvasProps) {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [characterPosition, setCharacterPosition] = useState({ x: 100, y: 100 });

  // Determine which stations are unlocked
  const getUnlockedStations = (): string[] => {
    if (!userProgress) return [map.stations[0]?.id].filter(Boolean);
    
    const unlocked: string[] = [];
    for (let i = 0; i < map.stations.length; i++) {
      const station = map.stations[i];
      if (i === 0 || !station.isLockedByDefault) {
        unlocked.push(station.id);
      } else {
        // Check if previous station was completed
        const previousStation = map.stations[i - 1];
        if (previousStation && unlocked.includes(previousStation.id)) {
          unlocked.push(station.id);
        }
      }
    }
    return unlocked;
  };

  const unlockedStations = getUnlockedStations();

  // Animate character movement
  useEffect(() => {
    if (userProgress?.currentStationId) {
      const currentStation = map.stations.find(s => s.id === userProgress.currentStationId);
      if (currentStation) {
        setCharacterPosition({
          x: currentStation.positionX,
          y: currentStation.positionY,
        });
      }
    }
  }, [userProgress?.currentStationId, map.stations]);

  const handleStationClick = (station: Station) => {
    if (unlockedStations.includes(station.id)) {
      setSelectedStation(station);
      onStationClick(station);
    }
  };

  const getStationStatus = (station: Station) => {
    if (!unlockedStations.includes(station.id)) {
      return 'locked';
    }
    if (userProgress?.currentStationId === station.id) {
      return 'current';
    }
    return 'unlocked';
  };

  const getStationIcon = (station: Station) => {
    const status = getStationStatus(station);
    
    switch (status) {
      case 'locked':
        return <Lock className="w-6 h-6 text-muted-400" />;
      case 'current':
        return <Play className="w-6 h-6 text-primary-600" />;
      case 'unlocked':
        return <Unlock className="w-6 h-6 text-green-600" />;
      default:
        return <MapPin className="w-6 h-6 text-muted-600" />;
    }
  };

  const getStationClass = (station: Station) => {
    const status = getStationStatus(station);
    
    switch (status) {
      case 'locked':
        return 'opacity-50 cursor-not-allowed';
      case 'current':
        return 'ring-4 ring-primary-300 cursor-pointer';
      case 'unlocked':
        return 'cursor-pointer hover:scale-110';
      default:
        return 'cursor-pointer';
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl border-2 border-muted-200 overflow-hidden">
      {/* Map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-green-100/30" />
      
      {/* South Korea map */}
      <div className="absolute inset-4 flex items-center justify-center">
        <img 
          src="/images/korea_map.webp" 
          alt="South Korea Map" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Stations */}
      {map.stations.map((station, index) => {
        const status = getStationStatus(station);
        const isUnlocked = unlockedStations.includes(station.id);
        
        return (
          <motion.div
            key={station.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            className={`absolute ${getStationClass(station)}`}
            style={{
              left: `${station.positionX}px`,
              top: `${station.positionY}px`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => handleStationClick(station)}
            role="button"
            tabIndex={isUnlocked ? 0 : -1}
            aria-label={`${station.name} station - ${status}`}
          >
            {/* Station marker */}
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg border-4 border-muted-200 flex items-center justify-center">
                {getStationIcon(station)}
              </div>
              
              {/* Station number */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </div>
            </div>

            {/* Station label */}
            <div className="mt-2 text-center">
              <h3 className="text-sm font-semibold text-muted-800 whitespace-nowrap">
                {station.name}
              </h3>
              <p className="text-xs text-muted-600 max-w-24">
                {station.description}
              </p>
            </div>

            {/* Connection line to next station */}
            {index < map.stations.length - 1 && (
              <svg
                className="absolute top-8 left-8 w-full h-full pointer-events-none"
                style={{
                  width: `${Math.abs(map.stations[index + 1].positionX - station.positionX)}px`,
                  height: `${Math.abs(map.stations[index + 1].positionY - station.positionY)}px`,
                }}
              >
                <line
                  x1="0"
                  y1="0"
                  x2={map.stations[index + 1].positionX - station.positionX}
                  y2={map.stations[index + 1].positionY - station.positionY}
                  stroke={isUnlocked ? "#10B981" : "#E5E7EB"}
                  strokeWidth="3"
                  strokeDasharray={isUnlocked ? "none" : "5,5"}
                />
              </svg>
            )}
          </motion.div>
        );
      })}

      {/* Character sprites */}
      <motion.div
        className="absolute w-16 h-16 pointer-events-none z-10"
        style={{
          left: characterPosition.x,
          top: characterPosition.y,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          x: characterPosition.x,
          y: characterPosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      >
        {/* Lead character - Korean Girl */}
        <div className="relative">
          <img
            src="/images/korean_main_character_girl.jpg"
            alt="Korean Main Character Girl"
            className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-white"
          />
          {/* Character indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
        </div>
        
        {/* Buddy character - Korean Boy */}
        <motion.div 
          className="absolute -bottom-2 -right-2"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img
            src="/images/korean_main_character_boy.jpg"
            alt="Korean Main Character Boy"
            className="w-10 h-10 rounded-full object-cover shadow-lg border-2 border-white"
          />
          {/* Character indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Character movement path */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-5"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* Path for characters to follow */}
        <path
          d="M 200 150 Q 300 200 400 300 T 150 450"
          stroke="#10B981"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
          opacity="0.6"
        />
      </svg>

      {/* Progress indicator */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-sm font-semibold text-muted-800">
              Progress: {unlockedStations.length}/{map.stations.length}
            </p>
            <p className="text-xs text-muted-600">
              {unlockedStations.length === map.stations.length ? 'All stations unlocked!' : 'Keep learning to unlock more!'}
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <p className="text-sm text-muted-600 text-center">
          Click on unlocked stations to start learning. Complete quizzes to unlock new areas!
        </p>
      </div>

      {/* Selected station info */}
      {selectedStation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-lg max-w-xs"
        >
          <h3 className="font-semibold text-muted-800 mb-2">
            {selectedStation.name}
          </h3>
          <p className="text-sm text-muted-600 mb-3">
            {selectedStation.description}
          </p>
          <button
            onClick={() => onStationClick(selectedStation)}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Learning
          </button>
        </motion.div>
      )}
    </div>
  );
}
