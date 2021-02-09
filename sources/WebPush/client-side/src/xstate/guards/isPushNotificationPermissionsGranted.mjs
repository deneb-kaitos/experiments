import {
  PermissionResults,
} from '../../constants/PermissionResults.mjs';

export const isPushNotificationPermissionsGranted = (context) => context.pushNotificationPermissions === PermissionResults.granted;
