"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogueController = exports.CatalogueController = void 0;
const CatalogueFacade_1 = require("../facades/CatalogueFacade");
class CatalogueController {
    getParam(value) {
        if (Array.isArray(value)) {
            return value[0] ?? '';
        }
        return value ?? '';
    }
    renderPage(req, res, payload) {
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
    async renderLanding(req, res) {
        const payload = await CatalogueFacade_1.catalogueFacade.getLanding();
        this.renderPage(req, res, payload);
    }
    async renderSport(req, res) {
        const payload = await CatalogueFacade_1.catalogueFacade.getSport(this.getParam(req.params.sport));
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
    async renderCategory(req, res) {
        const payload = await CatalogueFacade_1.catalogueFacade.getCategory(this.getParam(req.params.sport), this.getParam(req.params.category), req.query);
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
    async renderBrand(req, res) {
        const payload = await CatalogueFacade_1.catalogueFacade.getBrand(this.getParam(req.params.brand), req.query);
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
exports.CatalogueController = CatalogueController;
exports.catalogueController = new CatalogueController();
