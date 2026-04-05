"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Get device type
        const getDeviceType = () => {
          const width = window.innerWidth;
          if (width <= 768) return 'mobile';
          if (width <= 1024) return 'tablet';
          return 'desktop';
        };

        // Get country (simplified - in production use a geolocation service)
        const country = navigator.language.split('-')[1] || 'Unknown';

        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            country,
            deviceType: getDeviceType(),
          }),
        });
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
    };

    trackPageView();
  }, [pathname]);

  return null;
}