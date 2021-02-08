import App from './App.svelte';

const shouldEnable = () => ('serviceWorker' in navigator) && ('PushManager' in window);

const app = new App({
  target: document.body,
  props: {
    isServiceWorker: shouldEnable(),
  }
});

export default app;
