import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    isServiceWorkerAvailable: ('serviceWorker' in navigator),
    isPushManagerAvailable: ('PushManager' in window),
  }
});

export default app;
