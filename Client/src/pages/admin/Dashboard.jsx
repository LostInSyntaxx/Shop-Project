import React from 'react';
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faShoppingCart,
  faUsers,
  faMoneyBillWave,
  faBoxOpen,
  faClock,
  faArrowUp,
  faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { orders, products, users } = useShopStore();

  // Sample data - replace with your actual data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12000, 19000, 3000, 5000, 2000, 30000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const productData = {
    labels: ['Electronics', 'Clothing', 'Food', 'Home', 'Other'],
    datasets: [
      {
        label: 'Products by Category',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(244, 63, 94, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderWidth: 0,
        borderRadius: 6
      }
    ]
  };

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <FontAwesomeIcon icon={faClock} className="mr-2" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
  icon={faChartLine}
  title="Total Sales"
  value={`$${(orders?.reduce((acc, order) => acc + (order?.total || 0), 0) || 0).toFixed(2)}`}
  change="+12% from last month"
  trend="up"
  color="bg-indigo-100 dark:bg-indigo-900/30"
  iconColor="text-indigo-600 dark:text-indigo-300"
/>
<StatCard 
  icon={faShoppingCart}
  title="Total Orders"
  value={orders?.length || 0}
  change="+8% from last month"
  trend="up"
  color="bg-green-100 dark:bg-green-900/30"
  iconColor="text-green-600 dark:text-green-300"
/>
<StatCard 
  icon={faUsers}
  title="Total Customers"
  value={users?.length || 0}
  change="+5% from last month"
  trend="up"
  color="bg-purple-100 dark:bg-purple-900/30"
  iconColor="text-purple-600 dark:text-purple-300"
/>
        <StatCard 
          icon={faBoxOpen}
          title="Total Products"
          value={products?.length || 0}
          change="+15% from last month"
          trend="up"
          color="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-300"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Overview</h2>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </div>
          <div className="h-72">
            <Line 
              data={salesData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                },
                scales: {
                  y: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Products by Category</h2>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </div>
          <div className="h-72">
            <Bar 
              data={productData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                },
                scales: {
                  y: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${order.amount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center justify-center">
                      <FontAwesomeIcon icon={faShoppingCart} className="text-3xl mb-3" />
                      <p className="text-sm">No recent orders found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, title, value, change, trend, color, iconColor }) => {
  return (
    <div className={`${color} p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{value}</h3>
          <div className="flex items-center">
            <span className={`text-xs font-medium ${
              trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
              {change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <FontAwesomeIcon icon={icon} className="text-lg" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;