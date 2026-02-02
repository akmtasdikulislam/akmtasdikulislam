import { supabase } from '@/integrations/supabase/client';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const location = useLocation();
  const sessionStarted = useRef<boolean>(false);
  const sessionId = useRef<string>(Math.random().toString(36).substring(2, 15));

  useEffect(() => {
    const trackPageView = async () => {
      // Calculate performance metrics
      let loadTime = 0;
      if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        loadTime = perfData.loadEventEnd - perfData.navigationStart;
      }

      try {
        await supabase.from('analytics_visitor_logs').insert({
          page_path: location.pathname,
          referrer: document.referrer || 'Direct',
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          load_time_ms: loadTime > 0 ? loadTime : null,
          session_id: sessionId.current
        });
      } catch (error) {
        console.error('Failed to log analytics:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);

  return null;
};
