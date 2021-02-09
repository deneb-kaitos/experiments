import {
  Machine,
  interpret,
  assign,
} from 'xstate';

const RegisterWebPushMachine = Machine({
    id: 'RegisterWebPushMachine',
    initial: 'initial',
    context: {
      isServiceWorkerAvailable: null,
      isPushManagerAvailable: null,
      pushNotificationPermissions: null,
      serviceWorkerRegistration: null,
      pushNotificationSubscription: null,
    },
    states: {
      initial: {
        on: {
          start: {
            target: 'collectRequirements',
            actions: [
              'resolveServiceWorkerAvailable',
              'resolvePushManagerAvailable',
              'logContext',
            ],
          },
        },
      },
      collectRequirements: {
        on: {
          SetServiceWorkerAvailable: {
            target: 'checkRequirementsCollected',
            actions: [
              assign({
                isServiceWorkerAvailable: (_, event) => event.payload.value,
              }),
              'logContext',
            ],
          },
          SetPushManagerAvailable: {
            target: 'checkRequirementsCollected',
            actions: [
              assign({
                isPushManagerAvailable: (_, event) => event.payload.value,
              }),
              'logContext',
            ],
          },
        },
      },
      checkRequirementsCollected: {
        always: [
          {
            target: 'checkRequirementsValid',
            cond: {
              type: 'isRequirementsCollectedGuard',
            },
          },
          {
            target: 'collectRequirements',
          }
        ],
      },
      checkRequirementsValid: {
        always: [
          {
            target: 'askForPushNotificationPermissions',
            cond: {
              type: 'isRequirementsValidGuard',
            },
            actions: ['askForPushNotificationPermissions'],
          },
          {
            target: 'final_RequirementNotMet',
          },
        ],
      },
      askForPushNotificationPermissions: {
        on: {
          SetPushNotificationPermissions: {
            target: 'checkPushNotificationPermissions',
            actions: [
              assign({
                pushNotificationPermissions: (_, event) => event.payload.value,
              }),
              'logContext',
            ],
          },
        },
      },
      checkPushNotificationPermissions: {
        always: [
          {
            target: 'registerServiceWorker',
            cond: {
              type: 'isPushNotificationPermissionsGranted'
            },
          },
          {
            target: 'final_PushNotificationPermissionsDenied',
          },
        ],
      },
      registerServiceWorker: {
        entry: ['registerServiceWorker'],
        on: {
          SetRegisterServiceWorker: {
            target: 'checkIsServerWorkerRegistered',
            actions: [
              assign({
                serviceWorkerRegistration: (_, event) => event.payload.value,
              }),
              'logContext',
            ],
          },
        },
      },
      checkIsServerWorkerRegistered: {
        always: [
          {
            target: 'subscribeToPushNotifications',
            cond: {
              type: 'isServerWorkerRegistered',
            },
          },
        ],
      },
      subscribeToPushNotifications: {
        entry: ['subscribeToPushNotifications'],
        on: {
          SetPushNotificationSubscription: {
            target: 'final_OK',
            actions: [
              assign({
                pushNotificationSubscription: (_, event) => event.payload.value,
              }),
              'logContext',
            ],
          },
        },
      },
      final_OK: {
        type: 'final',
      },
      final_RequirementNotMet: {
        type: 'final',
      },
      final_PushNotificationPermissionsDenied: {
        type: 'final',
      },
    },
  },
);

export const RegisterWebPushService = (config = null) => interpret(RegisterWebPushMachine.withConfig(config));
