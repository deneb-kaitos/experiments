import {
  PermissionResults,
} from '../../constants/PermissionResults.mjs';

export const isExistingNotificationPermissionDefault = (context) => context.pushNotificationPermissions === PermissionResults.default;
