'use client';

import MapCanvas from '@/components/game/MapCanvas';
import { useGameStore } from '@/lib/store';
import type { Map, Station } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Trophy, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Mock data for demonstration
const mockMap: Map = {
  id: 'korea-map',
  languageId: 'ko-kr',
  name: 'South Korea',
  svgPathUrl: '/maps/south-korea.svg',
  orderIndex: 1,
  stations: [
    {
      id: 'seoul-station',
      mapId: 'korea-map',
      name: 'Seoul Station',
      description: 'Learn essential greetings and basic phrases',
      orderIndex: 1,
      isLockedByDefault: false,
      positionX: 200,
      positionY: 150,
      words: [],
      attempts: [],
    },
    {
      id: 'busan-station',
      mapId: 'korea-map',
      name: 'Busan Station',
      description: 'Master common expressions and useful phrases',
      orderIndex: 2,
      isLockedByDefault: true,
      positionX: 400,
      positionY: 300,
      words: [],
      attempts: [],
    },
    {
      id: 'jeju-station',
      mapId: 'korea-map',
      name: 'Jeju Station',
      description: 'Explore cultural expressions and advanced vocabulary',
      orderIndex: 3,
      isLockedByDefault: true,
      positionX: 150,
      positionY: 450,
      words: [],
      attempts: [],
    },
  ],
};

export default function MapPage() {
  const params = useParams();
  const router = useRouter();
  const { currentLanguage, setCurrentLanguage, setCurrentMap, setCurrentStation } = useGameStore();
  const [map, setMap] = useState<Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set current language if not set
    if (!currentLanguage && params.language === 'ko-KR') {
      setCurrentLanguage({
        id: 'ko-kr',
        code: 'ko-KR',
        name: 'Korean',
        rtl: false,
      });
    }

    // Load map data (in real app, this would be an API call)
    const loadMap = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMap(mockMap);
        setCurrentMap(mockMap);
      } catch (error) {
        console.error('Failed to load map:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMap();
  }, [params.language, currentLanguage, setCurrentLanguage, setCurrentMap]);

  const handleStationClick = (station: Station) => {
    setCurrentStation(station);
    router.push(`/station/${station.id}`);
  };

  const handleBackClick = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-muted-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-muted-600">Loading Korean Journey...</h2>
        </div>
      </div>
    );
  }

  if (!map) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-muted-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-600">Failed to load map</h2>
          <button
            onClick={handleBackClick}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-muted-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-muted-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackClick}
                className="p-2 rounded-lg hover:bg-muted-100 transition-colors"
                aria-label="Go back to home"
              >
                <ArrowLeft className="w-5 h-5 text-muted-600" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-muted-800">
                  Korean Learning Journey
                </h1>
                <p className="text-muted-600">
                  Explore South Korea and learn essential vocabulary
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Progress indicator */}
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">1/3</div>
                <div className="text-xs text-muted-500">Stations</div>
              </div>

              {/* Navigation buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push('/profile')}
                  className="p-2 rounded-lg hover:bg-muted-100 transition-colors"
                  aria-label="View profile"
                >
                  <User className="w-5 h-5 text-muted-600" />
                </button>
                
                <button
                  onClick={() => router.push('/progress')}
                  className="p-2 rounded-lg hover:bg-muted-100 transition-colors"
                  aria-label="View progress"
                >
                  <Trophy className="w-5 h-5 text-muted-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Map container */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-muted-800 mb-2">
                🗺️ Your Learning Map
              </h2>
              <p className="text-muted-600">
                Click on unlocked stations to begin learning. Complete quizzes to unlock new areas!
              </p>
            </div>

            <div className="relative">
              <MapCanvas
                map={map}
                userProgress={null}
                onStationClick={handleStationClick}
              />
            </div>
          </div>

          {/* Station information */}
          <div className="grid md:grid-cols-3 gap-6">
            {map.stations.map((station, index) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 border border-muted-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-muted-800">
                      {station.name}
                    </h3>
                    <p className="text-sm text-muted-500">
                      Station {index + 1}
                    </p>
                  </div>
                </div>

                <p className="text-muted-600 mb-4">
                  {station.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-500">Words to learn:</span>
                    <span className="font-semibold text-muted-700">10</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-500">Status:</span>
                    <span className={`font-semibold ${
                      index === 0 ? 'text-green-600' : 'text-muted-400'
                    }`}>
                      {index === 0 ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>

                {index === 0 && (
                  <button
                    onClick={() => handleStationClick(station)}
                    className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Learning</span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Learning tips */}
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-green-50 rounded-2xl p-8 border border-primary-100">
            <h3 className="text-2xl font-bold text-muted-800 mb-4">
              💡 Learning Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-muted-800 mb-2">
                  🎯 Start with Seoul Station
                </h4>
                <p className="text-muted-600">
                  Begin your journey with essential greetings and basic phrases. 
                  This station is unlocked and contains 10 fundamental Korean words.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-muted-800 mb-2">
                  🏆 Unlock New Areas
                </h4>
                <p className="text-muted-600">
                  Complete quizzes with 80% or higher to unlock the next station. 
                  Each station builds upon the previous one, creating a progressive learning experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
