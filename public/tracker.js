(function() {
    const currentScript = document.currentScript;
    const projectId = new URLSearchParams(currentScript.src.split('?')[1]).get('projectId');
    
    // Store session start time
    let sessionStartTime = Date.now();
    let lastInteractionTime = Date.now();
    let pageLoadTime = 0;
    let actions = 0;
    let hasScrolled = false;
    
    // Calculate page load time
    if (window.performance) {
        const perfData = window.performance.timing;
        pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    }

    // Track user actions (clicks)
    document.addEventListener('click', () => {
        actions++;
        lastInteractionTime = Date.now();
    });

    // Track scrolling
    document.addEventListener('scroll', () => {
        if (!hasScrolled) {
            hasScrolled = true;
            lastInteractionTime = Date.now();
        }
    });

    // Calculate time on page before unload
    function getTimeOnPage() {
        return (Date.now() - sessionStartTime) / 1000; // Convert to seconds
    }

    // Calculate bounce (no interaction and less than 30 seconds)
    function calculateBounce() {
        return !hasScrolled && actions === 0 && getTimeOnPage() < 30;
    }

    function trackPageView() {
        // Basic metrics
        const data = {
            projectId: projectId,
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            
            // Performance metrics
            pageLoadTime: pageLoadTime / 1000, // Convert to seconds
            timeOnPage: getTimeOnPage(),
            bounced: calculateBounce(),
            
            // Interaction metrics
            actions: actions,
            hasScrolled: hasScrolled,
            
            // Session metrics
            sessionDuration: (Date.now() - sessionStartTime) / 1000,
            lastInteraction: (Date.now() - lastInteractionTime) / 1000,
            
            // Device info
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            platform: navigator.platform,
            
            // Page info
            title: document.title,
            path: window.location.pathname,
            
            // UTM parameters
            utm: {
                source: new URLSearchParams(window.location.search).get('utm_source'),
                medium: new URLSearchParams(window.location.search).get('utm_medium'),
                campaign: new URLSearchParams(window.location.search).get('utm_campaign')
            }
        };

        // Send data to your backend
        fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            keepalive: true
        }).catch(console.error);
    }

    trackPageView();

    window.addEventListener('beforeunload', () => {
        const finalData = {
            projectId: projectId,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            timeOnSite: getTimeOnPage(),
            bounced: calculateBounce(),
            actions: actions,
            sessionDuration: (Date.now() - sessionStartTime) / 1000
        };

        navigator.sendBeacon('/api/track/exit', JSON.stringify(finalData));
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            lastInteractionTime = Date.now();
        }
    });

    // Periodically update session data (every 30 seconds)
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            trackPageView();
        }
    }, 30000);
})();