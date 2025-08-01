import React, { useRef, useEffect, useState } from 'react';

const WIDTH = 800;
const HEIGHT = 600;
const PLAYER_SIZE = 50;
const MAX_SPEED = 7;
const BG_COLOR = '#1f1f1f';
const PLAYER_COLOR = '#0078fa';
const BULLET_COLOR = 'white';
const WARNING_COLOR = 'red';

const BlockDodge = () => {
  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const player = useRef({ x: 400, y: 300, vx: 0, vy: 0, ax: 0, ay: 0 });
  const bullets = useRef([]);
  const bulletSpeed = useRef(3.6);
  const levelTimer = useRef(0);
  const keys = useRef({});
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const downHandler = (e) => {
      keys.current[e.key] = true;
    };
    const upHandler = (e) => {
      keys.current[e.key] = false;
    };
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  useEffect(() => {
    if (!started && countdown > 0) {
      const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(interval);
    }
    if (countdown === 0 && !started) {
      setStarted(true);
      lastTime.current = Date.now();
      requestAnimationFrame(gameLoop);
    }
  }, [countdown, started]);

  const gameLoop = () => {
    const now = Date.now();
    const dt = (now - lastTime.current) / 1000;
    lastTime.current = now;
    update(dt);
    draw();
    if (!gameOver) requestAnimationFrame(gameLoop);
  };

  const update = (dt) => {
    const p = player.current;

    // Acceleration input
    p.ax = keys.current['a'] ? -0.2 : keys.current['d'] ? 0.2 : 0;
    p.ay = keys.current['w'] ? -0.2 : keys.current['s'] ? 0.2 : 0;

    // Apply acceleration and friction
    p.vx += p.ax;
    p.vy += p.ay;
    if (p.ax === 0) p.vx *= 0.92;
    if (p.ay === 0) p.vy *= 0.92;

    // Clamp speed
    p.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vx));
    p.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vy));

    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Bounds check
    if (p.x < 0) { p.x = 0; p.vx *= -0.8; }
    if (p.x > WIDTH - PLAYER_SIZE) { p.x = WIDTH - PLAYER_SIZE; p.vx *= -0.8; }
    if (p.y < 0) { p.y = 0; p.vy *= -0.8; }
    if (p.y > HEIGHT - PLAYER_SIZE) { p.y = HEIGHT - PLAYER_SIZE; p.vy *= -0.8; }

    // Level progression
    levelTimer.current += dt;
    bulletSpeed.current = Math.min(14, bulletSpeed.current + 0.001);

    // Spawn bullets
    if (Math.random() < 0.02) {
      const bulletY = Math.random() * (HEIGHT - 20);
      bullets.current.push({ x: -40, y: bulletY, vx: bulletSpeed.current, vy: 0 });
    }

    // Update bullets
    bullets.current.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;
    });
    bullets.current = bullets.current.filter((b) => b.x < WIDTH + 100);

    // Collision
    bullets.current.forEach((b, i) => {
      const hit = b.x < p.x + PLAYER_SIZE && b.x + 40 > p.x &&
                  b.y < p.y + PLAYER_SIZE && b.y + 20 > p.y;
      if (hit) {
        bullets.current.splice(i, 1);
        setLives((l) => l - 1);
        setScore((s) => s + 1);
      }
    });

    if (lives <= 0) setGameOver(true);
  };

  const draw = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw player
    const p = player.current;
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(p.x, p.y, PLAYER_SIZE, PLAYER_SIZE);

    // Draw bullets
    ctx.fillStyle = BULLET_COLOR;
    bullets.current.forEach((b) => {
      ctx.fillRect(b.x, b.y, 40, 20);
    });

    // UI
    ctx.fillStyle = 'red';
    ctx.font = '20px Arial';
    ctx.fillText(`Lives: ${lives}`, 20, 30);
    ctx.fillText(`Score: ${score}`, 20, 60);

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = 'white';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2);
      ctx.fillText(`Final Score: ${score}`, WIDTH / 2, HEIGHT / 2 + 60);
    }

    if (!started) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = 'white';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Starting in ${countdown}`, WIDTH / 2, HEIGHT / 2);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      style={{ border: '2px solid black' }}
    />
  );
};

export default BlockDodge;
