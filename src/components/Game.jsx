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
  const [phase, setPhase] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef(null);
  const keys = useRef({});
  const animationFrame = useRef();
  const lastUpdate = useRef(Date.now());

  // Close the game after 2 seconds on game over
  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameOver, onClose]);

  // Handle key presses (WASD)
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
      if (e.key === 'a') setPlayer((p) => ({ ...p, accel: { ...p.accel, x: -0.2 } }));
      if (e.key === 'd') setPlayer((p) => ({ ...p, accel: { ...p.accel, x: 0.2 } }));
      if (e.key === 'w') setPlayer((p) => ({ ...p, accel: { ...p.accel, y: -0.2 } }));
      if (e.key === 's') setPlayer((p) => ({ ...p, accel: { ...p.accel, y: 0.2 } }));
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
      if (['a', 'd'].includes(e.key)) setPlayer((p) => ({ ...p, accel: { ...p.accel, x: 0 } }));
      if (['w', 's'].includes(e.key)) setPlayer((p) => ({ ...p, accel: { ...p.accel, y: 0 } }));
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
          x: p.position.x + newVelX,
          y: p.position.y + newVelY,
        },
        score: gameStarted ? Math.floor(p.score + 0.01) : p.score,
      };
    });

    // Enemy bullet movement (reverse direction)
    setEnemyBullets((bullets) =>
      bullets.map((bullet) => ({
        ...bullet,
        position: {
          x: bullet.position.x - bullet.velocity.x * delta,
          y: bullet.position.y - bullet.velocity.y * delta,
        },
      }))
    );

    // Check game over
    if (player.lives <= 0 && !gameOver) {
      setGameOver(true);
      return;
    }

    lastUpdate.current = now;
    if (!gameOver) {
      animationFrame.current = requestAnimationFrame(update);
    }
  }, [gameStarted, player, gameOver]);

  // Start countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const newCount = prev > 0 ? prev - 1 : 0;
        if (newCount === 0) {
          setGameStarted(true);
        }
        return newCount;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Start game loop after countdown
  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationFrame.current = requestAnimationFrame(update);
    }
  }, [gameStarted, update]);

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
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ border: '2px solid #333' }} />
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
