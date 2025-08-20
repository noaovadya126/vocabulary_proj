'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Globe, BookOpen, Trophy, Users } from 'lucide-react';
import { useGameStore } from '@/lib/store';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentLanguage } = useGameStore();

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLanguageSelect = (languageCode: string) => {
    setCurrentLanguage({
      id: 'ko-kr',
      code: languageCode,
      name: 'Korean',
      rtl: false,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-muted-50">
        <div className="text-center">
          <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-muted-600">Loading VocabQuest...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-muted-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-green-600/10"></div>
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-primary-700 mb-6">
              VocabQuest
            </h1>
            <p className="text-xl md:text-2xl text-muted-600 mb-8 max-w-3xl mx-auto">
              Embark on an interactive journey to learn Korean vocabulary through 
              an adventure across South Korea. Progress through stations, complete 
              quizzes, and unlock new areas with gamified learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/map/ko-KR"
                onClick={() => handleLanguageSelect('ko-KR')}
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Korean Journey
              </Link>
              
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 border-2 border-primary-200"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-muted-800 mb-4">
              Why Choose VocabQuest?
            </h2>
            <p className="text-xl text-muted-600 max-w-2xl mx-auto">
              Our innovative approach combines gamification, visual learning, and 
              interactive experiences to make language learning engaging and effective.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: 'Interactive Maps',
                description: 'Explore South Korea through beautiful, interactive maps with learning stations.',
              },
              {
                icon: BookOpen,
                title: 'Structured Learning',
                description: 'Progress through carefully designed stations, each containing 10 essential words.',
              },
              {
                icon: Trophy,
                title: 'Gamified Progress',
                description: 'Unlock new areas by completing quizzes and achieving 80%+ scores.',
              },
              {
                icon: Users,
                title: 'Child-Friendly',
                description: 'Designed with children in mind, featuring colorful characters and engaging animations.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-muted-50 to-white border border-muted-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-muted-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Selection Section */}
      <section className="py-20 bg-gradient-to-br from-muted-50 to-primary-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-muted-800 mb-4">
              Choose Your Learning Journey
            </h2>
            <p className="text-xl text-muted-600 max-w-2xl mx-auto">
              Start with Korean and unlock more languages as you progress. 
              Each language offers a unique cultural journey.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-muted-200"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-muted-800 mb-4">
                    Korean (한국어)
                  </h3>
                  <p className="text-muted-600 mb-6">
                    Begin your journey with 10 essential Korean words. Learn greetings, 
                    basic phrases, and cultural expressions through an interactive 
                    adventure across South Korea.
                  </p>
                  <ul className="space-y-2 text-muted-600 mb-6">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      10 essential vocabulary words
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Interactive pronunciation audio
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Visual learning with images
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Progress tracking system
                    </li>
                  </ul>
                  
                  <Link
                    href="/map/ko-KR"
                    onClick={() => handleLanguageSelect('ko-KR')}
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Korean Journey
                  </Link>
                </div>
                
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-green-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🇰🇷</div>
                      <div className="text-2xl font-bold text-primary-700 mb-2">한국</div>
                      <div className="text-muted-600">South Korea</div>
                    </div>
                  </div>
                  
                  {/* Coming soon badge */}
                  <div className="absolute -top-2 -right-2 bg-muted-500 text-white text-xs px-2 py-1 rounded-full">
                    Available Now
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Future languages placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <p className="text-muted-500 mb-4">
                More languages coming soon...
              </p>
              <div className="flex justify-center space-x-4">
                <div className="text-center opacity-50">
                  <div className="text-3xl mb-2">🇯🇵</div>
                  <div className="text-sm text-muted-500">Japanese</div>
                </div>
                <div className="text-center opacity-50">
                  <div className="text-3xl mb-2">🇨🇳</div>
                  <div className="text-sm text-muted-500">Chinese</div>
                </div>
                <div className="text-center opacity-50">
                  <div className="text-3xl mb-2">🇪🇸</div>
                  <div className="text-sm text-muted-500">Spanish</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Language Adventure?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who have discovered the joy of 
              interactive language learning with VocabQuest.
            </p>
            
            <Link
              href="/map/ko-KR"
              onClick={() => handleLanguageSelect('ko-KR')}
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Begin Your Journey
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
