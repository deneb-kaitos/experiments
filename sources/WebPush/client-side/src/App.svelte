<script>
  import {
    onMount,
    onDestroy,
  } from 'svelte';
  import SendIcon from './icons/SendIcon.svelte';
  import AskPermissionsIcon from './icons/AskPermissionsIcon.svelte';
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
    urlBase64ToUint8Array,
  } from './helpers/urlBase64ToUint8Array.mjs';


  export let isServiceWorkerAvailable = null;
  export let isPushManagerAvailable = null;

  let subscriptionJSON = null;

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

  $: shouldEnableControls = subscriptionJSON !== null;

  $: if (subscriptionJSON) {
    console.log(subscriptionJSON);
  }

  const RegisterWebPushServiceConfig = Object.freeze({
    actions: {
        logContext: (ctx) => {
          console.log('logContext:', ctx);
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

          console.log(JSON.stringify(pushNotificationSubscription));

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
      },
      services: {},
  });

  let registerWebPushService = null;

  const handleSubmit = () => {
    console.debug('handleSubmit');
  };

  const handleAskPermissionsButtonClick = () => {
    registerWebPushService.send('start');
  };

  onMount(async () => {
    registerWebPushService = RegisterWebPushService(RegisterWebPushServiceConfig);

    registerWebPushService
      .onTransition((state) => {
        console.log('.onTransition:', state.value);
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
  });

  onDestroy(() => {
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

  .askForPermissions {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas:
      'askPermissionsText askPermissionsButton'
    ;

    height: 8vh;
    width: 20vw;
    padding: 0 1vw;

    transform: translate(0, -8vh);
    background-color: hsl(0deg 0% 70%);
  }

  .askPermissionsText {
    grid-area: askPermissionsText;
    padding: 1vh 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    color: hsl(0deg 0% 96%);
  }

  .askPermissionsButton {
    grid-area: askPermissionsButton;
  }

  .hideAskForPermissions {
    visibility: hidden;
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
  <div class='askForPermissions' class:hideAskForPermissions={shouldEnableControls === true}>
    <div class='askPermissionsText'>Would you like to subscribe for notifications?</div>
    <button
      type='button'
      class='submit askPermissionsButton'
      disabled={shouldEnableControls === true}
      on:click|preventDefault|stopPropagation={handleAskPermissionsButtonClick}
    >
      <AskPermissionsIcon />
    </button>
  </div>
</main>
