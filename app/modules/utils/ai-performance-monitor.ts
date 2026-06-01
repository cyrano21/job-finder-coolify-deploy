// app/modules/utils/ai-performance-monitor.ts
/**
 * AI Performance Monitoring Utility
 * Tracks response times, success rates, and error patterns for AI services
 */

interface AIPerformanceMetrics {
  serviceName: string;
  timestamp: number;
  responseTime: number; // in milliseconds
  success: boolean;
  error?: string;
  inputTokens?: number;
  outputTokens?: number;
  model?: string;
}

class AIPerformanceMonitor {
  private metrics: AIPerformanceMetrics[] = [];
  private readonly MAX_METRICS = 1000; // Limit to prevent memory issues

  /**
   * Record a performance metric for an AI service call
   */
  recordMetric(metric: Omit<AIPerformanceMetrics, 'timestamp'>): void {
    const fullMetric: AIPerformanceMetrics = {
      ...metric,
      timestamp: Date.now()
    };

    this.metrics.push(fullMetric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AI Performance] ${metric.serviceName}: ${metric.responseTime}ms ${metric.success ? '✓' : '✗'}`);
    }
  }

  /**
   * Get performance statistics for a specific service
   */
  getPerformanceStats(serviceName: string): {
    totalCalls: number;
    successRate: number;
    averageResponseTime: number;
    medianResponseTime: number;
    p95ResponseTime: number;
    errorCount: number;
    errors: string[];
  } {
    const serviceMetrics = this.metrics.filter(m => m.serviceName === serviceName);
    
    if (serviceMetrics.length === 0) {
      return {
        totalCalls: 0,
        successRate: 0,
        averageResponseTime: 0,
        medianResponseTime: 0,
        p95ResponseTime: 0,
        errorCount: 0,
        errors: []
      };
    }

    const successfulCalls = serviceMetrics.filter(m => m.success);
    const failedCalls = serviceMetrics.filter(m => !m.success);
    
    const responseTimes = serviceMetrics.map(m => m.responseTime).sort((a, b) => a - b);
    
    const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const medianResponseTime = responseTimes[Math.floor(responseTimes.length / 2)];
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p95ResponseTime = responseTimes[p95Index] || responseTimes[responseTimes.length - 1];
    
    const errors = failedCalls
      .map(m => m.error)
      .filter((error): error is string => error !== undefined)
      .slice(0, 10); // Limit to 10 most recent errors

    return {
      totalCalls: serviceMetrics.length,
      successRate: successfulCalls.length / serviceMetrics.length,
      averageResponseTime,
      medianResponseTime,
      p95ResponseTime,
      errorCount: failedCalls.length,
      errors
    };
  }

  /**
   * Get all metrics for a specific service
   */
  getMetricsForService(serviceName: string): AIPerformanceMetrics[] {
    return this.metrics.filter(m => m.serviceName === serviceName);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): AIPerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get summary of all services
   */
  getServicesSummary(): Record<string, { 
    totalCalls: number; 
    successRate: number; 
    averageResponseTime: number 
  }> {
    const services: Record<string, { 
      totalCalls: number; 
      successRate: number; 
      averageResponseTime: number;
      responseTimes: number[]
    }> = {};

    // Group metrics by service
    for (const metric of this.metrics) {
      if (!services[metric.serviceName]) {
        services[metric.serviceName] = {
          totalCalls: 0,
          successRate: 0,
          averageResponseTime: 0,
          responseTimes: []
        };
      }

      services[metric.serviceName].totalCalls++;
      services[metric.serviceName].responseTimes.push(metric.responseTime);
      
      if (metric.success) {
        services[metric.serviceName].successRate++;
      }
    }

    // Calculate averages
    const summary: Record<string, { 
      totalCalls: number; 
      successRate: number; 
      averageResponseTime: number 
    }> = {};

    for (const [serviceName, data] of Object.entries(services)) {
      summary[serviceName] = {
        totalCalls: data.totalCalls,
        successRate: data.successRate / data.totalCalls,
        averageResponseTime: data.responseTimes.reduce((sum, time) => sum + time, 0) / data.responseTimes.length
      };
    }

    return summary;
  }
}

// Create a singleton instance
export const aiPerformanceMonitor = new AIPerformanceMonitor();

// Utility function to wrap AI service calls with performance monitoring
export async function monitorAICall<T>(
  serviceName: string,
  call: () => Promise<T>,
  options: {
    model?: string;
    getInputTokens?: () => number;
    getOutputTokens?: () => number;
  } = {}
): Promise<T> {
  const startTime = Date.now();
  let success = false;
  let error: string | undefined;
  let inputTokens: number | undefined;
  let outputTokens: number | undefined;

  try {
    const result = await call();
    success = true;
    
    // Get token counts if functions provided
    if (options.getInputTokens) {
      inputTokens = options.getInputTokens();
    }
    if (options.getOutputTokens) {
      outputTokens = options.getOutputTokens();
    }

    return result;
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    throw err;
  } finally {
    const responseTime = Date.now() - startTime;
    
    aiPerformanceMonitor.recordMetric({
      serviceName,
      responseTime,
      success,
      error,
      inputTokens,
      outputTokens,
      model: options.model
    });
  }
}