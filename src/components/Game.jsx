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
  const [warnings, setWarnings] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  const canvasRef = useRef(null);
  const keys = useRef({});
  const animationFrame = useRef();
  const lastUpdate = useRef(Date.now());
  const enemySpeed = useRef(3.6);

  const updatePhysics = useCallback(() => {
    setPlayer(p => {
      let newXChange = p.xChange + p.accelX;
      let newYChange = p.yChange + p.accelY;
      newXChange *= 0.92;
      newYChange *= 0.92;
      newXChange = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newXChange));
      newYChange = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newYChange));
      let newX = p.x + newXChange;
      let newY = p.y + newYChange;

      newX = Math.max(0, Math.min(WIDTH - PLAYER_SIZE, newX));
      newY = Math.max(0, Math.min(HEIGHT - PLAYER_SIZE, newY));

      return { ...p, x: newX, y: newY, xChange: newXChange, yChange: newYChange };
    });
  }, []);

  const spawnBullet = useCallback(() => {
    setBullets(prev => [...prev, { x: WIDTH, y: player.y + PLAYER_SIZE / 2 - 10, speed: enemySpeed.current, width: 20, height: 10 }]);
  }, [player.y]);

  const checkCollisions = useCallback(() => {
    const playerRect = { x: player.x, y: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE };
    setBullets(prev => prev.filter(bullet => {
      const bulletRect = { x: bullet.x, y: bullet.y, width: bullet.width, height: bullet.height };
      const collision = (
        playerRect.x < bulletRect.x + bulletRect.width &&
        playerRect.x + playerRect.width > bulletRect.x &&
        playerRect.y < bulletRect.y + bulletRect.height &&
        playerRect.y + playerRect.height > bulletRect.y
      );
      if (collision) {
        setPlayer(p => ({ ...p, lives: p.lives - 1, hit: true }));
      }
      return !collision;
    }));
  }, [player]);

  const updateGame = useCallback(() => {
    if (gameOver) return;
    updatePhysics();
    checkCollisions();
    setBullets(prev => prev.map(b => ({ ...b, x: b.x - b.speed })).filter(b => b.x > -50));
    if (Math.random() < 0.02) spawnBullet();
    lastUpdate.current = Date.now();
    animationFrame.current = requestAnimationFrame(updateGame);
  }, [gameOver, updatePhysics, checkCollisions, spawnBullet]);

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

  useEffect(() => {
    const handleKeyDown = e => { keys.current[e.key] = true; };
    const handleKeyUp = e => { keys.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const draw = () => {
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = player.hit ? 'red' : player.color;
      ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
      bullets.forEach(b => {
        ctx.fillStyle = COLORS.bullet;
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });
      ctx.fillStyle = COLORS.text;
      ctx.font = '20px Arial';
      ctx.fillText(`Lives: ${player.lives}`, 20, 30);
      ctx.fillText(`Score: ${player.score}`, 20, 60);
      if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = COLORS.text;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2);
      }
    };
    requestAnimationFrame(draw);
  }, [bullets, player, gameOver]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ border: '2px solid black' }} />
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px', cursor: 'pointer', backgroundColor: COLORS.text, color: 'white', border: 'none' }}>Close Game</button>
    </div>
  );
};

export default Game;
