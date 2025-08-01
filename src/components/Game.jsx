import React, { useRef, useEffect, useState } from 'react';

const WIDTH = 800;
const HEIGHT = 600;
const PLAYER_SIZE = 50;
const MAX_SPEED = 7;
const BG_COLOR = 'black';
const PLAYER_COLOR = '#0078fa';
const BULLET_COLOR = 'white';
const WARNING_COLOR = 'red';
const PLAYER_BULLET_COLOR = 'yellow';

const BlockDodge = () => {
  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playerColor, setPlayerColor] = useState(PLAYER_COLOR);
  const [bulletTypes, setBulletTypes] = useState("Bullets: Normal");

  const player = useRef({ x: 400, y: 300, vx: 0, vy: 0, ax: 0, ay: 0 });
  const bullets = useRef([]);
  const shotgunBullets = useRef([]);
  const sniperBullets = useRef([]);
  const warnings = useRef([]);
  const playerBullets = useRef([]);
  const bulletSpeed = useRef(3.6);
  const shotgunSpeed = useRef(2.5);
  const sniperSpeed = useRef(15);
  const levelTimer = useRef(0);
  const keys = useRef({});
  const lastTime = useRef(Date.now());
  const hitTimer = useRef(0);

  useEffect(() => {
    const downHandler = (e) => {
      keys.current[e.key] = true;
      if (e.key === 'f') fireBullet();
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

  const fireBullet = () => {
    const p = player.current;
    playerBullets.current.push({ x: p.x, y: p.y + PLAYER_SIZE / 2, vx: -13, vy: 0 });
  };

  const spawnSniper = () => {
    const y = player.current.y;
    warnings.current.push({ y });
    setTimeout(() => {
      sniperBullets.current.push({ x: 0, y, vx: sniperSpeed.current });
      warnings.current.shift();
    }, 1000);
  };

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
    p.ax = keys.current['a'] ? -0.2 : keys.current['d'] ? 0.2 : 0;
    p.ay = keys.current['w'] ? -0.2 : keys.current['s'] ? 0.2 : 0;

    p.vx += p.ax;
    p.vy += p.ay;
    if (p.ax === 0) p.vx *= 0.92;
    if (p.ay === 0) p.vy *= 0.92;

    p.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vx));
    p.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vy));

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) { p.x = 0; p.vx *= -0.8; }
    if (p.x > WIDTH - PLAYER_SIZE) { p.x = WIDTH - PLAYER_SIZE; p.vx *= -0.8; }
    if (p.y < 0) { p.y = 0; p.vy *= -0.8; }
    if (p.y > HEIGHT - PLAYER_SIZE) { p.y = HEIGHT - PLAYER_SIZE; p.vy *= -0.8; }

    levelTimer.current += dt;
    bulletSpeed.current = Math.min(14, bulletSpeed.current + 0.001);
    shotgunSpeed.current = Math.min(12, shotgunSpeed.current + 0.0001);
    sniperSpeed.current = Math.min(18, sniperSpeed.current + 0.07);

    if (levelTimer.current >= 30) setBulletTypes("Bullets: Normal, Shotgun");
    if (levelTimer.current >= 59) setBulletTypes("Bullets: Normal, Shotgun, Sniper");

    if (Math.random() < 0.02) bullets.current.push({ x: -40, y: Math.random() * (HEIGHT - 20), vx: bulletSpeed.current });
    if (levelTimer.current >= 30 && Math.random() < 0.015) {
      const offset = 20;
      shotgunBullets.current.push({ x: -40, y: p.y + offset, vx: shotgunSpeed.current });
      shotgunBullets.current.push({ x: WIDTH + 40, y: p.y - offset, vx: -shotgunSpeed.current });
    }
    if (levelTimer.current >= 59 && Math.random() < 0.01) spawnSniper();

    bullets.current.forEach((b) => { b.x += b.vx; });
    shotgunBullets.current.forEach((b) => { b.x += b.vx; });
    sniperBullets.current.forEach((b) => { b.x += b.vx; });
    playerBullets.current.forEach((b) => { b.x += b.vx; });

    bullets.current = bullets.current.filter((b) => b.x < WIDTH + 100);
    shotgunBullets.current = shotgunBullets.current.filter((b) => b.x > -100 && b.x < WIDTH + 100);
    sniperBullets.current = sniperBullets.current.filter((b) => b.x < WIDTH + 100);
    playerBullets.current = playerBullets.current.filter((b) => b.x > -50);

    const allEnemyBullets = [...bullets.current, ...shotgunBullets.current, ...sniperBullets.current];

    allEnemyBullets.forEach((b, i) => {
      const hit = b.x < p.x + PLAYER_SIZE && b.x + 40 > p.x && b.y < p.y + PLAYER_SIZE && b.y + 20 > p.y;
      if (hit) {
        if (i < bullets.current.length) bullets.current.splice(i, 1);
        else if (i < bullets.current.length + shotgunBullets.current.length) shotgunBullets.current.splice(i - bullets.current.length, 1);
        else sniperBullets.current.splice(i - bullets.current.length - shotgunBullets.current.length, 1);
        setLives((l) => l - 1);
        setScore((s) => s + 1);
        hitTimer.current = 0.7;
      }
    });

    playerBullets.current.forEach((pb, pi) => {
      allEnemyBullets.forEach((eb, ei) => {
        const hit = pb.x < eb.x + 40 && pb.x + 3 > eb.x && pb.y < eb.y + 20 && pb.y + 15 > eb.y;
        if (hit) {
          if (ei < bullets.current.length) bullets.current.splice(ei, 1);
          else if (ei < bullets.current.length + shotgunBullets.current.length) shotgunBullets.current.splice(ei - bullets.current.length, 1);
          else sniperBullets.current.splice(ei - bullets.current.length - shotgunBullets.current.length, 1);
          playerBullets.current.splice(pi, 1);
          setScore((s) => s + 2);
        }
      });
    });

    if (lives <= 0) setGameOver(true);

    if (hitTimer.current > 0) {
      hitTimer.current -= dt;
      setPlayerColor((prev) => (Math.floor(hitTimer.current * 10) % 2 === 0 ? 'grey' : PLAYER_COLOR));
    } else {
      setPlayerColor(PLAYER_COLOR);
    }
  };

  const draw = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const p = player.current;
    ctx.fillStyle = playerColor;
    ctx.fillRect(p.x, p.y, PLAYER_SIZE, PLAYER_SIZE);

    ctx.fillStyle = BULLET_COLOR;
    bullets.current.forEach((b) => ctx.fillRect(b.x, b.y, 40, 20));
    shotgunBullets.current.forEach((b) => ctx.fillRect(b.x, b.y, 40, 20));
    sniperBullets.current.forEach((b) => ctx.fillRect(b.x, b.y + 3, 20, 2));

    ctx.fillStyle = WARNING_COLOR;
    warnings.current.forEach((w) => ctx.fillRect(0, w.y, WIDTH, 2));

    ctx.fillStyle = PLAYER_BULLET_COLOR;
    playerBullets.current.forEach((b) => ctx.fillRect(b.x, b.y, 3, 15));

    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Lato, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Lives: ${lives}`, 20, 30);
    ctx.fillText(`Score: ${score}`, 20, 60);
    ctx.fillText(bulletTypes, 20, 90);

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = 'white';
      ctx.font = '48px Lato, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2);
      ctx.fillText(`Final Score: ${score}`, WIDTH / 2, HEIGHT / 2 + 60);
    }

    if (!started) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = 'white';
      ctx.font = '48px Lato, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Starting in ${countdown}`, WIDTH / 2, HEIGHT / 2);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'radial-gradient(circle at center, #1f1f1f, #000000)'
    }}>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ border: '2px solid black' }}
      />
    </div>
  );
};

export default BlockDodge;
