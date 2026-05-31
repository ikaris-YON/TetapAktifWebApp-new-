"use client";

import React, { useState, useEffect } from 'react';
import { Exercise } from '@/lib/data';
import { motion } from 'motion/react';
import { Play, Pause, X, CheckCircle2, ChevronLeft, ChevronRight, Plus, Minus, Volume2, VolumeX } from 'lucide-react';

interface WorkoutSessionProps {
  exercises: Exercise[];
  onFinish: () => void;
  onCancel: () => void;
}

export default function WorkoutSession({ exercises, onFinish, onCancel }: WorkoutSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentReps, setCurrentReps] = useState(exercises[0]?.defaultReps || 10);
  
  // Timer state
  const [timerTime, setTimerTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    setVideoFailed(false);
  }, [currentIndex]);

  const currentExercise = exercises[currentIndex];
  
  const resetExerciseState = (index: number) => {
    setCurrentSet(1);
    setCurrentReps(exercises[index]?.defaultReps || 10);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetExerciseState(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const handlePrevExercise = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetExerciseState(currentIndex - 1);
    }
  };

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  
  const addRep = () => setCurrentReps(r => r + 1);
  const subRep = () => setCurrentReps(r => Math.max(1, r - 1));
  
  // Completing a set
  const onCompleteSet = () => {
    if (currentSet < currentExercise.defaultSets) {
      setCurrentSet(s => s + 1);
    } else {
      handleNextExercise();
    }
  };

  if (!currentExercise) return null;

  return (
    <div className="max-w-7xl mx-auto h-[100dvh] flex flex-col bg-brand-cream overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md z-10 px-6 py-4 flex items-center justify-between border-b border-brand-brown/10 shadow-sm shrink-0">
        <div className="w-14" />
        <div className="text-center md:ml-12">
          <p className="text-sm uppercase tracking-[0.2em] opacity-60 font-semibold mb-1">Latihan Aktif</p>
          <h2 className="text-xl font-bold">{currentIndex + 1} dari {exercises.length}</h2>
        </div>
        <button 
          onClick={onFinish} 
          className="px-4 py-2 md:px-5 md:py-3 bg-green-100 text-green-800 font-bold rounded-2xl hover:bg-green-200 transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2"
          title="Akhiri Sesi Latihan"
        >
          <span className="hidden md:inline">Selesai</span>
          <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        
        {/* Left Column: Video and Info */}
        <section className="flex-1 flex flex-col p-4 md:p-8 lg:border-r border-brand-brown/10 lg:w-1/2 overflow-y-auto min-h-0 bg-black/5">
          {/* Video Player */}
          {(() => {
            const driveMatch = currentExercise.sourceUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
            const driveId = driveMatch ? driveMatch[1] : '';
            const embedUrl = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : '';
            
            return (
              <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-6 lg:mb-8 shrink-0 relative group">
                {!videoFailed ? (
                  <video
                    key={currentExercise.id} // Ensure video reloads on change
                    className="w-full h-full object-cover"
                    src={currentExercise.videoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onError={() => {
                      setVideoFailed(true);
                    }}
                  />
                ) : embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full border-0 absolute inset-0 rounded-3xl"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 bg-brand-brown/80 flex flex-col items-center justify-center p-6 text-center">
                     <p className="text-white font-bold mb-2 md:text-lg">Pratinjau Video Tidak Tersedia</p>
                     <p className="text-white/70 text-sm mb-4">Silakan lihat panduan gerakan langsung di Google Drive.</p>
                     <a 
                       href={currentExercise.sourceUrl} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="px-5 py-2.5 bg-brand-terracotta text-white rounded-xl text-sm font-bold hover:bg-brand-terracotta-dark transition-colors"
                     >
                       Buka di Google Drive
                     </a>
                  </div>
                )}
                
                {/* Mute/Unmute Overlay */}
                {!videoFailed && (
                  <button 
                    onClick={() => setIsMuted(prev => !prev)}
                    className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-2 lg:p-3 rounded-full text-white hover:bg-black/80 transition-colors z-20 shadow-lg"
                    title={isMuted ? "Buka Suara" : "Senyap"}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 lg:w-6 lg:h-6" /> : <Volume2 className="w-5 h-5 lg:w-6 lg:h-6" />}
                  </button>
                )}

                {/* Google Drive Link Icon Accent for quick manual access */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-2 pointer-events-auto">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <a href={currentExercise.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-white/90 hover:underline">
                    Buka Video Google Drive
                  </a>
                </div>
              </div>
            );
          })()}

          {/* Info */}
          <div className="shrink-0 flex-1 flex flex-col justify-center">
             <h1 className="text-3xl md:text-4xl editorial-title text-brand-terracotta mb-2">{currentExercise.name}</h1>
             <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">{currentExercise.description}</p>
             {currentExercise.steps && currentExercise.steps.length > 0 && (
               <div className="space-y-3">
                 <h3 className="font-bold text-lg text-brand-brown">Langkah-langkah:</h3>
                 <ul className="space-y-2">
                   {currentExercise.steps.map((step, idx) => (
                     <li key={idx} className="flex items-start">
                       <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-terracotta/10 text-brand-terracotta text-sm font-bold mr-3 mt-0.5">
                         {idx + 1}
                       </span>
                       <span className="text-gray-800 leading-relaxed text-base">{step}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             )}
          </div>
        </section>

        {/* Right Column: Tracker and Controls */}
        <section className="flex-1 flex flex-col p-4 md:p-8 lg:w-1/2 overflow-y-auto min-h-0">
          <div className="glass-card rounded-3xl shadow-lg shadow-brand-terracotta/5 p-4 md:p-6 lg:p-8 flex-1 flex flex-col min-h-0 justify-between">
             
             {/* Timer */}
            <div className="w-full flex flex-col items-center shrink-0">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.1em] opacity-60">Waktu Latihan</p>
                <div className="tracker-value my-1 md:my-2">
                  {formatTime(timerTime)}
                </div>
              </div>
              
              <div className="flex space-x-4 mt-2">
                <button 
                  onClick={toggleTimer} 
                  className={`px-6 py-2 md:px-8 md:py-3 rounded-2xl font-bold text-white shadow-sm flex items-center active:scale-95 transition-transform text-base md:text-lg ${isTimerRunning ? 'bg-brand-brown' : 'bg-brand-terracotta'}`}
                >
                  {isTimerRunning ? <Pause className="w-5 h-5 md:w-6 md:h-6 mr-2"/> : <Play className="w-5 h-5 md:w-6 md:h-6 mr-2"/>}
                  {isTimerRunning ? 'Jeda' : 'Lanjut'}
                </button>
              </div>
            </div>

            <hr className="border-brand-brown/10 my-4 md:my-6 shrink-0" />

            <h2 className="text-xl md:text-2xl font-bold text-center editorial-title shrink-0 mb-4 md:mb-6">Pencatat Latihan</h2>
             
            <div className="w-full space-y-4 md:space-y-6 shrink-0 flex-1 flex flex-col justify-center">
              {/* Set Info */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 md:gap-4">
                <span className="text-lg md:text-xl font-bold text-center xl:text-left">Set (Target: {currentExercise.defaultSets})</span>
                <div className="flex items-center justify-center gap-4 w-full xl:w-auto">
                  <span className="text-4xl md:text-5xl font-black w-12 md:w-14 text-center">{currentSet.toString().padStart(2, '0')}</span>
                </div>
              </div>

              <hr className="border-brand-brown/10" />

              {/* Rep Counter */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 md:gap-4">
                <span className="text-lg md:text-xl font-bold text-center xl:text-left">Repetisi (Target: {currentExercise.defaultReps})</span>
                <div className="flex items-center justify-center gap-4 w-full xl:w-auto">
                  <button onClick={subRep} className="large-control shrink-0 w-10 h-10 md:w-12 md:h-12">-</button>
                  <span className="text-4xl md:text-5xl font-black w-12 md:w-14 text-center text-brand-terracotta">{currentReps.toString().padStart(2, '0')}</span>
                  <button onClick={addRep} className="large-control shrink-0 w-10 h-10 md:w-12 md:h-12">+</button>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="mt-6 md:mt-8 shrink-0 w-full">
              <button
                onClick={onCompleteSet}
                className={`w-full text-white py-4 md:py-6 rounded-2xl md:rounded-3xl text-xl md:text-2xl font-bold shadow-lg flex items-center justify-center active:scale-95 transition-all ${
                  currentSet < currentExercise.defaultSets 
                    ? 'bg-brand-terracotta shadow-brand-terracotta/20 hover:bg-brand-terracotta-dark' 
                    : 'bg-green-600 shadow-green-600/20 hover:bg-green-700'
                }`}
              >
                <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 mr-3 md:mr-4" />
                {currentSet < currentExercise.defaultSets ? 'Selesai Set Ini' : 'Selesai Latihan Ini'}
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
