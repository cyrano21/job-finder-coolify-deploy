// app/modules/admin/components/AIPerformanceDashboard.tsx
'use client';

import { useState, useEffect } from 'react';

interface AIPerformanceData {
  summary: Record<string, { 
    totalCalls: number; 
    successRate: number; 
    averageResponseTime: number 
  }>;
  detailedStats: Record<string, {
    totalCalls: number;
    successRate: number;
    averageResponseTime: number;
    medianResponseTime: number;
    p95ResponseTime: number;
    errorCount: number;
    errors: string[];
  }>;
  totalMetrics: number;
  metrics: Array<{
    serviceName: string;
    timestamp: number;
    responseTime: number;
    success: boolean;
    error?: string;
  }>;
}

export default function AIPerformanceDashboard() {
  const [performanceData, setPerformanceData] = useState<AIPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-performance');
      const data = await response.json();
      
      if (data.success) {
        setPerformanceData(data);
      } else {
        setError(data.error || 'Failed to fetch performance data');
      }
    } catch (err) {
      setError('Failed to connect to performance API');
      console.error('Error fetching AI performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearMetrics = async () => {
    try {
      const response = await fetch('/api/ai-performance', { method: 'DELETE' });
      const data = await response.json();
      
      if (data.success) {
        await fetchPerformanceData();
      } else {
        setError(data.error || 'Failed to clear metrics');
      }
    } catch (err) {
      setError('Failed to clear metrics');
      console.error('Error clearing AI performance metrics:', err);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
    
    const interval = setInterval(fetchPerformanceData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h3 className="text-red-800 font-medium">Error</h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <button
            onClick={fetchPerformanceData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No performance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Performance Dashboard</h2>
        <div className="flex space-x-3">
          <button
            onClick={fetchPerformanceData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={clearMetrics}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Data
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Calls</h3>
              <p className="text-2xl font-semibold text-gray-900">{performanceData.totalMetrics}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {(Object.values(performanceData.summary).reduce((sum, service) => sum + service.successRate, 0) /
                 Object.keys(performanceData.summary).length * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Avg Response Time</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {(Object.values(performanceData.summary).reduce((sum, service) => sum + service.averageResponseTime, 0) /
                 Object.keys(performanceData.summary).length).toFixed(0)}ms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Performance */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Service Performance</h3>
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(performanceData.detailedStats).map(([serviceName, stats]) => (
            <div key={serviceName} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900">{serviceName}</h4>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCalls}</p>
                    <p className="text-sm text-gray-500">Total Calls</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{(stats.successRate * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.averageResponseTime.toFixed(0)}ms</p>
                    <p className="text-sm text-gray-500">Avg Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{stats.p95ResponseTime.toFixed(0)}ms</p>
                    <p className="text-sm text-gray-500">95th Percentile</p>
                  </div>
                </div>
                
                {stats.errorCount > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Recent Errors ({stats.errorCount})</h5>
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-32 overflow-y-auto">
                      <ul className="text-sm text-red-700 space-y-1">
                        {stats.errors.slice(0, 5).map((error, index) => (
                          <li key={index} className="truncate" title={error}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Metrics */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Metrics</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData.metrics.slice(-20).map((metric, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{metric.serviceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{metric.responseTime}ms</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {metric.success ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Success
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Error
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}