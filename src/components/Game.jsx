import React, { useState, useEffect, useRef, useCallback } from 'react';

const WIDTH = 800;
const HEIGHT = 600;
const PLAYER_SIZE = 50;
const MAX_SPEED = 7;
const GRAY12 = '#1f1f1f';

const Game = ({ onClose }) => {
  const [player, setPlayer] = useState({
    x: 400,
    y: 300,
    xChange: 0,
    yChange: 0,
    accelX: 0,
    accelY: 0,
    color: '#0078fa',
    lives: 3,
    score: 0,
    hit: false,
  });

  const [bullets, setBullets] = useState([]);
  const [shotgunBullets, setShotgunBullets] = useState([]);
  const [sniperBullets, setSniperBullets] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [bulletTypes, setBulletTypes] = useState("Bullets: Normal");
  const [level, setLevel] = useState(0);

  const canvasRef = useRef(null);
  const keys = useRef({});
  const animationFrame = useRef();
  const lastUpdate = useRef(Date.now());
  const enemyAccel = useRef(3.6);
  const enemyAccel2 = useRef(2.5);
  const enemyAccel3 = useRef(15);
  const hitTimer = useRef(0);

  const updatePhysics = useCallback(() => {
    setPlayer(p => {
      let newXChange = p.xChange + p.accelX;
      let newYChange = p.yChange + p.accelY;

      // Apply friction when no acceleration
      if (p.accelX === 0) newXChange *= 0.92;
      if (p.accelY === 0) newYChange *= 0.92;

      // Clamp speeds
      newXChange = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newXChange));
      newYChange = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newYChange));

      let newX = p.x + newXChange;
      let newY = p.y + newYChange;

      // Wall collisions with bounce
      if (newX < 0) {
        newX = 0;
        newXChange = Math.abs(newXChange) * 0.8;
      }
      if (newX > WIDTH - PLAYER_SIZE) {
        newX = WIDTH - PLAYER_SIZE;
        newXChange = -Math.abs(newXChange) * 0.8;
      }
      if (newY < 0) {
        newY = 0;
        newYChange = Math.abs(newYChange) * 0.8;
      }
      if (newY > HEIGHT - PLAYER_SIZE) {
        newY = HEIGHT - PLAYER_SIZE;
        newYChange = -Math.abs(newYChange) * 0.8;
      }

      return {
        ...p,
        x: newX,
        y: newY,
        xChange: newXChange,
        yChange: newYChange,
      };
    });
  }, []);

  const spawnBullet = useCallback((type) => {
    const newBullet = {
      x: type === 'shotgun-right' ? WIDTH : -40,
      y: player.y + (Math.random() * 100 - 50),
      speed: type === 'normal' ? enemyAccel.current : 
             type.includes('shotgun') ? enemyAccel2.current : enemyAccel3.current,
      type: type,
      width: type === 'sniper' ? 20 : 40,
      height: type === 'sniper' ? 7 : 20
    };

    if (type === 'normal') {
      setBullets(prev => [...prev, newBullet]);
    } else if (type.includes('shotgun')) {
      setShotgunBullets(prev => [...prev, newBullet]);
    } else if (type === 'sniper') {
      setSniperBullets(prev => [...prev, newBullet]);
    }
  }, [player.y]);

  const checkCollisions = useCallback(() => {
    const playerRect = {
      x: player.x,
      y: player.y,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE
    };

    const checkBulletCollision = (bullet) => {
      const bulletRect = {
        x: bullet.x,
        y: bullet.y,
        width: bullet.width,
        height: bullet.height
      };

      return (playerRect.x < bulletRect.x + bulletRect.width &&
        playerRect.x + playerRect.width > bulletRect.x &&
        playerRect.y < bulletRect.y + bulletRect.height &&
        playerRect.y + playerRect.height > bulletRect.y);
    };

    // Check normal bullets
    bullets.forEach((bullet, index) => {
      if (checkBulletCollision(bullet)) {
        setPlayer(p => ({
          ...p,
          lives: p.lives - 1,
          hit: true,
          xChange: p.xChange + (bullet.type === 'normal' ? 40 : -40)
        }));
        setBullets(prev => prev.filter((_, i) => i !== index));
        hitTimer.current = Date.now();
      }
    });

    // Check other bullet types
    [...shotgunBullets, ...sniperBullets].forEach((bullet, index) => {
      if (checkBulletCollision(bullet)) {
        setPlayer(p => ({
          ...p,
          lives: p.lives - 1,
          hit: true,
          xChange: p.xChange + (bullet.type === 'shotgun-left' ? -40 : 40)
        }));
        if (bullet.type === 'sniper') {
          setSniperBullets(prev => prev.filter((_, i) => i !== index));
        } else {
          setShotgunBullets(prev => prev.filter((_, i) => i !== index));
        }
        hitTimer.current = Date.now();
      }
    });

    if (player.lives <= 0) setGameOver(true);
  }, [player, bullets, shotgunBullets, sniperBullets]);

  const updateGame = useCallback(() => {
    if (gameOver) return;

    const now = Date.now();
    const deltaTime = (now - lastUpdate.current) / 1000;

    // Update physics and collisions
    updatePhysics();
    checkCollisions();

    // Update bullets
    setBullets(prev => prev
      .map(b => ({ ...b, x: b.x + b.speed * deltaTime * 60 }))
      .filter(b => b.x < WIDTH + 100));

    setShotgunBullets(prev => prev
      .map(b => ({
        ...b,
        x: b.type === 'shotgun-left' ? 
           b.x - b.speed * deltaTime * 60 : 
           b.x + b.speed * deltaTime * 60
      }))
      .filter(b => b.x > -100 && b.x < WIDTH + 100));

    setSniperBullets(prev => prev
      .map(b => ({ ...b, x: b.x + b.speed * deltaTime * 60 }))
      .filter(b => b.x < WIDTH + 100));

    // Increase difficulty
    setLevel(l => l + deltaTime);
    enemyAccel.current = Math.min(14, enemyAccel.current + 0.001);
    enemyAccel2.current = Math.min(12, enemyAccel2.current + 0.0001);
    enemyAccel3.current = Math.min(18, enemyAccel3.current + 0.07);

    // Spawn bullets based on level
    if (level >= 30) setBulletTypes("Bullets: Normal, Shotgun");
    if (level >= 59) setBulletTypes("Bullets: Normal, Shotgun, Sniper");

    // Random bullet spawning
    if (Math.random() < 0.02) spawnBullet('normal');
    if (level >= 30 && Math.random() < 0.015) {
      spawnBullet('shotgun-left');
      spawnBullet('shotgun-right');
    }
    if (level >= 59 && Math.random() < 0.01) {
      setWarnings(prev => [...prev, { y: player.y, x: 0 }]);
      setTimeout(() => {
        spawnBullet('sniper');
        setWarnings(prev => prev.slice(1));
      }, 1000);
    }

    lastUpdate.current = now;
    animationFrame.current = requestAnimationFrame(updateGame);
  }, [gameOver, updatePhysics, checkCollisions, level, spawnBullet, player.y]);

  // Key handling and game loop setup...

  // Render function remains similar but updated with proper bullet rendering

  return (
    <div>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
      <button onClick={onClose}>Close Game</button>
    </div>
  );
};

export default Game;
