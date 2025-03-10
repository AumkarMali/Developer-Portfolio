import { useState, useEffect, useRef } from "react";
import { TypeAnimation } from 'react-type-animation';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [videoInView, setVideoInView] = useState(false); // Track if video is in view
  const sectionRef = useRef(null);
  const videoRef = useRef(null); // Reference to video element

  // Intersection Observer to detect when the section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Intersection Observer for lazy loading videos
  useEffect(() => {
    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoInView(true); // Set video to be in view when visible
          videoObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      videoObserver.observe(videoRef.current);
    }

    return () => videoObserver.disconnect();
  }, []);

  const VideoComponent = ({ src, alt }) => (
    <video
      ref={videoRef} // Set the ref here to monitor the video element
      className="w-full h-full object-cover rounded-xl"
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      loading="lazy"
      style={{ opacity: videoInView ? 1 : 0, transition: 'opacity 0.5s ease' }} // Fade in when visible
    >
      {videoInView && <source src={src} type="video/mp4" />} {/* Only load source when in view */}
      Your browser does not support the video tag.
    </video>
  );

  const ProjectCard = ({ title, description, technologies, videoSrc, imageSrc, githubLink, alt }) => (
    <div className="relative w-full max-w-8xl mx-auto p-8 my-32">
      <div className="relative rounded-2xl overflow-hidden p-[2px] bg-gradient-to-r from-orange-500/50 to-orange-400/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
        <div className="bg-gray-900/90 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative rounded-xl overflow-hidden">
              {videoSrc ? (
                <VideoComponent src={videoSrc} alt={alt} />
              ) : (
                <img src={imageSrc} alt={alt} className="w-full h-full object-cover rounded-xl" loading="lazy" />
              )}
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
                  {title}
                </span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1 text-sm bg-gray-800/80 text-orange-400 rounded-full border border-orange-500/30">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                <span className="mr-2">Source Code</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const projects = [
    {
      title: "MedicArm",
      description: "A robotic arm designed for efficient and safe sorting of biohazardous waste...",
      technologies: ['Raspberry Pi', 'Arduino', 'Google Speech Recognition', 'IBM Watson', 'MongoDB', 'OpenAI'],
      videoSrc: "/assets/medicarm.mp4",
      githubLink: "https://github.com/AumkarMali/MEDIC_Arm.git",
      alt: "MedicArm Project"
    },
    {
      title: "BehaViewer",
      description: "This project utilizes machine learning, specifically the HistGradientBoostingClassifier...",
      technologies: ['Flask', 'Python', 'Heroku CLI', 'React', 'Tailwind CSS'],
      videoSrc: "/assets/video4.mp4",
      githubLink: "https://github.com/AumkarMali/BehaViewer.git",
      alt: "BehaViewer Project"
    },
    {
      title: "ACR - Automated Chess Robot",
      description: "Built a sophisticated chess-playing robot combining hardware and software engineering...",
      technologies: ['MATLAB', 'Python', 'Raspberry Pi', 'Tkinter', 'AI'],
      videoSrc: "/assets/video1.mp4",
      githubLink: "https://github.com/AumkarMali/ACR-Robotic-Turk",
      alt: "Automated Chess Robot"
    },
    {
      title: "Smart Bike - Human Metrics Measure",
      description: "This project measures human physical metrics using sensors embedded in a bicycle handlebar...",
      technologies: ['Node.js', 'Discord.js', 'NLP', 'Bot Development'],
      imageSrc: "/images/thumbnail1.jpg",
      githubLink: "https://github.com/AumkarMali/SmartBike",
      alt: "Smart Bike Project"
    },
    {
      title: "RC Car Controlled with Arduino",
      description: "Built an RC car with Bluetooth, IR sensors, and an Arduino...",
      technologies: ['Arduino', 'Bluetooth', 'C++', 'IR Sensors', 'Motor Control'],
      videoSrc: "/assets/video3.mp4",
      githubLink: "https://github.com/AumkarMali/Bluetooth-RC-Car",
      alt: "RC Car Project"
    },
    {
      title: "Voice Recognition AI Assistant",
      description: "Developed a voice recognition AI assistant capable of understanding commands for weather updates...",
      technologies: ['Python', 'AI', 'Speech Recognition', 'IBM Watson'],
      imageSrc: "/images/VR.png",
      githubLink: "https://github.com/AumkarMali/Voice-Recognition-Assistant",
      alt: "Voice Recognition Assistant"
    }
  ];

  return (
    <div ref={sectionRef} className="mt-4 pb-46">
      <div id="pr" className="text-center px-1 lg:px-40">
        <p><br /><br /><br /><br /></p>
        <h3 className="text-1xl sm:text-5xl lg:text-3xl mt-10 lg:mt-20 tracking-wide text-center opacity-80">
          {isVisible && (
            <TypeAnimation
              sequence={['Project Timeline', 1000]}
              wrapper="span"
              speed={30}
              style={{ fontSize: '2em' }}
              repeat={false}
              className="neon-text"
            />
          )}
        </h3>
      </div>
      
      <div className="px-5 lg:px-20 mt-10">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
