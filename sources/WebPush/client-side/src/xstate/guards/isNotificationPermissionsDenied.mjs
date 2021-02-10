import {
  PermissionResults,
} from '../../constants/PermissionResults.mjs';

export const isNotificationPermissionsDenied = (context) => {
  return context.pushNotificationPermissions === PermissionResults.denied;
};
