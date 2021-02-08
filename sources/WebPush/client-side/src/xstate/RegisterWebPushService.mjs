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
            target: 'final_OK',
            cond: {
              type: 'isRequirementsValidGuard',
            },
          },
          {
            target: 'final_ER',
          },
        ],
      },
      final_OK: {
        type: 'final',
      },
      final_ER: {
        type: 'final',
      },
    },
  },
);

export const RegisterWebPushService = (config = null) => interpret(RegisterWebPushMachine.withConfig(config));
