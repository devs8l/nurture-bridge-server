import React, { useEffect, useState } from 'react';

const SoundWaveform = () => {
  const [bars, setBars] = useState(Array(5).fill(0));

  useEffect(() => {
    const animate = () => {
      setBars(prev => 
        prev.map(() => Math.random() * 0.7 + 0.3)
      );
    };

    const interval = setInterval(animate, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-[#5FCA89] rounded-full transition-all duration-100 ease-in-out"
          style={{
            height: `${height * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default SoundWaveform;