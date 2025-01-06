import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation'; // Import TypeAnimation component

const AboutSection = () => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: -100 // Start from left side
    },
    visible: (index) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8,
        delay: index * 0.3 // Stagger the animations
      }
    })
  };

  return (
    <div className="w-full py-16 px-4 mb-64" id="aboutSec">
      {/* Title Section */}
      <motion.div 
        className="text-center px-1 lg:px-40 mt-4 lg:mt-10 mb-10"
      >
        <p><br /><br /><br /><br /></p>
        <h3 className="text-1xl sm:text-5xl lg:text-3xl tracking-wide opacity-80">
          <TypeAnimation
            sequence={[
              'About My Journey', // Typing out "About My Journey"
              1000, // Pause for 1s after typing
            ]}
            wrapper="span"
            speed={30} // Speed of typing
            style={{ fontSize: '2em' }} // Style of the typed text
            repeat={false} // Do not repeat the animation
            className="neon-text" // Apply the neon text class
          />
        </h3>
      </motion.div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Past Card */}
        <motion.div
          custom={0} // Index for staggered animation
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="rounded-lg p-6 bg-gradient-to-br from-purple-900/20 to-transparent backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
        >
          <h3 className="text-2xl text-pink-500 mb-4">Past</h3>
          <p className="text-gray-300 leading-relaxed">
            I discovered my passion for programming when I was just 14 years old. What started as a hobby soon turned into a full-fledged passion for web development and software engineering. Over the years, I honed my skills in languages like Python, Java, and C++, as well as frameworks such as React and Flask. In my early days, I focused on building small projects and experimenting with various development tools and libraries. By taking on freelance projects, I also learned the importance of delivering high-quality, bug-free software in tight deadlines.
          </p>
        </motion.div>

        {/* Present Card */}
        <motion.div
          custom={1} // Index for staggered animation
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="rounded-lg p-6 bg-gradient-to-br from-red-800/20 to-transparent backdrop-blur-sm border border-orange-500/20 hover:border-red-500/40 transition-all duration-300"
        >
          <h3 className="text-2xl text-grey-500 mb-4">Present</h3>
          <p className="text-gray-300 leading-relaxed">
          Currently, I am pursuing my Bachelor's degree in Mechatronics Engineering at the University of Waterloo, where I maintain a 4.0 GPA and have received the prestigious President’s Scholarship of Distinction. I am also gaining hands-on experience as a Firmware Engineer intern at Midnight Sun Solar Race Team, where I work on large-scale, Solar Cars and prepare them for the annual FSGP.
          </p>
        </motion.div>

        {/* Future Card */}
        <motion.div
          custom={2} // Index for staggered animation
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="rounded-lg p-6 bg-gradient-to-br from-orange-700/20 to-transparent backdrop-blur-sm border border-orange-500/20 hover:border-yellow-500/40 transition-all duration-300"
        >
          <h3 className="text-2xl text-orange-500 mb-4">Future</h3>
          <p className="text-gray-300 leading-relaxed">
            Looking ahead, I am excited about the vast opportunities that lie in the fields of software development, AI, and embedded systems. I am committed to advancing my technical expertise in these areas, especially machine learning, web development, and hardware integration. In the near future, I aspire to work with innovative companies on projects that push the boundaries of technology. I aim to contribute to cutting-edge software solutions, work on impactful AI applications, and leverage my skills in embedded systems to create practical, real-world technologies.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;
