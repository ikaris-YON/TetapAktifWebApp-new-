"use client";

import React, { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { Exercise, getRecommendedExercises } from '@/lib/data';
import { PlayCircle, Bell, BellRing, Settings, Edit3, Heart, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  profile: UserProfile;
  onStartWorkout: (exercises: Exercise[]) => void;
  onEditProfile: () => void;
}

export default function Dashboard({ profile, onStartWorkout, onEditProfile }: DashboardProps) {
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  const [checklist, setChecklist] = useState({
    minum: false,
    lantai: false,
    kursi: false,
  });

  const toggleCheck = (key: 'minum' | 'lantai' | 'kursi') => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const recommendedExercises = getRecommendedExercises(
    profile.limitations || ((profile as any).limitation ? [(profile as any).limitation] : []), 
    profile.medicalConditions || ((profile as any).medicalCondition ? [(profile as any).medicalCondition] : [])
  );

  const toggleReminders = () => {
    setRemindersEnabled(!remindersEnabled);
  };

  const getLimitationTexts = () => {
    const lims = profile.limitations || ((profile as any).limitation ? [(profile as any).limitation] : []);
    if (!lims || lims.length === 0 || lims.includes('tidak_ada')) return [];
    return lims.map(l => l === 'nyeri_lutut' ? 'Nyeri Lutut' : 'Nyeri Punggung');
  };

  const getConditionTexts = () => {
    const conds = profile.medicalConditions || ((profile as any).medicalCondition ? [(profile as any).medicalCondition] : []);
    if (!conds || conds.length === 0 || conds.includes('tidak_ada')) return [];
    return conds.map(c => c === 'hipertensi' ? 'Hipertensi' : c === 'artritis' ? 'Artritis' : 'Osteoporosis');
  };

  const limitationTexts = getLimitationTexts();
  const conditionTexts = getConditionTexts();
  const isHealthy = limitationTexts.length === 0 && conditionTexts.length === 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:px-8 md:py-6 lg:h-[100dvh] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-brand-brown/10 gap-6 shrink-0">
        <div className="flex flex-col">
          <span className="text-xs md:text-sm tracking-[0.2em] uppercase opacity-60 font-semibold mb-1">Pendamping Kesehatan Lansia</span>
          <h1 className="editorial-title text-4xl md:text-5xl">Tetap Aktif</h1>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-right hidden md:block">
            <p className="text-sm opacity-60">Selamat Datang,</p>
            <p className="text-xl font-bold">Bapak/Ibu {profile.name || 'Sobat'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onEditProfile}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all shrink-0 glass-card text-gray-500 hover:text-brand-terracotta"
              title="Ubah Profil"
            >
              <Edit3 className="w-6 h-6" />
            </button>
            <button 
              onClick={toggleReminders} 
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shrink-0 ${
                remindersEnabled 
                  ? 'glass-card text-brand-terracotta border-brand-terracotta' 
                  : 'glass-card text-gray-500 hover:text-brand-terracotta'
              }`}
              title="Pengingat Latihan"
            >
              {remindersEnabled ? <BellRing className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* Left Column: Profile, Checklist and Safety Tips */}
        <section className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 lg:overflow-y-auto pr-1 pb-4">
          <div className="glass-card p-6 rounded-3xl relative flex-shrink-0 animate-fade-in">
            <p className="text-sm uppercase tracking-widest opacity-60 mb-4 pr-10">Profil Kesehatan Anda</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-brand-brown/5 px-4 py-2 rounded-full border border-brand-brown/15 text-sm font-bold text-brand-brown">
                Usia: {profile.ageRange}
              </span>
              {limitationTexts.map(text => (
                <span key={text} className="bg-white px-4 py-2 rounded-full border border-brand-terracotta/30 text-sm font-semibold text-brand-brown">
                  {text}
                </span>
              ))}
              {conditionTexts.map(text => (
                <span key={text} className="bg-white px-4 py-2 rounded-full border border-brand-terracotta/30 text-sm font-semibold text-brand-brown">
                  {text}
                </span>
              ))}
              {isHealthy && (
                <span className="bg-white px-4 py-2 rounded-full border border-brand-terracotta/30 text-sm font-semibold text-brand-brown">
                  Kondisi Sehat
                </span>
              )}
            </div>
          </div>

          {/* Daily Checklist Card */}
          <div className="glass-card p-6 rounded-3xl flex flex-col gap-4 relative animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-brand-terracotta fill-brand-terracotta/20 shrink-0" />
              <h3 className="text-lg font-bold text-brand-brown font-serif">Persiapan Mandiri Harian</h3>
            </div>
            
            <p className="text-xs text-gray-650 leading-relaxed">
              Demi keselamatan Bapak & Ibu, mari lengkapi checklist persiapan berikut sebelum berlatih:
            </p>

            <div className="space-y-3 mt-1">
              <button
                onClick={() => toggleCheck('minum')}
                className="w-full flex items-start gap-3 p-3 bg-white/50 hover:bg-white rounded-2xl border border-brand-brown/10 text-left transition-all active:scale-98 cursor-pointer"
              >
                <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors shrink-0 ${checklist.minum ? 'bg-brand-terracotta border-brand-terracotta text-white' : 'border-brand-brown/20 bg-white'}`}>
                  {checklist.minum && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-brown">Air Minum Siap 💧</p>
                  <p className="text-[11px] text-brand-brown/70 leading-normal">Menyiapkan air hangat atau air putih di dekat area latihan.</p>
                </div>
              </button>

              <button
                onClick={() => toggleCheck('lantai')}
                className="w-full flex items-start gap-3 p-3 bg-white/50 hover:bg-white rounded-2xl border border-brand-brown/10 text-left transition-all active:scale-98 cursor-pointer"
              >
                <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors shrink-0 ${checklist.lantai ? 'bg-brand-terracotta border-brand-terracotta text-white' : 'border-brand-brown/20 bg-white'}`}>
                  {checklist.lantai && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-brown">Lantai Aman 🏡</p>
                  <p className="text-[11px] text-brand-brown/70 leading-normal">Lantai kering, bersih, dan bebas dari rintangan atau kabel.</p>
                </div>
              </button>

              <button
                onClick={() => toggleCheck('kursi')}
                className="w-full flex items-start gap-3 p-3 bg-white/50 hover:bg-white rounded-2xl border border-brand-brown/10 text-left transition-all active:scale-98 cursor-pointer"
              >
                <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors shrink-0 ${checklist.kursi ? 'bg-brand-terracotta border-brand-terracotta text-white' : 'border-brand-brown/20 bg-white'}`}>
                  {checklist.kursi && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-brown">Kursi Stabil Siap 🪑</p>
                  <p className="text-[11px] text-brand-brown/70 leading-normal">Gunakan kursi kokoh tanpa roda jika latihan butuh bantuan.</p>
                </div>
              </button>
            </div>

            {checklist.minum && checklist.lantai && checklist.kursi && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-150/60 border border-green-200 rounded-2xl text-center"
              >
                <p className="text-xs font-bold text-green-800 flex items-center justify-center gap-1.5 leading-relaxed">
                  <Sparkles className="w-4 h-4 text-green-700 shrink-0" />
                  Bagus sekali! Bapak/Ibu sudah siap berlatih dengan aman.
                </p>
              </motion.div>
            )}
          </div>

          {/* Physiotherapist Safety Card */}
          <div className="glass-card p-6 rounded-3xl flex flex-col gap-3 relative animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-brand-terracotta shrink-0" />
              <h3 className="text-lg font-bold text-brand-brown font-serif">Saran Fisioterapis</h3>
            </div>
            
            <div className="space-y-3.5 text-xs leading-relaxed text-brand-brown/90">
              <div className="flex gap-2">
                <span className="text-sm shrink-0">💨</span>
                <p className="text-gray-700">
                  <strong className="text-brand-brown">Atur Napas:</strong> Tarik napas perlahan melalui hidung, hembuskan lembut lewat mulut. Jangan menahan napas.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="text-sm shrink-0">🛑</span>
                <p className="text-gray-700">
                  <strong className="text-brand-brown">Dengarkan Tubuh:</strong> Segera berhenti jika dada terasa sakit, pusing, atau persendian terasa nyeri tajam.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="text-sm shrink-0">👣</span>
                <p className="text-gray-700">
                  <strong className="text-brand-brown">Alas Kaki:</strong> Pakailah lantai beralas karet anti-slip atau bertelanjang kaki demi kestabilan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Workouts */}
        <section className="flex-1 w-full flex flex-col gap-4 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-2xl md:text-3xl font-bold editorial-title">Rekomendasi Latihan Hari Ini</h2>
          </div>
          
          {recommendedExercises.length === 0 ? (
            <div className="p-8 glass-card rounded-3xl text-center shrink-0">
              <p className="text-xl opacity-60">Belum ada latihan yang cocok. Mohon hubungi dokter untuk saran latihan fisik.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 flex-1 min-h-0">
              <div className="glass-card rounded-3xl p-4 md:p-6 overflow-y-auto min-h-0">
                <div className="divide-y divide-brand-brown/10">
                  {recommendedExercises.map((ex, index) => (
                    <div key={ex.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between transition-colors">
                      <div className="flex items-center space-x-4 md:space-x-6">
                        <div className="w-12 h-12 rounded-full border-2 border-brand-terracotta/30 flex items-center justify-center font-bold text-xl text-brand-terracotta shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-brand-brown">{ex.name}</h3>
                          <p className="text-sm opacity-60">{ex.defaultSets} Set &times; {ex.defaultReps} Repetisi</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onStartWorkout(recommendedExercises)}
                className="w-full bg-brand-terracotta text-white py-5 md:py-6 rounded-2xl text-xl md:text-2xl font-bold shadow-lg shadow-brand-terracotta/20 flex items-center justify-center hover:bg-brand-terracotta-dark transition-colors shrink-0"
              >
                <PlayCircle className="w-8 h-8 mr-4" />
                Mulai Latihan Sekarang
              </button>
            </div>
          )}
        </section>
      </div>

    </div>
  );
}
