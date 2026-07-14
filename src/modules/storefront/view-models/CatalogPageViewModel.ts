import {
  PageMetadata,
} from '../../content';

import {
  CatalogViewModel,
} from './CatalogViewModel';

export interface CatalogPageViewModel {
  metadata: PageMetadata;
  catalog: CatalogViewModel;
}
