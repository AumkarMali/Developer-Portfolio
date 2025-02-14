import React, { useState, useEffect, useRef, useCallback } from 'react';

const WIDTH = 800;
const HEIGHT = 600;
const PLAYER_SIZE = 50;
const MAX_SPEED = 7;

function Game({ onClose }) {
  const [player, setPlayer] = useState({
    position: { x: 400, y: 300 },
    velocity: { x: 0, y: 0 },
    accel: { x: 0, y: 0 },
    color: '#0078fa',
    lives: 3,
    score: 0,
    hit: false,
  });

  const [enemyBullets, setEnemyBullets] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef(null);
  const keys = useRef({});
  const animationFrame = useRef();
  const lastUpdate = useRef(Date.now());

  // Game close handler
  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [gameOver, onClose]);

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
      if (e.key === 'a') setPlayer(p => ({ ...p, accel: { ...p.accel, x: -0.2 } }));
      if (e.key === 'd') setPlayer(p => ({ ...p, accel: { ...p.accel, x: 0.2 } }));
      if (e.key === 'w') setPlayer(p => ({ ...p, accel: { ...p.accel, y: -0.2 } }));
      if (e.key === 's') setPlayer(p => ({ ...p, accel: { ...p.accel, y: 0.2 } }));
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
      if (['a', 'd'].includes(e.key)) setPlayer(p => ({ ...p, accel: { ...p.accel, x: 0 } }));
      if (['w', 's'].includes(e.key)) setPlayer(p => ({ ...p, accel: { ...p.accel, y: 0 } }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  const update = useCallback(() => {
    const now = Date.now();
    const delta = (now - lastUpdate.current) / 16.67;

    // Player movement
    setPlayer((p) => {
      let newVelX = p.velocity.x + p.accel.x * delta;
      let newVelY = p.velocity.y + p.accel.y * delta;

      if (p.accel.x === 0) newVelX *= 0.92;
      if (p.accel.y === 0) newVelY *= 0.92;

      newVelX = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newVelX));
      newVelY = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newVelY));

      return {
        ...p,
        velocity: { x: newVelX, y: newVelY },
        position: {
          x: Math.max(PLAYER_SIZE/2, Math.min(WIDTH - PLAYER_SIZE/2, p.position.x + newVelX)),
          y: Math.max(PLAYER_SIZE/2, Math.min(HEIGHT - PLAYER_SIZE/2, p.position.y + newVelY)),
        },
        score: gameStarted ? p.score + 0.1 : p.score,
      };
    });

    // Bullet movement
    setEnemyBullets(bullets => 
      bullets.filter(bullet => 
        bullet.position.x > -10 && bullet.position.x < WIDTH + 10 &&
        bullet.position.y > -10 && bullet.position.y < HEIGHT + 10
      ).map(bullet => ({
        ...bullet,
        position: {
          x: bullet.position.x - bullet.velocity.x * delta,
          y: bullet.position.y - bullet.velocity.y * delta
        }
      }))
    );

    lastUpdate.current = now;
    if (!gameOver) animationFrame.current = requestAnimationFrame(update);
  }, [gameStarted, gameOver]);

  // Bullet spawning
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const spawnInterval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5;
      const newBullet = {
        position: { 
          x: Math.random() * WIDTH,
          y: Math.random() * HEIGHT
        },
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        }
      };
      setEnemyBullets(prev => [...prev, newBullet]);
    }, 1000);

    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameOver]);

  // Collision detection
  useEffect(() => {
    const checkCollisions = () => {
      setEnemyBullets(bullets => bullets.filter(bullet => {
        const dx = player.position.x - bullet.position.x;
        const dy = player.position.y - bullet.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < PLAYER_SIZE/2 + 5) {
          setPlayer(p => ({ ...p, lives: p.lives - 1, hit: true }));
          setTimeout(() => setPlayer(p => ({ ...p, hit: false })), 100);
          return false;
        }
        return true;
      }));
    };

    if (gameStarted && !gameOver) {
      const collisionInterval = setInterval(checkCollisions, 100);
      return () => clearInterval(collisionInterval);
    }
  }, [gameStarted, gameOver, player.position]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // Draw player
      ctx.fillStyle = player.hit ? '#ff0000' : player.color;
      ctx.fillRect(
        player.position.x - PLAYER_SIZE/2,
        player.position.y - PLAYER_SIZE/2,
        PLAYER_SIZE,
        PLAYER_SIZE
      );
      
      // Draw bullets
      ctx.fillStyle = '#ff0000';
      enemyBullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.position.x, bullet.position.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw HUD
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(`Lives: ${player.lives}`, 10, 30);
      ctx.fillText(`Score: ${Math.floor(player.score)}`, 10, 60);
    };

    if (gameStarted && !gameOver) {
      const renderLoop = () => {
        draw();
        if (!gameOver) requestAnimationFrame(renderLoop);
      };
      renderLoop();
    }
  }, [gameStarted, gameOver, player, enemyBullets]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 0) setGameStarted(true);
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Start game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationFrame.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationFrame.current);
  }, [gameStarted, gameOver, update]);

  return (
    <div className="game" style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          cursor: 'pointer',
          color: 'white',
          fontSize: '24px',
          zIndex: 2,
        }}
        onClick={onClose}
      >
        ×
      </div>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ background: '#111' }} />
      {countdown > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '48px',
            color: 'white',
          }}
        >
          {countdown}
        </div>
      )}
      {gameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <h1>GAME OVER</h1>
          <p>Final Score: {Math.floor(player.score)}</p>
        </div>
      )}
    </div>
  );
}

export default Game;
