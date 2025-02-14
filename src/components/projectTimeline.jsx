import { useState, useEffect, useRef } from "react";
import { TypeAnimation } from 'react-type-animation';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const VideoComponent = ({ src, alt }) => (
    <video
      className="w-full h-full object-cover rounded-xl"
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      loading="lazy"
    >
      <source src={src} type="video/mp4" />
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
      description: "A robotic arm designed for efficient and safe sorting of biohazardous waste into user-defined containers using intuitive voice commands. It integrates Raspberry Pi and Arduino for precise hardware control, along with AI-driven speech recognition to enable hands-free operation. Additionally, IBM Watson Text-to-Speech provides real-time auditory feedback, ensuring smooth and reliable user interaction.",
      technologies: ['Raspberry Pi', 'Arduino', 'Google Speech Recognition', 'IBM Watson', 'MongoDB', 'OpenAI'],
      videoSrc: "/assets/medicarm.mp4",
      githubLink: "https://github.com/AumkarMali/MEDIC_Arm.git",
      alt: "MedicArm Project"
    },
    {
      title: "BehaViewer",
      description: "This project utilizes machine learning, specifically the HistGradientBoostingClassifier, to predict a user's Internet Service Provider based on their demographic and device details. By training on a JSON dataset, the model learns to categorize users into specific groups based on key attributes.",
      technologies: ['Flask', 'Python', 'Heroku CLI', 'React', 'Tailwind CSS'],
      videoSrc: "/assets/video4.mp4",
      githubLink: "https://github.com/AumkarMali/BehaViewer.git",
      alt: "BehaViewer Project"
    },
    {
      title: "ACR - Automated Chess Robot",
      description: "Built a sophisticated chess-playing robot combining hardware and software engineering. The system features a robotic arm controlled through MATLAB and Raspberry Pi, with an advanced chess AI capable of processing up to 100,000 calculations per move.",
      technologies: ['MATLAB', 'Python', 'Raspberry Pi', 'Tkinter', 'AI'],
      videoSrc: "/assets/video1.mp4",
      githubLink: "https://github.com/AumkarMali/ACR-Robotic-Turk",
      alt: "Automated Chess Robot"
    },
    {
      title: "Smart Bike - Human Metrics Measure",
      description: "This project measures human physical metrics using sensors embedded in a bicycle handlebar. It calculates various health parameters like heart rate, speed, and calories burned. The bike is connected to an app that provides real-time data.",
      technologies: ['Node.js', 'Discord.js', 'NLP', 'Bot Development'],
      imageSrc: "/images/thumbnail1.jpg",
      githubLink: "https://github.com/AumkarMali/SmartBike",
      alt: "Smart Bike Project"
    },
    {
      title: "RC Car Controlled with Arduino",
      description: "Built an RC car with Bluetooth, IR sensors, and an Arduino. Designed a circuit schematic with relay, IR sensor, and servo motor. Programmed with Arduino IDE and C++ to show data on a mobile app. Achieved ~40 km/h speed with responsive controls.",
      technologies: ['Arduino', 'Bluetooth', 'C++', 'IR Sensors', 'Motor Control'],
      videoSrc: "/assets/video3.mp4",
      githubLink: "https://github.com/AumkarMali/Bluetooth-RC-Car",
      alt: "RC Car Project"
    },
    {
      title: "Voice Recognition AI Assistant",
      description: "Developed a voice recognition AI assistant capable of understanding commands for weather updates, calculations, music playback, and more. Includes speech-to-text and text-to-speech functionality via Google and IBM Watson APIs.",
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
