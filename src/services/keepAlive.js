// Keep-alive service to prevent server cold starts
class KeepAliveService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.intervalId = null;
    this.isEnabled = true;
    this.pingInterval = 13 * 60 * 1000; // 13 minutes
    this.retryAttempts = 3;
  }

  // Start the keep-alive service
  start() {
    if (!this.isEnabled || this.intervalId) {
      return;
    }

    console.log('🚀 Keep-alive service started');
    
    // Initial ping
    this.ping();
    
    // Set up interval
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.pingInterval);

    // Also ping when page becomes visible (user returns)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.ping();
      }
    });
  }

  // Stop the keep-alive service
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ Keep-alive service stopped');
    }
  }

  // Ping the server to keep it alive
  async ping() {
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(`${this.apiUrl}/ping`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Keep-alive ping successful (attempt ${attempt}):`, data);
          return;
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.warn(`⚠️ Keep-alive ping failed (attempt ${attempt}/${this.retryAttempts}):`, error.message);
        
        if (attempt === this.retryAttempts) {
          console.error('❌ All keep-alive ping attempts failed');
        } else {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      if (response.ok) {
        const data = await response.json();
        console.log('🏥 Health check:', data);
        return data;
      }
    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
    return null;
  }

  // Enable/disable the service
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (enabled) {
      this.start();
    } else {
      this.stop();
    }
  }
}

// Create and export a singleton instance
const keepAliveService = new KeepAliveService();

export default keepAliveService;