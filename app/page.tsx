'use client';

import { useState } from 'react';
import Story from '@/components/Story/Story';
import Intro from '@/components/Book/intro/Intro';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return showIntro ? (
    <Intro onComplete={() => setShowIntro(false)} />
  ) : (
    <Story />
  );
}
