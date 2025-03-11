import React, { useState, useEffect, useRef, useCallback } from 'react';

const WIDTH = 800;
const HEIGHT = 600;
const PLAYER_SIZE = 50;
const MAX_SPEED = 7;
const COLORS = {
  player: '#0078fa',
  bullet: 'white',
  text: 'red',
  warning: 'red',
  background: '#1f1f1f'
};

const Game = ({ onClose }) => {
  const [player, setPlayer] = useState({
    x: 400,
    y: 300,
    xChange: 0,
    yChange: 0,
    accelX: 0,
    accelY: 0,
    color: COLORS.player,
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

  const canvasRef = useRef(null);
  const keys = useRef({});
  const animationFrame = useRef();
  const lastUpdate = useRef(Date.now());
  const enemyAccel = useRef(3.6);
  const enemyAccel2 = useRef(2.5);
  const enemyAccel3 = useRef(15);
  const level = useRef(0);

  const updatePhysics = useCallback(() => {
    setPlayer(p => {
      let newXChange = p.xChange + p.accelX;
      let newYChange = p.yChange + p.accelY;

      if (p.accelX === 0) newXChange *= 0.92;
      if (p.accelY === 0) newYChange *= 0.92;

      newXChange = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newXChange));
      newYChange = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newYChange));

      let newX = p.x + newXChange;
      let newY = p.y + newYChange;

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
    const playerY = player.y + PLAYER_SIZE/2;
    const playerX = player.x + PLAYER_SIZE/2;
    
    const startX = type === 'shotgun-right' ? WIDTH : -40;
    const dx = playerX - startX;
    const dy = playerY - (player.y + (Math.random() * 40 - 20));
    const angle = Math.atan2(dy, dx);
    
    const speed = type === 'normal' ? enemyAccel.current : 
                 type.includes('shotgun') ? enemyAccel2.current : enemyAccel3.current;

    const newBullet = {
      x: startX,
      y: player.y + (Math.random() * 40 - 20),
      velX: Math.cos(angle) * speed,
      velY: Math.sin(angle) * speed,
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
  }, [player.x, player.y]);

  const checkCollisions = useCallback(() => {
    const playerRect = {
      x: player.x,
      y: player.y,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE
    };

    const checkCollision = (bullet) => (
      playerRect.x < bullet.x + bullet.width &&
      playerRect.x + playerRect.width > bullet.x &&
      playerRect.y < bullet.y + bullet.height &&
      playerRect.y + playerRect.height > bullet.y
    );

    bullets.forEach((bullet, index) => {
      if (checkCollision(bullet)) {
        setPlayer(p => ({
          ...p,
          lives: p.lives - 1,
          hit: true,
          score: p.score + 1
        }));
        setBullets(prev => prev.filter((_, i) => i !== index));
      }
    });

    [...shotgunBullets, ...sniperBullets].forEach((bullet, index) => {
      if (checkCollision(bullet)) {
        setPlayer(p => ({
          ...p,
          lives: p.lives - 1,
          hit: true,
          score: p.score + 1
        }));
        if (bullet.type === 'sniper') {
          setSniperBullets(prev => prev.filter((_, i) => i !== index));
        } else {
          setShotgunBullets(prev => prev.filter((_, i) => i !== index));
        }
      }
    });

    if (player.lives <= 0) setGameOver(true);
  }, [player, bullets, shotgunBullets, sniperBullets]);

  const updateGame = useCallback(() => {
    if (gameOver) return;

    const now = Date.now();
    const deltaTime = (now - lastUpdate.current) / 1000;

    updatePhysics();
    checkCollisions();

    setBullets(prev => prev
      .map(b => ({ 
        ...b, 
        x: b.x + b.velX,
        y: b.y + b.velY
      }))
      .filter(b => b.x < WIDTH + 100 && b.x > -100));

    setShotgunBullets(prev => prev
      .map(b => ({
        ...b,
        x: b.x + b.velX,
        y: b.y + b.velY
      }))
      .filter(b => b.x > -100 && b.x < WIDTH + 100));

    setSniperBullets(prev => prev
      .map(b => ({ 
        ...b,
        x: b.x + b.velX,
        y: b.y + b.velY
      }))
      .filter(b => b.x < WIDTH + 100));

    level.current += deltaTime;
    enemyAccel.current = Math.min(14, enemyAccel.current + 0.001);
    enemyAccel2.current = Math.min(12, enemyAccel2.current + 0.0001);
    enemyAccel3.current = Math.min(18, enemyAccel3.current + 0.07);

    if (level.current >= 30) setBulletTypes("Bullets: Normal, Shotgun");
    if (level.current >= 59) setBulletTypes("Bullets: Normal, Shotgun, Sniper");

    if (Math.random() < 0.02) spawnBullet('normal');
    if (level.current >= 30 && Math.random() < 0.015) {
      spawnBullet('shotgun-left');
      spawnBullet('shotgun-right');
    }
    if (level.current >= 59 && Math.random() < 0.01) {
      setWarnings(prev => [...prev, { y: player.y, x: 0 }]);
      setTimeout(() => {
        spawnBullet('sniper');
        setWarnings(prev => prev.slice(1));
      }, 1000);
    }

    lastUpdate.current = now;
    animationFrame.current = requestAnimationFrame(updateGame);
  }, [gameOver, updatePhysics, checkCollisions, spawnBullet, player.y]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
      setPlayer(p => ({
        ...p,
        accelX: keys.current.a ? -0.2 : keys.current.d ? 0.2 : 0,
        accelY: keys.current.w ? -0.2 : keys.current.s ? 0.2 : 0
      }));
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
      setPlayer(p => ({
        ...p,
        accelX: keys.current.a ? -0.2 : keys.current.d ? 0.2 : 0,
        accelY: keys.current.w ? -0.2 : keys.current.s ? 0.2 : 0
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Draw player
      ctx.fillStyle = player.hit ? 'red' : player.color;
      ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

      // Draw bullets
      [bullets, shotgunBullets, sniperBullets].forEach(bulletGroup => {
        bulletGroup.forEach(b => {
          ctx.fillStyle = COLORS.bullet;
          ctx.fillRect(b.x, b.y, b.width, b.height);
        });
      });

      // Draw warnings
      warnings.forEach(w => {
        ctx.fillStyle = COLORS.warning;
        ctx.fillRect(w.x, w.y, 30, 30);
      });

      // Draw UI
      ctx.fillStyle = COLORS.text;
      ctx.font = '20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Lives: ${player.lives}`, 20, 30);
      ctx.fillText(`Score: ${Math.floor(player.score)}`, 20, 60);
      ctx.fillText(bulletTypes, 20, 90);

      // Game over screen
      if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = COLORS.text;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', WIDTH/2, HEIGHT/2);
        ctx.fillText(`Final Score: ${Math.floor(player.score)}`, WIDTH/2, HEIGHT/2 + 50);
      }

      // Countdown screen
      if (!gameStarted) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = COLORS.text;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Starting in ${countdown}`, WIDTH/2, HEIGHT/2);
      }
    };

    const animation = requestAnimationFrame(() => {
      draw();
      if (!gameOver) animationFrame.current = requestAnimationFrame(draw);
    });

    return () => cancelAnimationFrame(animation);
  }, [bullets, shotgunBullets, sniperBullets, warnings, player, gameOver, countdown, gameStarted, bulletTypes]);

  useEffect(() => {
    if (countdown > 0 && !gameStarted) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      lastUpdate.current = Date.now();
      animationFrame.current = requestAnimationFrame(updateGame);
    }
  }, [countdown, gameStarted, updateGame]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ border: '2px solid black' }}
      />
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: COLORS.text,
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Close Game
      </button>
    </div>
  );
};

export default Game;
