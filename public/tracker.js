(function () {
  async function getUserCurrentStatus(projectId) {
    let visitedPages = [window.location.pathname];
    let userIP = null;
    let currentSessionId = getSessionId();
    let userId = getOrCreateUserId();
    const startTime = Date.now();
    const errors = [];

    async function fetchUserIP() {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
      }
    }

    function getDeviceInfo() {
      const userAgent = navigator.userAgent;
      const isMobile = /Mobi|Android/i.test(userAgent);
      const isTablet = /Tablet|iPad/i.test(userAgent);
      return {
        deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
        deviceModel: navigator.platform,
        operatingSystem: navigator.platform,
      };
    }

    function getBrowserInfo() {
      const userAgent = navigator.userAgent;
      let browserName = 'Unknown';
      let browserVersion = 'Unknown';

      if (userAgent.includes('Firefox')) browserName = 'Firefox', browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
      else if (userAgent.includes('Edg')) browserName = 'Edge', browserVersion = userAgent.match(/Edg\/(\d+\.\d+)/)[1];
      else if (userAgent.includes('Chrome')) browserName = 'Chrome', browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
      else if (userAgent.includes('Safari')) browserName = 'Safari', browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)[1];
      else if (userAgent.includes('Opera')) browserName = 'Opera', browserVersion = userAgent.match(/Opera\/(\d+\.\d+)/)[1];

      return { browserName, browserVersion };
    }

    function getSource() {
      const ref = document.referrer;
      const utm = new URLSearchParams(window.location.search).get('utm_source');

      if (utm) {
        if (utm.includes('twitter')) return 'twitter';
        if (utm.includes('fb') || utm.includes('facebook')) return 'facebook';
        if (utm.includes('instagram')) return 'instagram';
        if (utm.includes('linkedin')) return 'linkedin';
        if (utm.includes('youtube')) return 'youtube';
        if (utm.includes('reddit')) return 'reddit';
        if (utm.includes('pinterest')) return 'pinterest';
        if (utm.includes('tiktok')) return 'tiktok';
        if (utm.includes('snapchat')) return 'snapchat';
        if (utm.includes('google')) return 'search';
        return 'referral';
      }

      if (!ref) return 'direct';

      if (ref.includes('t.co')) return 'twitter';
      if (ref.includes('facebook.com') || ref.includes('fb.me')) return 'facebook';
      if (ref.includes('instagram.com')) return 'instagram';
      if (ref.includes('linkedin.com')) return 'linkedin';
      if (ref.includes('youtube.com')) return 'youtube';
      if (ref.includes('reddit.com')) return 'reddit';
      if (ref.includes('pinterest.com')) return 'pinterest';
      if (ref.includes('tiktok.com')) return 'tiktok';
      if (ref.includes('snapchat.com')) return 'snapchat';
      if (ref.includes('google')) return 'search';
      if (ref.includes('bing.com')) return 'search';
      if (ref.includes('yahoo.com')) return 'search';

      return 'referral';
    }

    function trackPageVisit() {
      const currentPage = window.location.pathname;
      if (!visitedPages.includes(currentPage)) visitedPages.push(currentPage);
    }

    function storeSessionId(sessionId) {
      localStorage.setItem('sessionId', sessionId);
    }

    function getSessionId() {
      return localStorage.getItem('sessionId');
    }

    function getOrCreateUserId() {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('userId', userId);
      }
      return userId;
    }

    // Intercept fetch requests to track errors
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const startTime = Date.now();
      const request = {
        url: args[0],
        method: args[1]?.method || 'GET',
        timestamp: new Date().toISOString(),
        page: window.location.pathname, // Track the current page
      };

      try {
        const response = await originalFetch(...args);
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Capture errors (4xx or 5xx status codes)
        if (!response.ok) {
          errors.push({
            url: request.url, // Request URL
            method: request.method, // HTTP method
            status: response.status, // Status code
            response: await response.clone().json(), // Error response
            timestamp: request.timestamp, // Time of the request
            page: request.page, // Current page
          });
        }

        return response;
      } catch (error) {
        // Capture network errors
        errors.push({
          url: request.url, // Request URL
          method: request.method, // HTTP method
          status: 0, // Status code for network errors
          response: error.message, // Error message
          timestamp: request.timestamp, // Time of the request
          page: request.page, // Current page
        });
        throw error;
      }
    };

    // Intercept XMLHttpRequest requests to track errors
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
      const xhr = new originalXHR();
      const startTime = Date.now();
      let method, url;

      xhr.open = function (...args) {
        method = args[0];
        url = args[1];
        return originalXHR.prototype.open.apply(this, args);
      };

      xhr.send = function (body) {
        return originalXHR.prototype.send.apply(this, arguments);
      };

      xhr.onload = function () {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Capture errors (4xx or 5xx status codes)
        if (xhr.status >= 400) {
          errors.push({
            url, // Request URL
            method, // HTTP method
            status: xhr.status, // Status code
            response: JSON.parse(xhr.responseText || '{}'), // Error response
            timestamp: new Date().toISOString(), // Time of the request
            page: window.location.pathname, // Current page
          });
        }
      };

      xhr.onerror = function () {
        // Capture network errors
        errors.push({
          url, // Request URL
          method, // HTTP method
          status: 0, // Status code for network errors
          response: 'Network Error', // Error message
          timestamp: new Date().toISOString(), // Time of the request
          page: window.location.pathname, // Current page
        });
      };

      return xhr;
    };

    async function sendInitialData() {
      userIP = await fetchUserIP();
      const deviceInfo = getDeviceInfo();
      const browserInfo = getBrowserInfo();

      const data = {
        projectId,
        timestamp: new Date().toISOString(),
        source: getSource(),
        duration: 0,
        isActive: true,
        isFinal: false,
        page: window.location.href,
        visitedPages,
        ip: userIP,
        deviceInfo,
        browserInfo,
        currentFlow: currentSessionId,
        userId,
      };

      try {
        const response = await fetch('http://localhost:3000/api/open/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (responseData?.data?.id) {
          currentSessionId = responseData.data.id;
          storeSessionId(currentSessionId);
        }
      } catch (error) {
        console.error('Error sending initial data:', error);
      }
    }

    function sendFinalData() {
      const duration = (Date.now() - startTime) / 1000;
      const data = {
        projectId,
        timestamp: new Date().toISOString(),
        source: getSource(),
        duration,
        isActive: false,
        isFinal: true,
        page: window.location.href,
        visitedPages,
        ip: userIP,
        deviceInfo: getDeviceInfo(),
        browserInfo: getBrowserInfo(),
        currentFlow: currentSessionId,
        userId,
        errors, // Include all collected errors in the final data
      };

      if (navigator.sendBeacon) {
        navigator.sendBeacon('http://localhost:3000/api/open/track', JSON.stringify(data));
      } else {
        fetch('http://localhost:3000/api/open/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true,
        }).catch((error) => console.error('Error sending final data:', error));
      }
    }

    window.addEventListener('beforeunload', sendFinalData);
    sendInitialData();

    let lastUrl = window.location.href;
    setInterval(() => {
      if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        trackPageVisit();
      }
    }, 500);

    return { trackPageVisit };
  }

  const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
  const projectId = params.get('projectId');
  getUserCurrentStatus(projectId);
})();