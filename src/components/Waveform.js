'use client';

import React, { useRef, useEffect } from 'react';

const Waveform = ({ isActive, width = 120, height = 40 }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize audio context and visualizer
  useEffect(() => {
    if (!isActive) {
      // Clean up if not active
      cleanup();
      return;
    }

    // Initialize audio context if not already done
    initializeAudioContext();

    return () => {
      cleanup();
    };
  }, [isActive]);

  const initializeAudioContext = async () => {
    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      
      // Start visualization
      drawVisualizer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // Draw static waveform on error
      drawStaticWaveform();
    }
  };

  const cleanup = () => {
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Disconnect audio nodes
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Draw inactive state
    drawInactiveWaveform();
  };

  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isActive) return; // Stop if component becomes inactive
      
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center line (baseline)
      const centerY = canvas.height / 2;
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();

      // Draw waveform bars
      const barWidth = canvas.width / bufferLength * 2;
      let x = 0;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(0.5, '#60a5fa');
      gradient.addColorStop(1, '#93c5fd');

      ctx.fillStyle = gradient;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * (canvas.height / 2) * 0.8;
        
        // Draw symmetrical bars from center
        ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight);
        ctx.fillRect(x, centerY, barWidth - 1, barHeight);
        
        x += barWidth;
      }
    };

    draw();
  };

  const drawStaticWaveform = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw static waveform pattern
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const frequency = 0.02;
    const amplitude = canvas.height * 0.2;

    for (let x = 0; x < canvas.width; x++) {
      const y = centerY + Math.sin(x * frequency) * amplitude * Math.random() * 0.5;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const drawInactiveWaveform = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw flat line when inactive
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Add small static dots
    ctx.fillStyle = 'rgba(156, 163, 175, 0.3)';
    for (let i = 0; i < 8; i++) {
      const x = (i * canvas.width) / 7;
      ctx.beginPath();
      ctx.arc(x, centerY, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // Draw initial inactive state
  useEffect(() => {
    if (!isActive) {
      drawInactiveWaveform();
    }
  }, [isActive]);

  return (
    <div className={`relative transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      
      {/* Status indicator */}
      <div className="absolute top-1 right-1">
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`} />
      </div>

      {/* Loading indicator when initializing */}
      {isActive && !microphoneRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Waveform;