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
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);
  const keys = useRef({});
  const animationFrame = useRef();

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

      newX = Math.max(0, Math.min(WIDTH - PLAYER_SIZE, newX));
      newY = Math.max(0, Math.min(HEIGHT - PLAYER_SIZE, newY));

      return {
        ...p,
        x: newX,
        y: newY,
        xChange: newXChange,
        yChange: newYChange,
      };
    });
  }, []);

  const spawnBullet = useCallback(() => {
    setBullets(prev => [...prev, { x: WIDTH, y: player.y + PLAYER_SIZE / 2, speed: 5, width: 20, height: 10 }]);
  }, [player.y]);

  const checkCollisions = useCallback(() => {
    setBullets(prevBullets => prevBullets.filter(bullet => {
      if (
        player.x < bullet.x + bullet.width &&
        player.x + PLAYER_SIZE > bullet.x &&
        player.y < bullet.y + bullet.height &&
        player.y + PLAYER_SIZE > bullet.y
      ) {
        setPlayer(p => ({ ...p, lives: p.lives - 1, hit: true }));
        return false;
      }
      return true;
    }));
  }, [player]);

  const updateGame = useCallback(() => {
    if (gameOver) return;
    updatePhysics();
    checkCollisions();

    setBullets(prev => prev.map(b => ({ ...b, x: b.x - b.speed })).filter(b => b.x > -20));

    if (Math.random() < 0.02) spawnBullet();

    animationFrame.current = requestAnimationFrame(updateGame);
  }, [gameOver, updatePhysics, checkCollisions, spawnBullet]);

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
    animationFrame.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [updateGame]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ border: '2px solid black' }} />
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px 20px' }}>Close</button>
    </div>
  );
};

export default Game;
