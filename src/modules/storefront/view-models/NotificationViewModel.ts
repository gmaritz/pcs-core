import {
  NotificationSeverity,
} from '../../notification';

export interface NotificationViewModel {
  title: string;
  message: string;
  severity: NotificationSeverity;
}
