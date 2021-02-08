<script>
  import {
    onMount,
  } from 'svelte';
  import SendIcon from './icons/SendIcon.svelte';
  import {
    PermissionResults,
  } from './constants/PermissionResults.mjs';
  import {
    ApplicationServerKeys,
  } from './constants/ApplicationServerKeys.mjs';
  import {
    urlBase64ToUint8Array,
  } from './helpers/urlBase64ToUint8Array.mjs';

  export let isServiceWorker = false;
  let shouldEnableControls = true;
  let swRegistration = null;
  let permissionResult = null;
  let subscriptionResult = null;


  $: if (subscriptionResult) {
    console.log('subscriptionResult:', subscriptionResult);
  }

  $: if (permissionResult === PermissionResults.granted) {
    subscribeToPushNotifications();
  }

  $: shouldEnableControls = isServiceWorker && swRegistration && permissionResult === PermissionResults.granted;

  $: if (swRegistration !== null) {
    console.debug('swRegistration:', swRegistration);

    askForPermission();
  }

  const subscribeToPushNotifications = async () => {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(ApplicationServerKeys.pk),
    };

    subscriptionResult = await swRegistration.pushManager.subscribe(subscribeOptions) ?? null;
  };

  const registerServiceWorker = async () => {
    return navigator.serviceWorker.register('/service-worker.mjs');
  };

  const askForPermission = async () => {
    permissionResult = await Notification.requestPermission();
  };

  const handleSubmit = () => {
    console.debug('handleSubmit');
  };

  onMount(async () => {
    if (isServiceWorker === true) {
      swRegistration = await registerServiceWorker();
    }
  });
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    flex: 1 0 100%;
    justify-content: center;
    align-items: center;
    background-color: hsl(0deg 0% 86%);
  }

  form {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 3fr 1fr;
    grid-gap: min(1vw, 1vh);

    padding: min(1vw, 1vh) max(1vw, 1.5vh);

    background-color: hsl(0deg 0% 100% / 85%);
    filter: drop-shadow(0px 0px 15px hsl(0deg 0% 66%));
    width: 20vw;
  }

  label {
    align-items: center;
    display: flex;
    font-size: 2.5rem;
    font-variant: small-caps;
    font-weight: 300;
    justify-content: center;
    text-transform: uppercase;
    color: hsl(0, 0%, 60%);
  }

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .row:last-of-type {
    margin: 1vh 0;
  }

  .message,
  .submit {
    pointer-events: all;
  }

  .message {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    user-select: all;
    resize: none;

    background-color: hsl(0deg 0% 90% / 75%);
    font-size: 1.5rem;
  }

  .submit {
    align-self: center;
    background-color: hsl(219, 79%, 66%);
    color: hsl(0, 0%, 100%);
    cursor: pointer;
    font-size: 1.75rem;
    font-variant: small-caps;
    font-weight: 300;
    line-height: 3vh;
    margin: 0;
    padding: 0.75vh;
    text-transform: lowercase;
    width: 5vw;
    border: 1px solid transparent;
  }

  .submit:active {
    background-color: hsl(33deg 79% 66%);
    box-shadow: inset 0px 0px 10px 10px hsl(33deg 79% 60%);
    border: 1px solid hsl(33deg 79% 36%);
  }
</style>

<main>
  <form id='web-push-experiment-form' on:submit|preventDefault|stopPropagation={handleSubmit}>
    <label for='web-push-experiment-form'>Web Push Experiment {shouldEnableControls === false ? 'impossible' : ''}</label>
    <div class='row'>
      <textarea
        class='message'
        cols='auto'
        maxlength='1024'
        name='message'
        required
        rows='10'
        type='text'
        disabled={shouldEnableControls === false}
      ></textarea>
    </div>
    <div class='row'>
      <button
        type='submit'
        class='submit'
        disabled={shouldEnableControls === false}
      >
        <SendIcon />
      </button>
    </div>
  </form>
</main>
