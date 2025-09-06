import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
}

interface ParticleBackgroundProps {
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.width || !dimensions.height) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize particles
    const particleCount = Math.floor((dimensions.width * dimensions.height) / 8000);
    particlesRef.current = [];

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        trail: []
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((particle, i) => {
        // Mouse interaction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance * 0.02;
          particle.vx += dx / distance * force;
          particle.vy += dy / distance * force;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Add friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Boundary conditions
        if (particle.x < 0 || particle.x > dimensions.width) particle.vx *= -0.5;
        if (particle.y < 0 || particle.y > dimensions.height) particle.vy *= -0.5;
        particle.x = Math.max(0, Math.min(dimensions.width, particle.x));
        particle.y = Math.max(0, Math.min(dimensions.height, particle.y));

        // Update trail
        particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity });
        if (particle.trail.length > 20) {
          particle.trail.shift();
        }

        // Draw trail
        particle.trail.forEach((point, index) => {
          const trailOpacity = (index / particle.trail.length) * point.opacity * 0.3;
          ctx.fillStyle = `rgba(59, 130, 246, ${trailOpacity})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw particle with safety checks
        if (isFinite(particle.x) && isFinite(particle.y) && isFinite(particle.size) && isFinite(particle.opacity)) {
          const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2);
          gradient.addColorStop(0, `rgba(59, 130, 246, ${particle.opacity})`);
          gradient.addColorStop(0.5, `rgba(147, 197, 253, ${particle.opacity * 0.6})`);
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw connections
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxConnectionDistance = 100;

          if (distance < maxConnectionDistance) {
            const opacity = (1 - distance / maxConnectionDistance) * 0.2;
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y, 
              otherParticle.x, otherParticle.y
            );
            gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(147, 197, 253, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      // Draw mouse glow effect
      if (mouse.x && mouse.y) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(0.5, 'rgba(147, 197, 253, 0.05)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default ParticleBackground;