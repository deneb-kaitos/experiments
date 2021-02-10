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
            target: 'requestExistingNotificationPermissions',
            cond: {
              type: 'isRequirementsValidGuard',
            },
          },
          {
            target: 'final_RequirementNotMet',
          },
        ],
      },
      requestExistingNotificationPermissions: {
        entry: ['requestExistingNotificationPermissions'],
        on: {
          SetExistingNotificationPermissions: {
            target: 'checkExistingNotificationPermissions',
            actions: [
              assign({
                pushNotificationPermissions: (_, event) => event.payload.value,
              }),
            ],
          },
        },
      },
      checkExistingNotificationPermissions: {
        always: [
          {
            target: 'askForPushNotificationPermissions',
            cond: 'isExistingNotificationPermissionDefault',
          },
          {
            target: 'registerServiceWorker',
            cond: 'isExistingNotificationPermissionGranted',
          },
          {
            target: 'final_PushNotificationPermissionsDenied',
            cond: 'isExistingNotificationPermissionDenied',
          },
        ],
      },
      askForPushNotificationPermissions: {
        // entry: ['pushNotificationPermissionsRequired'],
        on: {
          SetPushNotificationPermissions: {
            target: 'checkExistingNotificationPermissions',
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
            target: 'checkPushNotificationSubscriptionValid',
            actions: [
              assign({
                pushNotificationSubscription: (_, event) => event.payload.value,
              }),
              'logContext',
            ],
          },
        },
      },
      checkPushNotificationSubscriptionValid: {
        always: [
          {
            target: 'final_OK',
            cond: {
              type: 'isPushNotificationSubscriptionValid',
            },
          },
          {
            target: 'final_PushNotificationDataInvalid',
          }
        ],
      },
      final_OK: {
        type: 'final',
        data: {
          subscription: (context, event) => JSON.stringify(context.pushNotificationSubscription),
          error: null,
        },
      },
      final_RequirementNotMet: {
        type: 'final',
        data: {
          subscription: (context, event) => context.pushNotificationSubscription,
          error: 'serviceWorker or PushManager do not exist',
        },
      },
      final_PushNotificationPermissionsDenied: {
        type: 'final',
        data: {
          subscription: (context, event) => context.pushNotificationSubscription,
          error: 'push notification denied',
        },
      },
      final_PushNotificationDataInvalid: {
        type: 'final',
        data: {
          subscription: (context, event) => context.pushNotificationSubscription,
          error: 'push notification subscription is invalid',
        },
      },
    },
  },
);

export const RegisterWebPushService = (config = null) => interpret(RegisterWebPushMachine.withConfig(config));
