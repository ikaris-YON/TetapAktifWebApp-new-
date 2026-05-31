"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, PhysicalLimitation, MedicalCondition } from '@/lib/types';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const OptionButton = ({ 
  selected, 
  onClick, 
  children 
}: { 
  selected: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-6 rounded-2xl text-xl font-medium transition-all duration-200 border-2 ${
      selected 
        ? 'bg-brand-terracotta text-white border-brand-terracotta shadow-md' 
        : 'bg-white text-brand-brown border-transparent hover:border-brand-terracotta/30 shadow-sm'
    }`}
  >
    {children}
  </button>
);

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    limitations: [],
    medicalConditions: []
  });

  const ageOptions = ['40-49 Tahun', '50-59 Tahun', '60-69 Tahun', '70+ Tahun'];
  
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else if (
      profile.name &&
      profile.ageRange && 
      profile.limitations && profile.limitations.length > 0 && 
      profile.medicalConditions && profile.medicalConditions.length > 0
    ) {
      onComplete(profile as UserProfile);
    }
  };

  const toggleLimitation = (lim: PhysicalLimitation) => {
    const current = profile.limitations || [];
    if (lim === 'tidak_ada') {
      setProfile({ ...profile, limitations: ['tidak_ada'] });
      return;
    }
    // If not "tidak_ada", toggle it and remove "tidak_ada" if present
    const withoutTidakAda = current.filter(l => l !== 'tidak_ada');
    if (withoutTidakAda.includes(lim)) {
      setProfile({ ...profile, limitations: withoutTidakAda.filter(l => l !== lim) });
    } else {
      setProfile({ ...profile, limitations: [...withoutTidakAda, lim] });
    }
  };

  const toggleCondition = (cond: MedicalCondition) => {
    const current = profile.medicalConditions || [];
    if (cond === 'tidak_ada') {
      setProfile({ ...profile, medicalConditions: ['tidak_ada'] });
      return;
    }
    // If not "tidak_ada", toggle it and remove "tidak_ada" if present
    const withoutTidakAda = current.filter(c => c !== 'tidak_ada');
    if (withoutTidakAda.includes(cond)) {
      setProfile({ ...profile, medicalConditions: withoutTidakAda.filter(c => c !== cond) });
    } else {
      setProfile({ ...profile, medicalConditions: [...withoutTidakAda, cond] });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-12 min-h-[80vh] flex flex-col justify-center animate-fade-in">
      
      {step > 1 && (
        <button 
          onClick={handleBack}
          className="flex items-center text-brand-terracotta mb-8 text-lg font-medium hover:opacity-80 transition-opacity self-start cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Kembali
        </button>
      )}

      <div className="w-full bg-orange-100 rounded-full h-2 mb-12 overflow-hidden">
        <motion.div 
          className="bg-brand-terracotta h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl editorial-title mb-4">Siapa nama panggilan Anda?</h1>
            <p className="text-lg text-brand-brown/70 leading-relaxed">
              Selamat datang! Mari saling mengenal terlebih dahulu agar pendampingan olahraga terasa lebih akrab dan hangat.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Contoh: Budi, Sri, Ani..."
                className="w-full p-6 p-y-4 rounded-2xl text-2xl font-bold border-2 border-brand-brown/20 focus:border-brand-terracotta bg-white text-brand-brown focus:outline-none placeholder:text-brand-brown/30 shadow-sm transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && profile.name && profile.name.trim().length >= 2) {
                    handleNext();
                  }
                }}
              />
            </div>
            
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: (profile.name && profile.name.trim().length >= 2) ? 1 : 0, y: (profile.name && profile.name.trim().length >= 2) ? 0 : 10 }}
              onClick={handleNext}
              disabled={!profile.name || profile.name.trim().length < 2}
              className="w-full bg-brand-terracotta text-white p-6 rounded-2xl text-xl font-bold shadow-lg flex items-center justify-center hover:bg-brand-terracotta-dark transition-colors disabled:opacity-50 mt-12 cursor-pointer"
            >
              Lanjut
              <ChevronRight className="w-6 h-6 ml-2" />
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl editorial-title mb-8">Berapa usia Bapak/Ibu {profile.name} saat ini?</h1>
            <div className="space-y-4">
              {ageOptions.map(opt => (
                <OptionButton 
                  key={opt}
                  selected={profile.ageRange === opt}
                  onClick={() => { setProfile({ ...profile, ageRange: opt }); setTimeout(handleNext, 300); }}
                >
                  {opt}
                </OptionButton>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl editorial-title mb-8">Apakah Bapak/Ibu {profile.name} memiliki keluhan nyeri sendi?</h1>
            <div className="space-y-4">
              <OptionButton 
                selected={profile.limitations?.includes('nyeri_lutut') || false}
                onClick={() => toggleLimitation('nyeri_lutut')}
              >
                Ya, Nyeri Lutut
              </OptionButton>
              <OptionButton 
                selected={profile.limitations?.includes('nyeri_punggung') || false}
                onClick={() => toggleLimitation('nyeri_punggung')}
              >
                Ya, Nyeri Punggung
              </OptionButton>
              <OptionButton 
                selected={profile.limitations?.includes('tidak_ada') || false}
                onClick={() => toggleLimitation('tidak_ada')}
              >
                Tidak Ada / Sehat Walafiat
              </OptionButton>
            </div>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: (profile.limitations && profile.limitations.length > 0) ? 1 : 0, y: (profile.limitations && profile.limitations.length > 0) ? 0 : 10 }}
              onClick={handleNext}
              disabled={!profile.limitations || profile.limitations.length === 0}
              className="w-full bg-brand-terracotta text-white p-6 rounded-2xl text-xl font-bold shadow-lg flex items-center justify-center hover:bg-brand-terracotta-dark transition-colors disabled:opacity-50 mt-12 cursor-pointer"
            >
              Lanjut
              <ChevronRight className="w-6 h-6 ml-2" />
            </motion.button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl editorial-title mb-8">Apakah ada kondisi medis penyerta, Bapak/Ibu {profile.name}?</h1>
            <div className="space-y-4">
              <OptionButton 
                selected={profile.medicalConditions?.includes('hipertensi') || false}
                onClick={() => toggleCondition('hipertensi')}
              >
                Hipertensi (Tekanan Darah Tinggi)
              </OptionButton>
              <OptionButton 
                selected={profile.medicalConditions?.includes('artritis') || false}
                onClick={() => toggleCondition('artritis')}
              >
                Artritis (Radang Sendi)
              </OptionButton>
              <OptionButton 
                selected={profile.medicalConditions?.includes('osteoporosis') || false}
                onClick={() => toggleCondition('osteoporosis')}
              >
                Osteoporosis (Kepadatan Tulang Menurun)
              </OptionButton>
              <OptionButton 
                selected={profile.medicalConditions?.includes('tidak_ada') || false}
                onClick={() => toggleCondition('tidak_ada')}
              >
                Tidak Ada
              </OptionButton>
            </div>
            
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: (profile.medicalConditions && profile.medicalConditions.length > 0) ? 1 : 0, y: (profile.medicalConditions && profile.medicalConditions.length > 0) ? 0 : 10 }}
              onClick={handleNext}
              disabled={!profile.medicalConditions || profile.medicalConditions.length === 0}
              className="w-full bg-brand-terracotta text-white p-6 rounded-2xl text-xl font-bold shadow-lg flex items-center justify-center hover:bg-brand-terracotta-dark transition-colors disabled:opacity-50 mt-12 cursor-pointer"
            >
              Mulai Program Latihan
              <ChevronRight className="w-6 h-6 ml-2" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
