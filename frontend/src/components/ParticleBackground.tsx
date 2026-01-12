import { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Particles disabled for performance

  return <div ref={containerRef} className="particles-bg" />;
};

export default ParticleBackground;
