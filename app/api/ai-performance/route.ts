// app/api/ai-performance/route.ts
import { NextResponse } from 'next/server';
import { aiPerformanceMonitor } from '@/app/modules/utils/ai-performance-monitor';

export async function GET() {
  try {
    // Get performance summary
    const summary = aiPerformanceMonitor.getServicesSummary();
    const allMetrics = aiPerformanceMonitor.getAllMetrics();
    
    // Get detailed stats for each service
    const detailedStats: Record<string, any> = {};
    Object.keys(summary).forEach(serviceName => {
      detailedStats[serviceName] = aiPerformanceMonitor.getPerformanceStats(serviceName);
    });

    return NextResponse.json({
      success: true,
      summary,
      detailedStats,
      totalMetrics: allMetrics.length,
      metrics: allMetrics.slice(-100) // Last 100 metrics
    });
  } catch (error) {
    console.error('Error fetching AI performance metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI performance metrics' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    aiPerformanceMonitor.clearMetrics();
    return NextResponse.json({ success: true, message: 'AI performance metrics cleared' });
  } catch (error) {
    console.error('Error clearing AI performance metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear AI performance metrics' },
      { status: 500 }
    );
  }
}