import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Statistics = () => {
  const seller = JSON.parse(localStorage.getItem('seller'));
  const [auctions, setAuctions] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState(0);
  const [endedAuctions, setEndedAuctions] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const getAuctions = async () => {
    try {
      const response = await fetch('http://localhost:3000/bidvault/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellerId: seller._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuctions(data.auctions);
      } else {
        const msg = await response.json();
        toast.error(msg.msg || msg.Error || 'Failed to fetch auctions');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error! Please try again.');
    }
  };

  const fetchSellerData = async () => {
    try {
      const response = await fetch("http://localhost:3000/bidvault/sellerData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId: seller._id })
      });
      if (response.ok) {
        const data = await response.json();
        setSellerdata(data.sellerData);
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchSellerData();
    getAuctions();
  }, []);


  useEffect(() => {
    let liveCount = 0;
    let endedCount = 0;
    let totalRevenue = 0;

    auctions.forEach(auction => {
      if (auction.isLive) {
        liveCount++;
      } else if (auction.isEnded) {
        endedCount++;
      }
      totalRevenue += auction.commission || 0;
    });

    setLiveAuctions(liveCount);
    setEndedAuctions(endedCount);
    setRevenue(totalRevenue);
  }, [auctions]);

  // Pie Chart Data
  const pieData = {
    labels: ['Total Auctions', 'Live Auctions', 'Ended Auctions'],
    datasets: [{
      data: [auctions.length, liveAuctions, endedAuctions],
      backgroundColor: ['#3B82F6', '#10B981', '#EF4444'],
      hoverBackgroundColor: ['#2563EB', '#059669', '#DC2626'],
      borderWidth: 2,
      borderColor: '#fff',
    }]
  };

  // Bar Chart Data for Recent Activity
  const recentAuctions = auctions.slice(0, 3); // Get last 3 auctions
  const barData = {
    labels: recentAuctions.map(a => `${a.title || 'N/A'}`),
    datasets: [{
      label: 'Commission Amounts',
      data: recentAuctions.map(a => a.commission || 0),
      backgroundColor: '#8B5CF6',
      borderColor: '#7C3AED',
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Welcome: <i>{seller.username}</i></h1>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Auction Statistics</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-200">
          <h2 className="text-xl font-semibold text-blue-800">Total Auctions</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{auctions.length}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-200">
          <h2 className="text-xl font-semibold text-green-800">Live Auctions</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{liveAuctions}</p>
        </div>
        <div className="bg-red-100 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-200">
          <h2 className="text-xl font-semibold text-red-800">Ended Auctions</h2>
          <p className="text-4xl font-bold text-red-600 mt-2">{endedAuctions}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Auction Distribution</h2>
          <div className="max-w-md mx-auto">
            <Pie 
              data={pieData}
              options={{
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: { backgroundColor: '#1F2937', bodyFont: { size: 14 } }
                },
                maintainAspectRatio: false,
              }}
              height={300}
            />
          </div>
        </div>

        {/* Revenue Section */}
        <div className="bg-purple-100 p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-purple-800">Total Revenue</h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">Rs.{revenue.toFixed(2)}</p>
          <p className="text-sm text-purple-700 mt-1">From ended auctions</p>
        </div>
      </div>

      {/* Recent Activity with Bar Chart */}
      <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-3">
            {recentAuctions.map(auction => (
              <li key={auction._id} className="p-3 bg-gray-100 rounded-lg">
                {auction.title} - Commission: Rs.{auction.commission?.toFixed(2) || '0.00'}
              </li>
            ))}
          </ul>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: '#1F2937' }
                },
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: 'Commission (Rs.)' } },
                  x: { title: { display: true, text: 'Auctions' } }
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Statistics;