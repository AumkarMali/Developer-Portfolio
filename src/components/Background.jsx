import React, { useEffect, useRef } from 'react';

const Background = ({ children }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef();

  class Particle {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.velocity = {
        x: (Math.random() - 0.5) , // Reduced speed
        y: (Math.random() - 0.5)   // Reduced speed
      };
      this.radius = 2;
    }

    update() {
      if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
        this.velocity.x = -this.velocity.x;
      }
      if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
        this.velocity.y = -this.velocity.y;
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particleCount = 40; // Reduced number of particles

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () => new Particle(canvas));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        particle.update();

        // Draw the glow
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, 15);
        gradient.addColorStop(0, 'rgba(255, 69, 0, 0.1)'); // Reduced opacity
        gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Draw the particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 69, 0, 0.3)'; // Reduced opacity
        ctx.fill();

        // Draw connecting lines
        particlesRef.current.forEach(otherParticle => {
          const distance = Math.hypot(particle.x - otherParticle.x, particle.y - otherParticle.y);
          if (distance < 100) { // Reduced connection distance
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const alpha = 1 - (distance / 100);
            ctx.strokeStyle = `rgba(255, 69, 0, ${alpha * 0.1})`; // Reduced opacity
            ctx.stroke();
          }
        });
      });

      // Draw triangles between nearby particles (fewer triangles)
      for (let i = 0; i < particlesRef.current.length - 2; i += 2) { // Increased step
        const p1 = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length - 1; j += 2) { // Increased step
          const p2 = particlesRef.current[j];
          const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (d1 < 100) { // Reduced triangle formation distance
            for (let k = j + 1; k < particlesRef.current.length; k += 2) { // Increased step
              const p3 = particlesRef.current[k];
              const d2 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
              const d3 = Math.hypot(p1.x - p3.x, p1.y - p3.y);
              if (d2 < 100 && d3 < 100) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.closePath();
                ctx.strokeStyle = 'rgba(255, 69, 0, 0.1)'; // Reduced opacity
                ctx.stroke();
              }
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Update canvas height when content changes
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }}
      />
      {children}
    </div>
  );
};

export default Background;