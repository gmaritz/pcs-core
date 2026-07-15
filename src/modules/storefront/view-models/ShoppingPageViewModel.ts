import {
  PageMetadata,
} from '../../content';

import {
  BreadcrumbViewModel,
} from './BreadcrumbViewModel';
import {
  NotificationViewModel,
} from './NotificationViewModel';

export interface ShoppingPageViewModel<TPageModel> {
  heading: string;
  description: string;
  breadcrumbs: BreadcrumbViewModel[];
  metadata: PageMetadata;
  notification?: NotificationViewModel;
  page: TPageModel;
}
