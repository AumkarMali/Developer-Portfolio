import React, { useState, useEffect } from 'react';

const LoadingPage = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulating a loading process
    const interval = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        transition: 'opacity 1s ease-in-out',
        backgroundColor: isLoaded ? 'black' : 'transparent', // Set the background to black when loading is done
        opacity: isLoaded ? '0' : '1', // Fade out when loading is complete
      }}
    >
      <div className="loading-content">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '3rem', // Space between progress bar and percentage
          }}
        >
          <div
            style={{
              fontSize: '2.5rem', // Increased font size for percentage
              fontWeight: 'bold',
              marginTop: '1rem',
              color: 'white',
              textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            {loadingProgress}%
          </div>
        </div>
        <div
          style={{
            width: '400px', // Increased width for larger progress bar
            height: '30px', // Increased height for larger progress bar
            backgroundColor: 'rgba(224, 224, 224, 0.5)',
            borderRadius: '15px', // Rounded corners
            overflow: 'hidden',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: 'orange', // Set the progress bar color to orange
              transition: 'width 0.5s ease-in-out',
              width: `${loadingProgress}%`,
            }}
          ></div>
        </div>
      </div>
      <div
        className="background-video"
        style={{
          transition: 'opacity 1s ease-in-out',
          opacity: isLoaded ? '0' : '1', // Fade out video as loading completes
        }}
      >
        <video
          autoPlay
          loop
          muted
          style={{
            minWidth: '100vw',
            minHeight: '100vh',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '-1',
          }}
        >
          <source src="src/assets/backdrop.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default LoadingPage;
