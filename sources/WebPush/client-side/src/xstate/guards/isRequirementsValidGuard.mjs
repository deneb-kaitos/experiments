export const isRequirementsValidGuard = (context) => (context.isServiceWorkerAvailable === true) && (context.isPushManagerAvailable === true);

