import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const VideoPlayer = ({ src, index, loop = false, endOffset = 0 }) => {
  const [loadingState, setLoadingState] = useState('loading');
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Only start loading when the component mounts
      videoRef.current.load();
      
      // Add loading metadata event
      const handleLoadedMetadata = () => {
        // Once metadata is loaded, we can start playing
        videoRef.current.play().catch(error => {
          console.log('Auto-play prevented:', error);
        });
      };

      const handleCanPlay = () => {
        setLoadingState('ready');
      };

      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoRef.current.addEventListener('canplay', handleCanPlay);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          videoRef.current.removeEventListener('canplay', handleCanPlay);
        }
      };
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current && endOffset > 0) {
      const targetEnd = videoRef.current.duration - endOffset;
      if (videoRef.current.currentTime >= targetEnd) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  };

  return (
    <div className="relative w-[45%] mx-2 group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-lg blur-2xl transform scale-110 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Loading state */}
      {loadingState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg z-20">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      )}

      <video
        ref={videoRef}
        muted
        playsInline
        loop={loop}
        onTimeUpdate={handleTimeUpdate}
        className={`rounded-lg border border-orange-700 w-full relative z-10 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/50 ${
          loadingState === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      id="start"
      className="flex flex-col items-center mt-6 lg:mt-20"
    >
      <motion.h1
        className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
      >
        <TypeAnimation
          sequence={[
            'Developer Portfolio',
            1000,
          ]}
          wrapper="span"
          speed={20}
          style={{ fontSize: '1em' }}
          repeat={false}
        />
        <span className="bg-gradient-to-r from-red-500 to-red-900 text-transparent bg-clip-text">
          {" "}Aumkar Mali
        </span>
      </motion.h1>
      
      <motion.div
        className="flex justify-center my-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
      >
        <a
          href="https://github.com/AumkarMali"
          className="bg-gradient-to-r from-blue-500 to-black-800 py-3 px-5 mx-3 rounded-md transition-opacity duration-300 hover:opacity-50"
        >
          <span className="typing-animation">GitHub</span>
        </a>
        
        <a
          href="https://www.youtube.com/@AumkarMali"
          className="bg-gradient-to-r from-red-500 to-black-800 py-3 px-4 mx-3 rounded-md transition-opacity duration-300 hover:opacity-50"
        >
          <span className="typing-animation">YouTube</span>
        </a>
        
        <a
          href="https://www.linkedin.com/in/aumkar-mali-3a1130327/"
          className="bg-gradient-to-r from-orange-500 to-black-800 py-3 px-4 mx-3 rounded-md flex items-center justify-center text-white transition-opacity duration-300 hover:opacity-50"
        >
          <span className="typing-animation">LinkedIn</span>
        </a>
      </motion.div>

      <motion.div
        className="flex mt-10 justify-center relative w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <VideoPlayer 
          src="/assets/video1.mp4" 
          index={1} 
          loop={true} 
          endOffset={0.5}
        />
        <VideoPlayer 
          src="/assets/video2.mp4" 
          index={2} 
          loop={true}
        />
      </motion.div>

      {/* Empty section for spacing */}
      <div className="h-32" />
    </motion.div>
  );
};

export default HeroSection;
