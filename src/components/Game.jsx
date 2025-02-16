import React, { useState, useEffect, useRef, useCallback } from 'react';

const WIDTH = 800;
const HEIGHT = 600;
const PLAYER_SIZE = 50;
const MAX_SPEED = 7;
const BULLET_TYPES = {
  NORMAL: 'grey',
  SHOTGUN: 'yellow',
  SNIPER: 'red'
};

function Game({ onClose }) {
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

  // Physics update
  const updatePhysics = useCallback(() => {
    setPlayer(p => {
      let newXChange = p.xChange + p.accelX;
      let newYChange = p.yChange + p.accelY;

      // Apply friction
      if(p.accelX === 0) newXChange *= 0.92;
      if(p.accelY === 0) newYChange *= 0.92;

      // Clamp to max speed
      newXChange = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newXChange));
      newYChange = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newYChange));

      // Update position
      let newX = p.x + newXChange;
      let newY = p.y + newYChange;

      // Wall collisions
      if(newX < PLAYER_SIZE/2) {
        newX = PLAYER_SIZE/2;
        newXChange *= -0.5;
      }
      if(newX > WIDTH - PLAYER_SIZE/2) {
        newX = WIDTH - PLAYER_SIZE/2;
        newXChange *= -0.5;
      }
      if(newY < PLAYER_SIZE/2) {
        newY = PLAYER_SIZE/2;
        newYChange *= -0.5;
      }
      if(newY > HEIGHT - PLAYER_SIZE/2) {
        newY = HEIGHT - PLAYER_SIZE/2;
        newYChange *= -0.5;
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

  // Bullet spawning
  const spawnBullets = useCallback(() => {
    // Normal bullets
    if(level >= 0) {
      setBullets(prev => [
        ...prev.filter(b => b.x < WIDTH + 50),
        {
          x: -50,
          y: player.y + (Math.random() * 100 - 50),
          speed: enemyAccel.current,
          type: BULLET_TYPES.NORMAL
        }
      ]);
    }

    // Shotgun bullets
    if(level >= 30) {
      setShotgunBullets(prev => [
        ...prev.filter(b => b.x < WIDTH + 50 && b.x > -50),
        {
          x: -50,
          y: Math.random() * HEIGHT,
          speed: enemyAccel2.current,
          type: BULLET_TYPES.SHOTGUN
        },
        {
          x: WIDTH + 50,
          y: Math.random() * HEIGHT,
          speed: enemyAccel2.current,
          type: BULLET_TYPES.SHOTGUN
        }
      ]);
    }

    // Sniper bullets
    if(level >= 59) {
      setWarnings(prev => [
        ...prev,
        { y: player.y, x: 0, active: true }
      ]);
      setTimeout(() => {
        setSniperBullets(prev => [
          ...prev,
          { x: -50, y: player.y, speed: enemyAccel3.current, type: BULLET_TYPES.SNIPER }
        ]);
        setWarnings(prev => prev.slice(1));
      }, 1000);
    }
  }, [level, player.y]);

  // Collision detection
  const checkCollisions = useCallback(() => {
    const playerRect = {
      x: player.x - PLAYER_SIZE/2,
      y: player.y - PLAYER_SIZE/2,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE
    };

    // Check all bullet types
    const allBullets = [...bullets, ...shotgunBullets, ...sniperBullets];
    allBullets.forEach(bullet => {
      const bulletRect = {
        x: bullet.x,
        y: bullet.y,
        width: 20,
        height: 15
      };

      if(checkRectCollision(playerRect, bulletRect)) {
        setPlayer(p => ({
          ...p,
          lives: p.lives - 1,
          hit: true,
          xChange: p.xChange + (bullet.x < WIDTH/2 ? 40 : -40)
        }));
        setTimeout(() => setPlayer(p => ({...p, hit: false})), 1000);
      }
    });

    if(player.lives <= 0) setGameOver(true);
  }, [player, bullets, shotgunBullets, sniperBullets]);

  const checkRectCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  // Game loop
  const update = useCallback(() => {
    if(gameOver) return;

    const now = Date.now();
    const delta = (now - lastUpdate.current) / 16.67;

    updatePhysics();
    checkCollisions();
    
    // Update bullets
    setBullets(prev => prev.map(b => ({...b, x: b.x + b.speed * delta})));
    setShotgunBullets(prev => prev.map(b => 
      b.x < WIDTH/2 ? 
      {...b, x: b.x + b.speed * delta} : 
      {...b, x: b.x - b.speed * delta}
    ));
    setSniperBullets(prev => prev.map(b => ({...b, x: b.x + b.speed * delta}));

    // Increase difficulty
    if(level < 60) {
      setLevel(l => l + delta * 0.02);
      enemyAccel.current += 0.001 * delta;
      enemyAccel2.current += 0.0001 * delta;
      enemyAccel3.current += 0.07 * delta;
    }

    // Update bullet types display
    if(level >= 30) setBulletTypes("Bullets: Normal, Shotgun");
    if(level >= 59) setBulletTypes("Bullets: Normal, Shotgun, Sniper");

    lastUpdate.current = now;
    animationFrame.current = requestAnimationFrame(update);
  }, [gameOver, updatePhysics, checkCollisions, level]);

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
      setPlayer(p => ({
        ...p,
        accelX: keys.current.ArrowLeft ? -0.2 : keys.current.ArrowRight ? 0.2 : 0,
        accelY: keys.current.ArrowUp ? -0.2 : keys.current.ArrowDown ? 0.2 : 0
      }));
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
      setPlayer(p => ({
        ...p,
        accelX: keys.current.ArrowLeft ? -0.2 : keys.current.ArrowRight ? 0.2 : 0,
        accelY: keys.current.ArrowUp ? -0.2 : keys.current.ArrowDown ? 0.2 : 0
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game timers
  useEffect(() => {
    if(!gameStarted || gameOver) return;
    
    const bulletTimer = setInterval(spawnBullets, 2000);
    return () => clearInterval(bulletTimer);
  }, [gameStarted, gameOver, spawnBullets]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // Draw player
      ctx.fillStyle = player.hit ? '#ff0000' : player.color;
      ctx.fillRect(
        player.x - PLAYER_SIZE/2,
        player.y - PLAYER_SIZE/2,
        PLAYER_SIZE,
        PLAYER_SIZE
      );
      
      // Draw bullets
      const allBullets = [...bullets, ...shotgunBullets, ...sniperBullets];
      allBullets.forEach(bullet => {
        ctx.fillStyle = bullet.type;
        ctx.fillRect(bullet.x, bullet.y, 20, 15);
      });

      // Draw warnings
      warnings.forEach(w => {
        ctx.fillStyle = 'red';
        ctx.fillRect(w.x, w.y, 30, 30);
      });

      // HUD
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(`Lives: ${player.lives}`, 10, 30);
      ctx.fillText(`Score: ${Math.floor(player.score)}`, 10, 60);
      ctx.fillText(bulletTypes, 10, 90);
    };

    draw();
  }, [player, bullets, shotgunBullets, sniperBullets, warnings, bulletTypes]);

  // Game state management
  useEffect(() => {
    if(countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c-1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameStarted(true);
      animationFrame.current = requestAnimationFrame(update);
    }
  }, [countdown, update]);

  return (
    <div className="game" style={{ position: 'relative' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ background: '#1f1f1f' }} />
      {!gameStarted && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '48px'
        }}>
          {countdown > 0 ? `Starting in: ${countdown}` : 'GO!'}
        </div>
      )}
      {gameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'red',
          fontSize: '48px',
          textAlign: 'center'
        }}>
          GAME OVER<br/>
          <span style={{ fontSize: '24px' }}>Score: {Math.floor(player.score)}</span>
        </div>
      )}
    </div>
  );
}

export default Game;
