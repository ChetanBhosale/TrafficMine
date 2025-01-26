// (function () {
//   async function getUserCurrentStatus(projectId) {
//     const USER_STORAGE_KEY = `analytics_user_${projectId}`;
//     const SESSION_STORAGE_KEY = `analytics_session_${projectId}`;
//     const SESSION_TIMEOUT = 30 * 60 * 1000;

//     function getOrCreateUserData() {
//       let userData = localStorage.getItem(USER_STORAGE_KEY);
      
//       if (userData) {
//         userData = JSON.parse(userData);
//         userData.lastSeen = new Date().toISOString();
//         userData.visitCount = (userData.visitCount || 0) + 1;
//       } else {
//         userData = {
//           userId: 'user_' + Math.random().toString(36).substring(2, 15),
//           firstSeen: new Date().toISOString(),
//           lastSeen: new Date().toISOString(),
//           visitCount: 1,
//         };
//       }
      
//       localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
//       return userData;
//     }

//     function getSessionId() {
//       let sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
      
//       if (sessionData) {
//         sessionData = JSON.parse(sessionData);
//         const lastActivity = new Date(sessionData.lastActivity).getTime();
//         const now = new Date().getTime();
        
//         if (now - lastActivity > SESSION_TIMEOUT) {
//           sessionData = createNewSession();
//         } else {
//           sessionData.lastActivity = new Date().toISOString();
//         }
//       } else {
//         sessionData = createNewSession();
//       }
      
//       sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
//       return sessionData.sessionId;
//     }

//     function createNewSession() {
//       return {
//         sessionId: 'session_' + Math.random().toString(36).substring(2, 15),
//         lastActivity: new Date().toISOString(),
//       };
//     }

//     let visitedPages = [window.location.pathname];
//     let userIP = null;
//     let currentSessionId = getSessionId();
//     let userData = getOrCreateUserData();
//     const startTime = Date.now();
//     const errors = [];

//     async function fetchUserIP() {
//       try {
//         const response = await fetch('https://api.ipify.org?format=json');
//         const data = await response.json();
//         return data.ip;
//       } catch (error) {
//         console.error('Error fetching IP address:', error);
//         return null;
//       }
//     }

//     function getDeviceInfo() {
//       const userAgent = navigator.userAgent;
//       const isMobile = /Mobi|Android/i.test(userAgent);
//       const isTablet = /Tablet|iPad/i.test(userAgent);
//       return {
//         deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
//         deviceModel: navigator.platform,
//         operatingSystem: navigator.platform,
//       };
//     }

//     function getBrowserInfo() {
//       const userAgent = navigator.userAgent;
//       let browserName = 'Unknown';
//       let browserVersion = 'Unknown';

//       if (userAgent.includes('Firefox')) browserName = 'Firefox', browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
//       else if (userAgent.includes('Edg')) browserName = 'Edge', browserVersion = userAgent.match(/Edg\/(\d+\.\d+)/)[1];
//       else if (userAgent.includes('Chrome')) browserName = 'Chrome', browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
//       else if (userAgent.includes('Safari')) browserName = 'Safari', browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)[1];
//       else if (userAgent.includes('Opera')) browserName = 'Opera', browserVersion = userAgent.match(/Opera\/(\d+\.\d+)/)[1];

//       return { browserName, browserVersion };
//     }

//     function getSource() {
//       const ref = document.referrer;
//       const utm = new URLSearchParams(window.location.search).get('utm_source');

//       if (utm) {
//         if (utm.includes('twitter')) return 'twitter';
//         if (utm.includes('fb') || utm.includes('facebook')) return 'facebook';
//         if (utm.includes('instagram')) return 'instagram';
//         if (utm.includes('linkedin')) return 'linkedin';
//         if (utm.includes('youtube')) return 'youtube';
//         if (utm.includes('reddit')) return 'reddit';
//         if (utm.includes('pinterest')) return 'pinterest';
//         if (utm.includes('tiktok')) return 'tiktok';
//         if (utm.includes('snapchat')) return 'snapchat';
//         if (utm.includes('google')) return 'search';
//         return 'referral';
//       }

//       if (!ref) return 'direct';

//       if (ref.includes('t.co')) return 'twitter';
//       if (ref.includes('facebook.com') || ref.includes('fb.me')) return 'facebook';
//       if (ref.includes('instagram.com')) return 'instagram';
//       if (ref.includes('linkedin.com')) return 'linkedin';
//       if (ref.includes('youtube.com')) return 'youtube';
//       if (ref.includes('reddit.com')) return 'reddit';
//       if (ref.includes('pinterest.com')) return 'pinterest';
//       if (ref.includes('tiktok.com')) return 'tiktok';
//       if (ref.includes('snapchat.com')) return 'snapchat';
//       if (ref.includes('google')) return 'search';
//       if (ref.includes('bing.com')) return 'search';
//       if (ref.includes('yahoo.com')) return 'search';

//       return 'referral';
//     }

//     function trackPageVisit() {
//       const currentPage = window.location.pathname;
//       if (!visitedPages.includes(currentPage)) visitedPages.push(currentPage);
//     }

//     const originalFetch = window.fetch;
//     window.fetch = async function (...args) {
//       const startTime = Date.now();
//       const request = {
//         url: args[0],
//         method: args[1]?.method || 'GET',
//         timestamp: new Date().toISOString(),
//         page: window.location.pathname,
//       };

//       try {
//         const response = await originalFetch(...args);
//         const endTime = Date.now();
//         const duration = endTime - startTime;

//         if (!response.ok) {
//           errors.push({
//             url: request.url,
//             method: request.method,
//             status: response.status,
//             response: await response.clone().json(),
//             timestamp: request.timestamp,
//             page: request.page,
//           });
//         }

//         return response;
//       } catch (error) {
//         errors.push({
//           url: request.url,
//           method: request.method,
//           status: 0,
//           response: error.message,
//           timestamp: request.timestamp,
//           page: request.page,
//         });
//         throw error;
//       }
//     };

//     const originalXHR = window.XMLHttpRequest;
//     window.XMLHttpRequest = function () {
//       const xhr = new originalXHR();
//       const startTime = Date.now();
//       let method, url;

//       xhr.open = function (...args) {
//         method = args[0];
//         url = args[1];
//         return originalXHR.prototype.open.apply(this, args);
//       };

//       xhr.send = function (body) {
//         return originalXHR.prototype.send.apply(this, arguments);
//       };

//       xhr.onload = function () {
//         const endTime = Date.now();
//         const duration = endTime - startTime;

//         if (xhr.status >= 400) {
//           errors.push({
//             url,
//             method,
//             status: xhr.status,
//             response: JSON.parse(xhr.responseText || '{}'),
//             timestamp: new Date().toISOString(),
//             page: window.location.pathname,
//           });
//         }
//       };

//       xhr.onerror = function () {
//         errors.push({
//           url,
//           method,
//           status: 0,
//           response: 'Network Error',
//           timestamp: new Date().toISOString(),
//           page: window.location.pathname,
//         });
//       };

//       return xhr;
//     };

//     async function sendInitialData() {
//       userIP = await fetchUserIP();
//       const deviceInfo = getDeviceInfo();
//       const browserInfo = getBrowserInfo();

//       const data = {
//         projectId,
//         timestamp: new Date().toISOString(),
//         source: getSource(),
//         duration: 0,
//         isActive: true,
//         isFinal: false,
//         page: window.location.href,
//         visitedPages,
//         ip: userIP,
//         deviceInfo,
//         browserInfo,
//         currentFlow: currentSessionId,
//         userId: userData.userId,
//         userMetadata: {
//           firstSeen: userData.firstSeen,
//           lastSeen: userData.lastSeen,
//           visitCount: userData.visitCount,
//           isReturningUser: userData.visitCount > 1
//         }
//       };

//       try {
//         const response = await fetch('http://localhost:3000/api/open/track', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(data),
//         });
//         const responseData = await response.json();
//         if (responseData?.data?.id) {
//           currentSessionId = responseData.data.id;
//           const sessionData = {
//             sessionId: currentSessionId,
//             lastActivity: new Date().toISOString()
//           };
//           sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
//         }
//       } catch (error) {
//         console.error('Error sending initial data:', error);
//       }
//     }

//     function sendFinalData() {
//       const duration = (Date.now() - startTime) / 1000;
//       const data = {
//         projectId,
//         timestamp: new Date().toISOString(),
//         source: getSource(),
//         duration,
//         isActive: false,
//         isFinal: true,
//         page: window.location.href,
//         visitedPages,
//         ip: userIP,
//         deviceInfo: getDeviceInfo(),
//         browserInfo: getBrowserInfo(),
//         currentFlow: currentSessionId,
//         userId: userData.userId,
//         userMetadata: {
//           firstSeen: userData.firstSeen,
//           lastSeen: userData.lastSeen,
//           visitCount: userData.visitCount,
//           isReturningUser: userData.visitCount > 1
//         },
//         errors
//       };

//       if (navigator.sendBeacon) {
//         navigator.sendBeacon('http://localhost:3000/api/open/track', JSON.stringify(data)).catch((error) => {
//           sessionStorage.removeItem(SESSION_STORAGE_KEY);
//           console.error('Error sending final data:', error);
//         });
//       } else {
//         fetch('http://localhost:3000/api/open/track', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(data),
//           keepalive: true,
//         }).catch((error) => {
//           sessionStorage.removeItem(SESSION_STORAGE_KEY);
//           console.error('Error sending final data:', error);
//         });
//       }

//       // Clear the currentFlow from sessionStorage
//       sessionStorage.removeItem(SESSION_STORAGE_KEY);
//     }

//     window.addEventListener('beforeunload', sendFinalData);
//     sendInitialData();

//     let lastUrl = window.location.href;
//     setInterval(() => {
//       if (lastUrl !== window.location.href) {
//         lastUrl = window.location.href;
//         trackPageVisit();
//       }
//     }, 500);

//     return { trackPageVisit };
//   }

//   const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
//   const projectId = params.get('projectId');
//   getUserCurrentStatus(projectId);
// })();


(function () {
  async function getUserCurrentStatus(projectId) {
    const USER_STORAGE_KEY = `analytics_user_${projectId}`;
    const SESSION_STORAGE_KEY = `analytics_session_${projectId}`;
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    // Function to get or create user data
    function getOrCreateUserData() {
      let userData = localStorage.getItem(USER_STORAGE_KEY);

      if (userData) {
        userData = JSON.parse(userData);
        userData.lastSeen = new Date().toISOString();
        userData.visitCount = (userData.visitCount || 0) + 1;
      } else {
        userData = {
          userId: 'user_' + Math.random().toString(36).substring(2, 15), // Unique user ID
          firstSeen: new Date().toISOString(), // Track first visit
          lastSeen: new Date().toISOString(),
          visitCount: 1,
        };
      }

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      return userData;
    }

    // Function to get or create session data
    function getSessionId() {
      let sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);

      if (sessionData) {
        sessionData = JSON.parse(sessionData);
        const lastActivity = new Date(sessionData.lastActivity).getTime();
        const now = new Date().getTime();

        // Check if session has expired
        if (now - lastActivity > SESSION_TIMEOUT) {
          sessionData = createNewSession(); // Create a new session if expired
        } else {
          sessionData.lastActivity = new Date().toISOString(); // Update last activity
        }
      } else {
        sessionData = createNewSession(); // Create a new session if none exists
      }

      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      return sessionData.sessionId;
    }

    // Function to create a new session
    function createNewSession() {
      return {
        sessionId: 'session_' + Math.random().toString(36).substring(2, 15), // Unique session ID
        lastActivity: new Date().toISOString(),
      };
    }

    // Track visited pages
    let visitedPages = [window.location.pathname];
    let userIP = null;
    let currentSessionId = getSessionId();
    let userData = getOrCreateUserData();
    const startTime = Date.now();
    const errors = [];

    // Fetch user IP address
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

      if (userAgent.includes('Firefox')) browserName = 'Firefox', browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
      else if (userAgent.includes('Edg')) browserName = 'Edge', browserVersion = userAgent.match(/Edg\/(\d+\.\d+)/)[1];
      else if (userAgent.includes('Chrome')) browserName = 'Chrome', browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
      else if (userAgent.includes('Safari')) browserName = 'Safari', browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)[1];
      else if (userAgent.includes('Opera')) browserName = 'Opera', browserVersion = userAgent.match(/Opera\/(\d+\.\d+)/)[1];

      return { browserName, browserVersion };
    }

    // Get traffic source
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
      if (!visitedPages.includes(currentPage)) visitedPages.push(currentPage);
    }

    // Send initial session data to the backend
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
        userId: userData.userId,
        userMetadata: {
          firstSeen: userData.firstSeen, // Send first visit timestamp
          lastSeen: userData.lastSeen,
          visitCount: userData.visitCount,
          isReturningUser: userData.visitCount > 1,
        },
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
          const sessionData = {
            sessionId: currentSessionId,
            lastActivity: new Date().toISOString(),
          };
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
        }
      } catch (error) {
        console.error('Error sending initial data:', error);
      }
    }

    // Send final session data to the backend
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
        userId: userData.userId,
        userMetadata: {
          firstSeen: userData.firstSeen, // Send first visit timestamp
          lastSeen: userData.lastSeen,
          visitCount: userData.visitCount,
          isReturningUser: userData.visitCount > 1,
        },
        errors,
      };

      if (navigator.sendBeacon) {
        navigator.sendBeacon('http://localhost:3000/api/open/track', JSON.stringify(data)).catch((error) => {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          console.error('Error sending final data:', error);
        });
      } else {
        fetch('http://localhost:3000/api/open/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true,
        }).catch((error) => {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          console.error('Error sending final data:', error);
        });
      }

      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }

    // Send initial data when the script loads
    sendInitialData();

    // Send final data when the user leaves the page
    window.addEventListener('beforeunload', sendFinalData);

    // Track page visits every 500ms
    let lastUrl = window.location.href;
    setInterval(() => {
      if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        trackPageVisit();
      }
    }, 500);

    return { trackPageVisit };
  }

  // Get project ID from the script URL
  const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
  const projectId = params.get('projectId');
  getUserCurrentStatus(projectId);
})();