import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = ({
  preset = "default",
  density = 50,
  speed = 1,
  color = "#00ffff",
  className = "",
  showGeometricShapes = true,
  showNebula = true
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const geometricShapesRef = useRef([]);
  const nebulaRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [gradientOffset, setGradientOffset] = useState(0);

  // Enhanced preset configurations
  const presets = {
    default: {
      particleCount: 50,
      speed: 0.5,
      colors: ["#00ffff", "#ff00ff", "#ffff00"],
      size: { min: 1, max: 3 },
      opacity: { min: 0.3, max: 0.8 },
      connectionDistance: 100
    },
    cyber: {
      particleCount: 80,
      speed: 1,
      colors: ["#00ffff", "#ff0080", "#8000ff", "#ffff00"],
      size: { min: 1, max: 4 },
      opacity: { min: 0.5, max: 1 },
      connectionDistance: 120
    },
    matrix: {
      particleCount: 100,
      speed: 2,
      colors: ["#00ff00", "#00ff00", "#00ff00"],
      size: { min: 1, max: 2 },
      opacity: { min: 0.6, max: 0.9 },
      connectionDistance: 80
    },
    nebula: {
      particleCount: 30,
      speed: 0.2,
      colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"],
      size: { min: 2, max: 8 },
      opacity: { min: 0.1, max: 0.4 },
      connectionDistance: 150
    },
    firefly: {
      particleCount: 25,
      speed: 0.3,
      colors: ["#ffd700", "#ff6347", "#ff1493"],
      size: { min: 1, max: 3 },
      opacity: { min: 0.4, max: 0.9 },
      connectionDistance: 200
    },
    quantum: {
      particleCount: 60,
      speed: 1.5,
      colors: ["#00ffff", "#ffffff", "#ff00ff", "#00ff00"],
      size: { min: 1, max: 5 },
      opacity: { min: 0.3, max: 1 },
      connectionDistance: 100
    },
    aurora: {
      particleCount: 40,
      speed: 0.4,
      colors: ["#00ff88", "#0088ff", "#ff0088", "#88ff00"],
      size: { min: 2, max: 6 },
      opacity: { min: 0.2, max: 0.6 },
      connectionDistance: 180
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize geometric shapes
  useEffect(() => {
    if (showGeometricShapes && dimensions.width > 0) {
      geometricShapesRef.current = Array.from({ length: 8 }, (_, i) => ({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: 20 + Math.random() * 40,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: Math.random() > 0.5 ? 'triangle' : 'square',
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        opacity: 0.1 + Math.random() * 0.2
      }));
    }
  }, [dimensions, showGeometricShapes]);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentPreset = presets[preset] || presets.default;

    // Initialize particles
    particlesRef.current = Array.from({ length: currentPreset.particleCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * currentPreset.speed * speed,
      vy: (Math.random() - 0.5) * currentPreset.speed * speed,
      size: Math.random() * (currentPreset.size.max - currentPreset.size.min) + currentPreset.size.min,
      opacity: Math.random() * (currentPreset.opacity.max - currentPreset.opacity.min) + currentPreset.opacity.min,
      color: currentPreset.colors[Math.floor(Math.random() * currentPreset.colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      trail: [] // For trailing effect
    }));

    // Initialize nebula effect
    if (showNebula) {
      nebulaRef.current = {
        x: dimensions.width / 2,
        y: dimensions.height / 2,
        radius: Math.min(dimensions.width, dimensions.height) * 0.3,
        angle: 0,
        angleSpeed: 0.005,
        opacity: 0.1
      };
    }

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw animated gradient background
      const gradient = ctx.createRadialGradient(
        dimensions.width / 2, dimensions.height / 2, 0,
        dimensions.width / 2, dimensions.height / 2, Math.max(dimensions.width, dimensions.height) / 2
      );

      const time = Date.now() * 0.001;
      const hue1 = (time * 10) % 360;
      const hue2 = (time * 15 + 120) % 360;
      const hue3 = (time * 20 + 240) % 360;

      gradient.addColorStop(0, `hsla(${hue1}, 70%, 20%, 0.1)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 60%, 15%, 0.05)`);
      gradient.addColorStop(1, `hsla(${hue3}, 50%, 10%, 0.02)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw nebula effect
      if (showNebula && nebulaRef.current) {
        const nebula = nebulaRef.current;
        nebula.angle += nebula.angleSpeed;

        const nebulaGradient = ctx.createRadialGradient(
          nebula.x + Math.cos(nebula.angle) * 50,
          nebula.y + Math.sin(nebula.angle) * 50,
          0,
          nebula.x, nebula.y, nebula.radius
        );

        nebulaGradient.addColorStop(0, `hsla(${hue1}, 80%, 50%, ${nebula.opacity})`);
        nebulaGradient.addColorStop(0.7, `hsla(${hue2}, 60%, 30%, ${nebula.opacity * 0.5})`);
        nebulaGradient.addColorStop(1, `hsla(${hue3}, 40%, 20%, 0)`);

        ctx.fillStyle = nebulaGradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw geometric shapes
      if (showGeometricShapes) {
        geometricShapesRef.current.forEach(shape => {
          shape.rotation += shape.rotationSpeed;

          ctx.save();
          ctx.globalAlpha = shape.opacity;
          ctx.translate(shape.x, shape.y);
          ctx.rotate(shape.rotation);
          ctx.strokeStyle = shape.color;
          ctx.lineWidth = 2;

          if (shape.type === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -shape.size / 2);
            ctx.lineTo(-shape.size / 2, shape.size / 2);
            ctx.lineTo(shape.size / 2, shape.size / 2);
            ctx.closePath();
            ctx.stroke();
          } else {
            ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          }

          ctx.restore();
        });
      }

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = dimensions.width;
        if (particle.x > dimensions.width) particle.x = 0;
        if (particle.y < 0) particle.y = dimensions.height;
        if (particle.y > dimensions.height) particle.y = 0;

        // Update pulse
        particle.pulse += particle.pulseSpeed;
        const pulseOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulse));

        // Update trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 10) {
          particle.trail.shift();
        }

        // Draw trail
        if (particle.trail.length > 1) {
          ctx.save();
          ctx.globalAlpha = pulseOpacity * 0.3;
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = pulseOpacity;
        ctx.fillStyle = particle.color;

        // Add glow effect
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        glowGradient.addColorStop(0, particle.color);
        glowGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw core particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < currentPreset.connectionDistance) {
            const connectionOpacity = (currentPreset.connectionDistance - distance) / currentPreset.connectionDistance * 0.2;

            ctx.save();
            ctx.globalAlpha = connectionOpacity;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, preset, density, speed, color, showGeometricShapes, showNebula]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
};

export default ParticleBackground;
