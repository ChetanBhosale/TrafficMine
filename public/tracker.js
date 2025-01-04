(function () {
    // Core initialization
    const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
    const projectId = params.get('projectId'); // Get projectId from script URL
    const startTime = Date.now();
    let isActive = false;
    let visitedPages = [window.location.pathname]; // Initialize with the current page
    let lastActiveTime = startTime; // Track the last active time
    let inactiveStartTime = null; // Track when the user becomes inactive
  
    // Generate a unique visitorId or retrieve from cookie
    function getOrCreateVisitorId() {
      let visitorId = getCookie('visitorId');
      if (!visitorId) {
        visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
        setCookie('visitorId', visitorId, 365); // Store for 1 year
      }
      return visitorId;
    }
  
    // Simplified source detection
    function getSource() {
      const ref = document.referrer;
      const utm = new URLSearchParams(location.search).get('utm_source');
  
      // UTM source check
      if (utm) {
        if (utm.includes('fb') || utm.includes('instagram')) return 'social';
        if (utm.includes('google')) return 'search';
        return 'referral';
      }
  
      // Referrer check
      if (!ref) return 'direct';
      if (ref.match(/(facebook|twitter|linkedin|instagram|youtube|reddit)/)) return 'social';
      if (ref.includes('google')) return 'search';
      return 'referral';
    }
  
    // Track user activity
    function trackActivity() {
      isActive = true;
      lastActiveTime = Date.now(); // Update the last active time
    }
  
    // Track page visits
    function trackPageVisit() {
      const currentPage = window.location.pathname;
      if (!visitedPages.includes(currentPage)) {
        visitedPages.push(currentPage); // Add the new page to the visitedPages array
      }
    }
  
    // Listen for user interactions
    ['click', 'scroll'].forEach((event) => document.addEventListener(event, trackActivity, { passive: true }));
  
    // Listen for page changes (for Single Page Applications - SPAs)
    let lastUrl = window.location.href;
    setInterval(() => {
      if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        trackPageVisit(); // Track the new page
      }
    }, 500); // Check for URL changes every 500ms
  
    // Send data to the server
    let lastSent = 0;
    const SEND_INTERVAL = 30000; // 30 seconds
  
    function sendData(final = false) {
      const now = Date.now();
      if (!final && now - lastSent < SEND_INTERVAL) return;
  
      // Calculate session duration
      let sessionDuration = (now - startTime) / 1000; // Total duration in seconds
      if (inactiveStartTime !== null) {
        // Subtract the time the user was inactive
        sessionDuration -= (now - inactiveStartTime) / 1000;
      }
  
      const data = {
        projectId,
        visitorId: getOrCreateVisitorId(),
        timestamp: new Date().toISOString(),
        source: getSource(),
        duration: sessionDuration, // Adjusted session duration
        isActive,
        isFinal: final,
        page: window.location.href,
        visitedPages, // Send the array of visited pages
      };
  
      // Use Beacon API for final send (e.g., on page unload)
      if (final && navigator.sendBeacon) {
        navigator.sendBeacon('http://localhost:3000/api/open/track', JSON.stringify(data));
      } else {
        // Use Fetch API for regular sends
        fetch('http://localhost:3000/api/open/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true, // Ensure request completes even if page is closed
        }).catch(() => {});
      }
  
      lastSent = now;
    }
  
    // Handle background operation (e.g., tab visibility changes)
    let timer;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // User returned to the tab
        if (inactiveStartTime !== null) {
          // Subtract the inactive time from the session duration
          const now = Date.now();
          startTime += now - inactiveStartTime; // Adjust the start time
          inactiveStartTime = null; // Reset inactive start time
        }
        isActive = true; // User is active again
        if (!timer) {
          timer = setInterval(sendData, SEND_INTERVAL);
        }
      } else {
        // User left the tab
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        isActive = false; // User is inactive
        inactiveStartTime = Date.now(); // Track when the user became inactive
      }
    });
  
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(timer);
      sendData(true); // Send final data
    });
  
    // Initial send and start timer
    sendData();
    timer = setInterval(sendData, SEND_INTERVAL);
  
    // Helper functions for cookies
    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }
  
    function getCookie(name) {
      const cookie = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
      return cookie ? cookie.pop() : null;
    }
  })();