export const isRequirementsCollectedGuard = (context) => {
  return (context.isServiceWorkerAvailable !== null) && (context.isPushManagerAvailable !== null);
};
