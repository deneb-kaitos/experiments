export const isRequirementsValidGuard = (context) => {
  return (context.isServiceWorkerAvailable === true) && (context.isPushManagerAvailable === true);
};
