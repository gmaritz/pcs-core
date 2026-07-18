import { Request, Response } from 'express';

import {
  CataloguePagePayload,
  catalogueFacade,
} from '../facades/CatalogueFacade';

export class CatalogueController {
  private getParam(value: string | string[] | undefined): string {
    if (Array.isArray(value)) {
      return value[0] ?? '';
    }

    return value ?? '';
  }

  private renderPage(
    req: Request,
    res: Response,
    payload: CataloguePagePayload,
  ): void {
    res.render(payload.view, {
      pageTitle: payload.pageTitle,
      heading: payload.heading,
      description: payload.description,
      breadcrumbs: payload.breadcrumbs,
      currentPath: req.path,
      currentYear: new Date().getFullYear(),
      metadata: payload.metadata,
      catalogue: {
        landing: payload.landing,
        sport: payload.sport,
        category: payload.category,
        brand: payload.brand,
      },
      layout: 'layouts/main',
    });
  }

  async renderLanding(req: Request, res: Response): Promise<void> {
    const payload = await catalogueFacade.getLanding();
    this.renderPage(req, res, payload);
  }

  async renderSport(req: Request, res: Response): Promise<void> {
    const payload = await catalogueFacade.getSport(
      this.getParam(req.params.sport),
    );

    if (!payload) {
      res.status(404).render('storefront/error', {
        pageTitle: 'Pro Court Sports | Sport Not Found',
        heading: 'Sport Not Found',
        description: 'The requested sport catalog could not be found.',
        breadcrumbs: [
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: 'Sport' },
        ],
        currentPath: req.path,
        currentYear: new Date().getFullYear(),
        layout: 'layouts/main',
      });

      return;
    }

    this.renderPage(req, res, payload);
  }

  async renderCategory(req: Request, res: Response): Promise<void> {
    const payload = await catalogueFacade.getCategory(
      this.getParam(req.params.sport),
      this.getParam(req.params.category),
      req.query as Record<string, unknown>,
    );

    if (!payload) {
      res.status(404).render('storefront/error', {
        pageTitle: 'Pro Court Sports | Category Not Found',
        heading: 'Category Not Found',
        description: 'The requested category catalog could not be found.',
        breadcrumbs: [
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: 'Category' },
        ],
        currentPath: req.path,
        currentYear: new Date().getFullYear(),
        layout: 'layouts/main',
      });

      return;
    }

    this.renderPage(req, res, payload);
  }

  async renderBrand(req: Request, res: Response): Promise<void> {
    const payload = await catalogueFacade.getBrand(
      this.getParam(req.params.brand),
      req.query as Record<string, unknown>,
    );

    if (!payload) {
      res.status(404).render('storefront/error', {
        pageTitle: 'Pro Court Sports | Brand Not Found',
        heading: 'Brand Not Found',
        description: 'The requested brand page could not be found.',
        breadcrumbs: [
          { label: 'Home', href: '/' },
          { label: 'Brands', href: '/brands' },
          { label: 'Brand' },
        ],
        currentPath: req.path,
        currentYear: new Date().getFullYear(),
        layout: 'layouts/main',
      });

      return;
    }

    this.renderPage(req, res, payload);
  }
}

export const catalogueController =
  new CatalogueController();
