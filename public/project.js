(function () {
  const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
  const projectId = params.get('projectId'); // Get projectId from script URL
  const startTime = Date.now(); // Track the start time of the session
  let visitedPages = [window.location.pathname]; // Track visited pages
  let userIP = null; // Store the user's IP address
  let currentSessionId = null; // Store the current session ID

  // Fetch the user's IP address
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

  // Generate a unique visitorId or retrieve from cookie
  function getOrCreateVisitorId() {
    let visitorId = getCookie('visitorId');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
      setCookie('visitorId', visitorId, 365); // Store for 1 year
    }
    return visitorId;
  }

  // Get device information
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

  // Get browser information
  function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (userAgent.includes('Firefox')) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
    } else if (userAgent.includes('Edg')) {
      browserName = 'Edge';
      browserVersion = userAgent.match(/Edg\/(\d+\.\d+)/)[1];
    } else if (userAgent.includes('Chrome')) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
    } else if (userAgent.includes('Safari')) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)[1];
    } else if (userAgent.includes('Opera')) {
      browserName = 'Opera';
      browserVersion = userAgent.match(/Opera\/(\d+\.\d+)/)[1];
    }

    return {
      browserName,
      browserVersion,
    };
  }

  // Simplified source detection
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

  // Track page visits
  function trackPageVisit() {
    const currentPage = window.location.pathname;
    if (!visitedPages.includes(currentPage)) {
      visitedPages.push(currentPage);
    }
  }

  // Listen for page changes (for Single Page Applications - SPAs)
  let lastUrl = window.location.href;
  setInterval(() => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      trackPageVisit();
    }
  }, 500);

  // Send initial data when the user arrives on the page
  async function sendInitialData() {
    userIP = await fetchUserIP();
    const deviceInfo = getDeviceInfo();
    const browserInfo = getBrowserInfo();
    const visitorId = getOrCreateVisitorId();

    const data = {
      projectId,
      visitorId,
      timestamp: new Date().toISOString(),
      source: getSource(),
      duration: 0, // Initial duration is 0
      isActive: true,
      isFinal: false,
      page: window.location.href,
      visitedPages,
      ip: userIP,
      deviceInfo,
      browserInfo,
      currentFlow: null, // No currentFlow for the initial call
    };

    console.log('data')
    try {
    if(currentSessionId === null){
      const response = await fetch('http://localhost:3000/api/open/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if(currentSessionId === null){
        if (responseData?.data?.id) {
          currentSessionId = responseData.data.id;
        }
      }
    }
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }
  

  // Send final data when the user leaves the page
  function sendFinalData() {
    const duration = (Date.now() - startTime) / 1000; // Calculate total session duration
    const data = {
      projectId,
      visitorId: getOrCreateVisitorId(),
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
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon('http://localhost:3000/api/open/track', JSON.stringify(data));
    } else {
      fetch('http://localhost:3000/api/open/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch((error) => {
        console.error('Error sending final data:', error);
      });
    }
  }

  // Attach the final data send to the beforeunload event
  window.addEventListener('beforeunload', sendFinalData);

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

  // Send initial data when the script loads
  sendInitialData();
})();