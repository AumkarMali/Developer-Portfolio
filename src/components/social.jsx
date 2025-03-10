import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { TypeAnimation } from 'react-type-animation';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Social = () => {
  const [scrapedData, setScrapedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch data from Heroku API
        const response = await axios.get('https://devportfolio-socials-216dbdffc1c5.herokuapp.com/');
        console.log('API Response:', response.data); // Debugging the API response

        // Process API response data
        const data = [
          {
            title: 'Subscribers',
            value: parseInt(response.data.subscriber_count, 10) || 0,
            color: '#10B981',
            icon: '👥',
            description: 'People following your content',
          },
          {
            title: 'Total Views',
            value: parseInt(response.data.view_count, 10) || 0,
            color: '#3B82F6',
            icon: '👀',
            description: 'Total video views across channel',
          },
          {
            title: 'Total Videos',
            value: parseInt(response.data.video_count, 10) || 0,
            color: '#8B5CF6',
            icon: '📹',
            description: 'Published videos on channel',
          },
        ];

        setScrapedData(data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // IntersectionObserver logic for animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const chartData = {
    labels: scrapedData.map((data) => data.title),
    datasets: [
      {
        label: 'YouTube Channel Stats',
        data: scrapedData.map((data) => data.value),
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'YouTube Channel Stats',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const originalValue = scrapedData[index]?.value || 0;
            return `${context.label}: ${originalValue.toLocaleString()}`;
          },
        },
      },
    },
    cutout: '50%',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <div ref={sectionRef} className="text-center px-1 lg:px-40 mt-10 lg:mt-5 mb-10">
        <p><br /><br /><br /><br /></p>
        <h3 className="text-1xl sm:text-5xl lg:text-3xl tracking-wide opacity-80">
          {isVisible && (
            <TypeAnimation
              sequence={['Socials', 1000]}
              wrapper="span"
              speed={30}
              style={{ fontSize: '2em' }}
              repeat={false}
              className="neon-text"
            />
          )}
        </h3>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 w-full justify-center items-center">
          <div className="w-full lg:w-1/2 h-[500px] md:h-[550px] mb-10">
            <Pie data={chartData} options={chartOptions} />
          </div>

          <div className="w-full lg:w-1/3 space-y-6">
            {scrapedData.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-lg border cursor-pointer transition-all duration-300 transform hover:scale-105"
                style={{ borderColor: item.color }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold" style={{ color: item.color }}>
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Social;
