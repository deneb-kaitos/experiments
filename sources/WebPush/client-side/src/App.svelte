<script>
  import {
    onMount,
    onDestroy,
  } from 'svelte';
  import SendIcon from './icons/SendIcon.svelte';
  import AskForPermissions from './components/AskForPermissions.svelte';
  import PermissionsDenied from './components/PermissionsDenied.svelte';
  import {
    RegisterWebPushService,
  } from './xstate/RegisterWebPushService.mjs';
  import {
    isRequirementsCollectedGuard,
  } from './xstate/guards/isRequirementsCollectedGuard.mjs';
  import {
    isRequirementsValidGuard,
  } from './xstate/guards/isRequirementsValidGuard.mjs';
  import {
    isPushNotificationPermissionsGranted,
  } from './xstate/guards/isPushNotificationPermissionsGranted.mjs';
  import {
    isServerWorkerRegistered,
  } from './xstate/guards/isServerWorkerRegistered.mjs';
  import {
    isPushNotificationSubscriptionValid,
  } from './xstate/guards/isPushNotificationSubscriptionValid.mjs';
  import {
    isNotificationPermissionsDenied,
  } from './xstate/guards/isNotificationPermissionsDenied.mjs';
  import {
    isExistingNotificationPermissionDefault,
  } from './xstate/guards/isExistingNotificationPermissionDefault.mjs';
  import {
    isExistingNotificationPermissionDenied,
  } from './xstate/guards/isExistingNotificationPermissionDenied.mjs';
  import {
    isExistingNotificationPermissionGranted,
  } from './xstate/guards/isExistingNotificationPermissionGranted.mjs'
  import {
    urlBase64ToUint8Array,
  } from './helpers/urlBase64ToUint8Array.mjs';
  import {
    PermissionResults,
  } from './constants/PermissionResults.mjs';


  export let isServiceWorkerAvailable = null;
  export let isPushManagerAvailable = null;

  let subscriptionJSON = null;
  let pushNotificationPermissions = window.Notification.permission;
  let notificationPermissionListener = null;

  $: shouldAskForPermissions = window.Notification.permission === PermissionResults.default || subscriptionJSON === null;

  const loadServerKeys = async () => {
    const response = await fetch('/server-keys.json', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  };

  const RegisterWebPushServiceConfig = Object.freeze({
    actions: {
        logContext: (ctx, event) => {
          console.log(`< ${event.type} >`, ctx);
        },
        resolveServiceWorkerAvailable: (ctx, evt) => {
          registerWebPushService.send({
            type: 'SetServiceWorkerAvailable',
            payload: {
              value: isServiceWorkerAvailable,
            },
          });
        },
        resolvePushManagerAvailable: (ctx, evt) => {
          registerWebPushService.send({
            type: 'SetPushManagerAvailable',
            payload: {
              value: isPushManagerAvailable,
            },
          });
        },
        requestExistingNotificationPermissions: (ctx, evt) => {
          registerWebPushService.send({
            type: 'SetExistingNotificationPermissions',
            payload: {
              value: window.Notification.permission,
            },
          });
        },
        askForPushNotificationPermissions: async (ctx, evt) => {
          registerWebPushService.send({
            type: 'SetPushNotificationPermissions',
            payload: {
              value: (await Notification.requestPermission()),
            },
          });
        },
        registerServiceWorker: async (ctx, evt) => {
          const serviceWorkerRegistration = await navigator.serviceWorker.register('/service-worker.mjs', {
            scope: '/',
          });

          await navigator.serviceWorker.ready;

          registerWebPushService.send({
            type: 'SetRegisterServiceWorker',
            payload: {
              value: serviceWorkerRegistration,
            },
          });
        },
        subscribeToPushNotifications: async (ctx, evt) => {
          const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array((await loadServerKeys()).PK),
          };
          const pushNotificationSubscription = await ctx.serviceWorkerRegistration.pushManager.subscribe(subscribeOptions);

          registerWebPushService.send({
            type: 'SetPushNotificationSubscription',
            payload: {
              value: pushNotificationSubscription,
            },
          });
        },
      },
      activities: {},
      delays: {},
      guards: {
        isRequirementsCollectedGuard,
        isRequirementsValidGuard,
        isPushNotificationPermissionsGranted,
        isServerWorkerRegistered,
        isPushNotificationSubscriptionValid,
        isNotificationPermissionsDenied,
        isExistingNotificationPermissionDefault,
        isExistingNotificationPermissionDenied,
        isExistingNotificationPermissionGranted,
      },
      services: {},
  });

  let registerWebPushService = null;

  const handleSubmit = () => {
    console.debug('handleSubmit');
  };

  const handleAskPermissionsButtonClick = async () => {
    registerWebPushService.send({
      type: 'SetPushNotificationPermissions',
      payload: {
        value: (await Notification.requestPermission()),
      },
    });
  };

  const handleNotificationPermissionChange = ({ target: state }) => {
    pushNotificationPermissions = state;
  }

  onMount(async () => {
    notificationPermissionListener = await navigator.permissions.query({ name: 'notifications' }) ?? null;

    if (notificationPermissionListener !== null) {
      notificationPermissionListener.addEventListener('change', handleNotificationPermissionChange);
    }

    registerWebPushService = RegisterWebPushService(RegisterWebPushServiceConfig);

    registerWebPushService
      .onTransition((state) => {
        console.log(`[ ${state.value} ]`);
      })
      .onDone(({ data: { subscription, error } }) => {
        console.log('.onDone:', subscription, error);

        if (subscription === null && error !== null) {
          console.error(error);
        } else {
          subscriptionJSON = subscription;
        }
      })
      .start();
    
    registerWebPushService.send('start');

    // console.log('window.Notification.permission', window.Notification.permission);
  });

  onDestroy(() => {
    if (notificationPermissionListener !== null) {
      notificationPermissionListener.removeEventListener('change', handleNotificationPermissionChange);
    }

    if (registerWebPushService) {
      registerWebPushService.stop();

      registerWebPushService = null;
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

    transform: translate(0, -10vh);
  }

  label {
    align-items: center;
    display: flex;
    font-size: 2.0rem;
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
    background-color: hsl(219, 79%, 66%);
  }

  .submit:active {
    background-color: hsl(33deg 79% 66%);
    box-shadow: inset 0px 0px 10px 10px hsl(33deg 79% 60%);
    border: 1px solid hsl(33deg 79% 36%);
  }
</style>

<main>
  <form id='web-push-experiment-form' on:submit|preventDefault|stopPropagation={handleSubmit}>
    <label for='web-push-experiment-form'>Web Push Experiment {shouldAskForPermissions === true ? 'is yet impossible' : ''}</label>
    <div class='row'>
      <textarea
        class='message'
        cols='auto'
        maxlength='1024'
        name='message'
        required
        rows='10'
        type='text'
        disabled={shouldAskForPermissions === true}
      ></textarea>
    </div>
    <div class='row'>
      <button
        type='submit'
        class='submit'
        disabled={shouldAskForPermissions === true}
      >
        <SendIcon />
      </button>
    </div>
  </form>
  {#if pushNotificationPermissions === PermissionResults.default}
    <AskForPermissions
      on:askPermissions={handleAskPermissionsButtonClick}
    >would you like to subscribe for notifications?</AskForPermissions>
  {:else if pushNotificationPermissions === PermissionResults.denied}
    <PermissionsDenied>notifications denied</PermissionsDenied>
  {/if}
</main>
