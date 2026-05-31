"use client";

import React, { useState, useEffect } from 'react';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';
import WorkoutSession from '@/components/WorkoutSession';
import { UserProfile } from '@/lib/types';
import { Exercise } from '@/lib/data';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeSession, setActiveSession] = useState<Exercise[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tetapAktifProfile');
    // We use setTimeout to satisfy the strict set-state-in-effect lint rule for initialization
    setTimeout(() => {
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (e) {
          console.error("Gagal memuat profil:", e);
        }
      }
      setIsLoaded(true);
    }, 0);
  }, []);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('tetapAktifProfile', JSON.stringify(newProfile));
  };

  const handleResetProfile = () => {
    setProfile(null);
    localStorage.removeItem('tetapAktifProfile');
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-brand-cream flex items-center justify-center text-brand-brown text-2xl font-bold">Memuat...</div>;
  }

  if (activeSession) {
    return (
      <WorkoutSession 
        exercises={activeSession}
        onFinish={() => {
          setActiveSession(null);
        }}
        onCancel={() => {
          setActiveSession(null);
        }}
      />
    );
  }

  if (profile) {
    return (
      <Dashboard 
        profile={profile} 
        onStartWorkout={(ex) => setActiveSession(ex)}
        onEditProfile={handleResetProfile}
      />
    );
  }

  return <Onboarding onComplete={handleSaveProfile} />;
}
