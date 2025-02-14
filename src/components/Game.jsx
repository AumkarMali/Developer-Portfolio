import React, { useState, useEffect, useRef, useCallback } from 'react';

const WIDTH = 800;
const HEIGHT = 600;
const PLAYER_SIZE = 50;
const MAX_SPEED = 7;
const GRAY12 = '#1f1f1f';

function Game() {
  const [player, setPlayer] = useState({
    position: { x: 400, y: 300 },
    velocity: { x: 0, y: 0 },
    accel: { x: 0, y: 0 },
    color: '#0078fa',
    lives: 3,
    score: 0,
    hit: false,
  });

  const [bullets, setBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [phase, setPhase] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef(null);
  const keys = useRef({});
  const animationFrame = useRef();
  const lastUpdate = useRef(Date.now());
  const bulletTypes = ['Normal', 'Shotgun', 'Sniper'];

  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
      if (e.key === 'ArrowLeft') setPlayer(p => ({ ...p, accel: { ...p.accel, x: -0.2 }}));
      if (e.key === 'ArrowRight') setPlayer(p => ({ ...p, accel: { ...p.accel, x: 0.2 }}));
      if (e.key === 'ArrowUp') setPlayer(p => ({ ...p, accel: { ...p.accel, y: -0.2 }}));
      if (e.key === 'ArrowDown') setPlayer(p => ({ ...p, accel: { ...p.accel, y: 0.2 }}));
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) setPlayer(p => ({ ...p, accel: { ...p.accel, x: 0 }}));
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) setPlayer(p => ({ ...p, accel: { ...p.accel, y: 0 }}));
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
    setPlayer(p => {
      let newVelX = p.velocity.x + p.accel.x * delta;
      let newVelY = p.velocity.y + p.accel.y * delta;
      
      if (p.accel.x === 0) newVelX *= 0.92;
      if (p.accel.y === 0) newVelY *= 0.92;
      
      newVelX = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newVelX));
      newVelY = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newVelY));

      const newScore = gameStarted ? p.score + 0.01 : p.score;

      return {
        ...p,
        velocity: { x: newVelX, y: newVelY },
        position: {
          x: p.position.x + newVelX,
          y: p.position.y + newVelY,
        },
        score: Math.floor(newScore)
      };
    });

    // Wall collisions
    setPlayer(p => {
      let newPos = { ...p.position };
      let newVel = { ...p.velocity };
      
      if (p.position.x < 0) {
        newPos.x = 0;
        newVel.x *= -1;
      }
      if (p.position.x + PLAYER_SIZE > WIDTH) {
        newPos.x = WIDTH - PLAYER_SIZE;
        newVel.x *= -1;
      }
      if (p.position.y < 40) {
        newPos.y = 40;
        newVel.y *= -1;
      }
      if (p.position.y + PLAYER_SIZE > HEIGHT - 40) {
        newPos.y = HEIGHT - 40 - PLAYER_SIZE;
        newVel.y *= -1;
      }
      
      return { ...p, position: newPos, velocity: newVel };
    });

    // Phase progression
    if (player.score >= 30 && phase < 1) setPhase(1);
    if (player.score >= 60 && phase < 2) setPhase(2);

    // Bullet spawning
    if (gameStarted && Math.random() < (0.02 + phase * 0.01)) {
      const types = [];
      if (phase >= 0) types.push('normal');
      if (phase >= 1) types.push('shotgun');
      if (phase >= 2) types.push('sniper');
      
      const type = types[Math.floor(Math.random() * types.length)];
      let newBullets = [];

      switch(type) {
        case 'normal':
          newBullets.push({
            position: { x: WIDTH + 40, y: Math.random() * (HEIGHT - 100) + 50 },
            velocity: { x: -3 - Math.floor(player.score) * 0.01, y: 0 },
            size: { w: 40, h: 20 },
            color: '#fff',
          });
          break;
        case 'shotgun':
          for (let offset of [-20, 0, 20]) {
            newBullets.push({
              position: { 
                x: Math.random() > 0.5 ? -20 : WIDTH + 20,
                y: player.position.y + offset 
              },
              velocity: { 
                x: Math.random() > 0.5 ? 2.5 : -2.5, 
                y: 0 
              },
              size: { w: 20, h: 15 },
              color: 'yellow',
            });
          }
          break;
        case 'sniper':
          newBullets.push({
            position: { x: WIDTH + 20, y: player.position.y },
            velocity: { x: -15 - Math.floor(player.score) * 0.02, y: 0 },
            size: { w: 20, h: 7 },
            color: 'red',
          });
          break;
      }

      setEnemyBullets(prev => [...prev, ...newBullets]);
    }

    // Update enemy bullets and check collisions
    setEnemyBullets(prev => {
      return prev.filter(b => {
        // Improved collision detection with slightly smaller hitbox
        const playerHitbox = {
          x: player.position.x + 5,
          y: player.position.y + 5,
          width: PLAYER_SIZE - 10,
          height: PLAYER_SIZE - 10
        };

        const bulletHitbox = {
          x: b.position.x,
          y: b.position.y,
          width: b.size.w,
          height: b.size.h
        };

        const colliding = 
          playerHitbox.x < bulletHitbox.x + bulletHitbox.width &&
          playerHitbox.x + playerHitbox.width > bulletHitbox.x &&
          playerHitbox.y < bulletHitbox.y + bulletHitbox.height &&
          playerHitbox.y + playerHitbox.height > bulletHitbox.y;

        if (colliding && !player.hit) {
          setPlayer(p => ({ 
            ...p, 
            lives: p.lives - 1,
            hit: true
          }));
          setTimeout(() => {
            setPlayer(p => ({ ...p, hit: false }));
          }, 500); // Reduced invincibility time
          return false;
        }
        
        return b.position.x > -100 && b.position.x < WIDTH + 100;
      }).map(b => ({
        ...b,
        position: {
          x: b.position.x + b.velocity.x * delta,
          y: b.position.y + b.velocity.y * delta,
        }
      }));
    });

    // Check game over
    if (player.lives <= 0 && !gameOver) {
      setGameOver(true);
      return;
    }

    lastUpdate.current = now;
    if (!gameOver) {
      animationFrame.current = requestAnimationFrame(update);
    }
  }, [gameStarted, phase, player.score, player.lives, gameOver]);

  // Start countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        const newCount = prev > 0 ? prev - 1 : 0;
        if (newCount === 0) {
          setGameStarted(true);
        }
        return newCount;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  // Start game loop after countdown
  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationFrame.current = requestAnimationFrame(update);
    }
  }, [gameStarted, update]);

  // Render
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    
    const render = () => {
      ctx.fillStyle = GRAY12;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Draw walls
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, WIDTH, 40);
      ctx.fillRect(0, HEIGHT - 40, WIDTH, 40);

      // Draw player
      ctx.fillStyle = player.hit ? 'red' : player.color;
      ctx.fillRect(player.position.x, player.position.y, PLAYER_SIZE, PLAYER_SIZE);

      // Draw enemy bullets
      enemyBullets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.position.x, b.position.y, b.size.w, b.size.h);
      });

      // Draw UI
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${Math.floor(player.score)}`, WIDTH - 150, 30);
      ctx.fillText(`Phase: ${phase + 1}`, WIDTH - 250, 30);
      
      ctx.fillStyle = '#f77140';
      ctx.fillText(`Bullets: ${bulletTypes.slice(0, phase + 1).join(', ')}`, 20, 30);

      // Draw lives
      for (let i = 0; i < player.lives; i++) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(100 + i * 40, HEIGHT - 20, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();
  }, [player, enemyBullets, phase]);

  return (
    <div className="game" style={{ position: 'relative' }}>
      <canvas 
        ref={canvasRef} 
        width={WIDTH} 
        height={HEIGHT} 
        style={{ border: '2px solid #333' }}
      />
      {countdown > 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '48px',
          color: 'white'
        }}>
          {countdown}
        </div>
      )}
      {gameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1>GAME OVER</h1>
          <p>Final Score: {Math.floor(player.score)}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;