import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import nProgress from 'nprogress';


export const useNProgress = () => {
  const router = useRouter();

  nProgress.configure({
    showSpinner: false
  })

  useEffect(() => {
    router.subscribe("onBeforeLoad", () => {
      nProgress.start()
    })

    router.subscribe("onLoad", () => {
      nProgress.done()
    })
  }, [router]);
};
