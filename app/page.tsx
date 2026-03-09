'use client';

import { useState } from 'react';
import Story from '@/components/Story/Story';
import Intro from '@/components/Book/intro/Intro';
import CursorFollower from '@/components/CursorFollower/CursorFollower';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      <CursorFollower />
      {showIntro ? (
        <Intro onComplete={() => setShowIntro(false)} />
      ) : (
        <Story />
      )}
    </>
  );
}
