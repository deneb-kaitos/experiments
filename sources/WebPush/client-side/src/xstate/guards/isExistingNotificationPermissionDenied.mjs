import {
  PermissionResults,
} from '../../constants/PermissionResults.mjs';

export const isExistingNotificationPermissionDenied = (context) => context.pushNotificationPermissions === PermissionResults.denied;
