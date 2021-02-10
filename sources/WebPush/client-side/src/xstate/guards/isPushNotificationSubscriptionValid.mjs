export const isPushNotificationSubscriptionValid = (context) => {
  console.log('isPushNotificationSubscriptionValid:', context.pushNotificationSubscription);

  return context.pushNotificationSubscription !== null;
};
