import { useState } from 'react';
import Navbar from "./components/Navbar";
import Intro from "./components/introductionPage";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Projects from "./components/projectTimeline";
import Social from "./components/social";
import About from "./components/about";
import LoadingPage from './components/load';
import Background from './components/Background';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingPage onLoadingComplete={handleLoadingComplete} />
      ) : (
        <Background>
          <div className="min-h-screen bg-transparent">
            <Navbar />
            <HeroSection />
            <About />
            <Intro />
            <Projects />
            <Social />
            <Footer />
          </div>
        </Background>
      )}
    </>
  );
};

export default App;
