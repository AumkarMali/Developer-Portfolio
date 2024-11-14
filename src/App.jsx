import  { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import Intro from "./components/introductionPage";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Projects from "./components/projectTimeline";
import Social from "./components/social";
import About from "./components/about";
import LoadingPage from './components/load';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <Navbar />
          <HeroSection />
          <About />
          <Intro />
          <Projects />
          <Social />
          <Footer />
        </>
      )}
    </>
  );
};

export default App;
