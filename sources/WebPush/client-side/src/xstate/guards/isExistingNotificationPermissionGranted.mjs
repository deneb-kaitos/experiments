import {
  PermissionResults,
} from '../../constants/PermissionResults.mjs';

export const isExistingNotificationPermissionGranted = (context) => context.pushNotificationPermissions === PermissionResults.granted;
