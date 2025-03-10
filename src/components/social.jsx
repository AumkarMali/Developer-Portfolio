import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2'; // Import Pie chart from chart.js
import { TypeAnimation } from 'react-type-animation'; // Import TypeAnimation component
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register required chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Social = () => {
  const [scrapedData, setScrapedData] = useState([]);
  const [loading, setLoading] = useState(true);  // Initially loading is true
  const [error, setError] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = React.useRef(null); // This will be used to detect when the section becomes visible

  // Automatically fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);  // Set loading to true before fetching
      setError(null);  // Reset error

      try {
        // Make a GET request to your Heroku backend (API) to fetch stats
        const response = await axios.get('https://dashboard.heroku.com/apps/devportfolio-socials/deploy/github');
        
        // Log the entire response to the console for debugging
        console.log('Response from API:', response.data);

        // Assuming the API returns the data in the same format
        const data = [
          {
            title: 'Subscribers',
            value: response.data.subscriber_count,  // Keep original value
            color: '#10B981',
            icon: '👥',
            description: 'People following your content'
          },
          {
            title: 'Total Views',
            value: response.data.view_count,  // Keep original value
            color: '#3B82F6',
            icon: '👀',
            description: 'Total video views across channel'
          },
          {
            title: 'Total Videos',
            value: response.data.video_count,  // Keep original value
            color: '#8B5CF6',
            icon: '📹',
            description: 'Published videos on channel'
          }
        ];

        // Set the scraped data
        setScrapedData(data);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error:', err);
      } finally {
        setLoading(false);  // Stop loading when data is fetched or error occurs
      }
    };

    fetchData();  // Automatically fetch data when the component mounts

    // IntersectionObserver logic to handle title animation when section is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);  // Empty dependency array means this effect runs only once when the component is first mounted

  // Prepare the chart data for Pie Chart
  const chartData = {
    labels: scrapedData.map(data => data.title), // Labels for pie chart
    datasets: [
      {
        label: 'YouTube Channel Stats',
        data: scrapedData.map(data => {
          // Scale values for Pie chart display
          if (data.title === 'Subscribers') return data.value / 100;    // Scale Subscribers
          if (data.title === 'Total Views') return data.value / 100000;  // Scale Views
          return data.value;  // Don't scale Total Videos
        }),
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',   // Color for Subscribers
          'rgba(255, 99, 132, 0.5)',   // Color for Total Views
          'rgba(153, 102, 255, 0.5)',  // Color for Total Videos
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',     // Border for Subscribers
          'rgba(255, 99, 132, 1)',     // Border for Total Views
          'rgba(153, 102, 255, 1)',    // Border for Total Videos
        ],
        borderWidth: 1,
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  // Allow the chart to scale within its container
    plugins: {
      title: {
        display: true,
        text: 'YouTube Channel Stats'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            // Show original values in tooltips
            const index = context.dataIndex;
            const originalValue = scrapedData[index].value;
            return `${context.label}: ${originalValue}`;
          }
        }
      },
    },
    cutout: '50%'  // Hollow the inside of the pie chart to create a donut chart
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      {/* Title Section */}
      <div ref={sectionRef} className="text-center px-1 lg:px-40 mt-10 lg:mt-5 mb-10">
        <p><br /><br /><br /><br /></p>
        <h3 className="text-1xl sm:text-5xl lg:text-3xl tracking-wide opacity-80">
          {isVisible && (
            <TypeAnimation
              sequence={[
                'Socials', // Typing out "Socials"
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

      {/* Main Content - Pie Chart and Widgets */}
      <div className="flex flex-col lg:flex-row gap-8 w-full justify-center items-center">
        {/* Pie chart on left */}
        <div className="w-full lg:w-1/2 h-[500px] md:h-[550px] mb-10">
          {scrapedData.length > 0 && (
            <Pie data={chartData} options={chartOptions} />
          )}
        </div>

        {/* Stats widgets on right */}
        <div className="w-full lg:w-1/3 space-y-6">
          {scrapedData.map((item, index) => (
            <div
              key={item.title}
              className={`p-6 rounded-lg border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                item.color === '#10B981' ? 'border-green-500' :
                item.color === '#3B82F6' ? 'border-blue-500' : 'border-purple-500'
              }`}
              style={{
                borderColor: item.color,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold" style={{ color: item.color }}>
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Social;
