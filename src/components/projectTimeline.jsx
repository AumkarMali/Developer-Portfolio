import { useState, useEffect, useRef } from "react";
import { TypeAnimation } from 'react-type-animation'; // Import TypeAnimation component

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect observer once the animation triggers
        }
      },
      {
        threshold: 0, // Trigger as soon as any part of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="mt-4 pb-46">
      {/* Title Section */}
      <div id="pr" className="text-center px-1 lg:px-40">
        <p><br /><br /><br /><br /></p>
        <h3 className="text-1xl sm:text-5xl lg:text-3xl mt-10 lg:mt-20 tracking-wide text-center opacity-80">
          {isVisible && (
            <TypeAnimation
              sequence={[
                'Project Timeline', // Typing out "Project Timeline"
                1000, // Pause for 1s after typing
              ]}
              wrapper="span"
              speed={30} // Speed of typing
              style={{ fontSize: '2em' }} // Style of the typed text
              repeat={false} // Do not repeat the animation
              className="neon-text" // Apply the neon text class
            />
          )}
        </h3>
      </div>

      {/* Project Sections */}
      <div className="px-5 lg:px-20 mt-10">
        {/* First Project Widget */}
        <div className="relative w-full max-w-8xl mx-auto p-8 my-32">
          <div className="relative rounded-2xl overflow-hidden p-[2px] bg-gradient-to-r from-orange-500/50 to-orange-400/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
            <div className="bg-gray-900/90 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative rounded-xl overflow-hidden">
                  <video
                    src="/assets/video4.mp4"
                    alt="RC Car Controlled with Arduino"
                    className="w-full h-full object-cover rounded-xl"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
                      BehaViewer
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Flask', 'Python', 'Heroku CLI', 'React', 'Tailwind CSS'].map((tech) => (
                      <span key={tech} className="px-3 py-1 text-sm bg-gray-800/80 text-orange-400 rounded-full border border-orange-500/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    This project utilizes machine learning, specifically the HistGradientBoostingClassifier, to predict a user’s Internet Service Provider based on their demographic and device details. By training on a JSON dataset, the model learns to categorize users into specific groups based on key attributes. This can assist large organizations in making more informed economic decisions regarding their websites and products.
                  </p>
                  <a
                    href="https://github.com/AumkarMali/BehaViewer.git"
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

        {/* Second Project Widget */}
        <div className="relative w-full max-w-8xl mx-auto p-8 my-32">
          <div className="relative rounded-2xl overflow-hidden p-[2px] bg-gradient-to-r from-orange-500/50 to-orange-400/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
            <div className="bg-gray-900/90 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
               <div className="relative rounded-xl overflow-hidden">
                  <video
                    src="/assets/video1.mp4"
                    alt="RC Car Controlled with Arduino"
                    className="w-full h-full object-cover rounded-xl"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    loading="lazy"
                    poster="/images/chess-poster.jpg"  {/* Add a poster image for initial display */}
                  >
                    <source src="/assets/video1.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
                      ACR - Automated Chess Robot
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['MATLAB', 'Python', 'Raspberry Pi', 'Tkinter', 'AI'].map((tech) => (
                      <span key={tech} className="px-3 py-1 text-sm bg-gray-800/80 text-orange-400 rounded-full border border-orange-500/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Built a sophisticated chess-playing robot combining hardware and software engineering.
                    The system features a robotic arm controlled through MATLAB and Raspberry Pi, with an advanced chess AI capable of processing up to 100,000 calculations per move. The project includes a custom-built Tkinter GUI for real-time game visualization.
                  </p>
                  <a
                    href="https://github.com/AumkarMali/ACR-Robotic-Turk"
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

        {/* Third Project Widget */}
        <div className="relative w-full max-w-8xl mx-auto p-8 my-32">
          <div className="relative rounded-2xl overflow-hidden p-[2px] bg-gradient-to-r from-orange-500/50 to-orange-400/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
            <div className="bg-gray-900/90 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src="/images/thumbnail1.jpg"
                    alt="Smart Bike - Human Metrics Measure"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
                      Smart Bike - Human Metrics Measure
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Node.js', 'Discord.js', 'NLP', 'Bot Development'].map((tech) => (
                      <span key={tech} className="px-3 py-1 text-sm bg-gray-800/80 text-orange-400 rounded-full border border-orange-500/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    This project measures human physical metrics using sensors embedded in a bicycle handlebar. It calculates various health parameters like heart rate, speed, and calories burned. The bike is connected to an app that provides real-time data, allowing users to track their performance.
                  </p>
                  <a
                    href="https://github.com/AumkarMali/SmartBike"
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

    

        {/* Fifth Project Widget */}
        <div className="relative w-full max-w-8xl mx-auto p-8 my-32">
          <div className="relative rounded-2xl overflow-hidden p-[2px] bg-gradient-to-r from-orange-500/50 to-orange-400/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
            <div className="bg-gray-900/90 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative rounded-xl overflow-hidden">
                  <video 
                    src="/assets/video3.mp4"
                    alt="RC Car Controlled with Arduino" 
                    className="w-full h-full object-cover rounded-xl"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
                      RC Car Controlled with Arduino
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Arduino', 'Bluetooth', 'C++', 'IR Sensors', 'Motor Control'].map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 text-sm bg-gray-800/80 text-orange-400 rounded-full border border-orange-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Built an RC car with Bluetooth, IR sensors, and an Arduino. 
                    Designed a circuit schematic with relay, IR sensor, and servo motor. 
                    Programmed with Arduino IDE and C++ to show data on a mobile app. 
                    Achieved ~40 km/h speed with responsive controls and accurate metrics.
                  </p>
                  <a
                    href="https://github.com/AumkarMali/Bluetooth-RC-Car"
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



        <div className="relative w-full max-w-8xl mx-auto p-8 my-32">
          <div className="relative rounded-2xl overflow-hidden p-[2px] bg-gradient-to-r from-orange-500/50 to-orange-400/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
            <div className="bg-gray-900/90 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src="/images/VR.png" 
                    alt="Voice Recognition AI Assistant" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
                      Voice Recognition AI Assistant
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'AI', 'Speech Recognition', 'IBM Watson'].map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 text-sm bg-gray-800/80 text-orange-400 rounded-full border border-orange-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Developed a voice recognition AI assistant capable of understanding commands for weather updates, calculations, music playback, and more. 
                    Includes speech-to-text and text-to-speech functionality via Google and IBM Watson APIs. Inspired by Google Home and Amazon Alexa, the goal of this project was to create a customizable voice assistant capable of playing music and storing user preferences.
                  </p>
                  <a
                    href="https://github.com/AumkarMali/Voice-Recognition-Assistant"
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

      </div>
    </div>
  );
};

export default Projects;
