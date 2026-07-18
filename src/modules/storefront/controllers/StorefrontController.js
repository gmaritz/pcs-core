"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storefrontController = exports.StorefrontController = void 0;
const facades_1 = require("../facades");
const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Sports', href: '/sports' },
    { label: 'Brands', href: '/brands' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Login', href: '/login' },
    { label: 'Cart', href: '/cart' },
];
function formatSlug(slug) {
    return slug
        .split('-')
        .filter((segment) => segment.trim().length > 0)
        .map((segment) => (segment.charAt(0).toUpperCase() + segment.slice(1)))
        .join(' ');
}
class StorefrontController {
    renderPage(req, res, options) {
        res.render(options.view, {
            pageTitle: options.pageTitle,
            heading: options.heading,
            description: options.description,
            breadcrumbs: options.breadcrumbs ?? [],
            navItems: NAV_ITEMS,
            currentPath: req.path,
            currentYear: new Date().getFullYear(),
            home: options.home,
            catalog: options.catalog,
            product: options.product,
            shoppingCustomerId: options.shoppingCustomerId,
            metadata: options.metadata,
            isHomePage: options.isHomePage ?? false,
            layout: 'layouts/main',
        });
    }
    async renderHome(req, res) {
        const home = await facades_1.storefrontFacade.getHomepage();
        this.renderPage(req, res, {
            view: 'storefront/home',
            pageTitle: 'Pro Court Sports | Home',
            heading: 'Gear for every court, every match, every level.',
            description: 'Explore premium tennis, padel and squash equipment with trusted service and fast local fulfilment.',
            isHomePage: true,
            breadcrumbs: [],
            home,
        });
    }
    async renderCatalog(req, res) {
        const catalog = await facades_1.catalogFacade.buildCatalogPageViewModel(req.query);
        this.renderPage(req, res, {
            view: 'storefront/catalog',
            pageTitle: catalog.metadata.title,
            heading: catalog.catalog.heading,
            description: catalog.catalog.description,
            metadata: catalog.metadata,
            catalog,
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Shop' },
            ],
        });
    }
    renderSearch(req, res) {
        const params = new URLSearchParams();
        const q = typeof req.query.q === 'string'
            ? req.query.q.trim()
            : '';
        if (q) {
            params.set('q', q);
        }
        const query = params.toString();
        const redirectUrl = query
            ? `/shop?${query}`
            : '/shop';
        res.redirect(redirectUrl);
    }
    renderCategory(req, res) {
        const slugParam = req.params.slug;
        const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
        const categoryName = formatSlug(slug);
        this.renderPage(req, res, {
            view: 'storefront/category',
            pageTitle: `Pro Court Sports | Category | ${categoryName}`,
            heading: `Category: ${categoryName}`,
            description: 'Category catalogue data integration begins in WF-010C. This is a placeholder page.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Category' },
            ],
        });
    }
    async renderProduct(req, res) {
        const slugParam = req.params.slug;
        const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
        const productPage = await facades_1.productFacade.buildProductPageViewModel(slug);
        if (!productPage) {
            res.status(404);
            this.renderPage(req, res, {
                view: 'storefront/error',
                pageTitle: 'Pro Court Sports | Product Not Found',
                heading: 'Product Not Found',
                description: 'The requested product is not available.',
                breadcrumbs: [
                    { label: 'Home', href: '/' },
                    { label: 'Shop', href: '/shop' },
                    { label: 'Product' },
                ],
            });
            return;
        }
        this.renderPage(req, res, {
            view: 'storefront/product',
            pageTitle: productPage.metadata.title,
            heading: productPage.product.name,
            description: productPage.product.description,
            breadcrumbs: productPage.product.breadcrumbs,
            metadata: productPage.metadata,
            product: productPage.product,
            shoppingCustomerId: typeof req.query.customerId === 'string'
                ? req.query.customerId
                : undefined,
        });
    }
    renderCart(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/cart',
            pageTitle: 'Pro Court Sports | Cart',
            heading: 'Cart',
            description: 'Cart interactions are introduced in WF-010E. This is currently a static storefront placeholder.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Cart' },
            ],
        });
    }
    renderCheckout(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/checkout',
            pageTitle: 'Pro Court Sports | Checkout',
            heading: 'Checkout',
            description: 'Checkout orchestration is wired via API workflows. Storefront wiring arrives in WF-010E.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Checkout' },
            ],
        });
    }
    renderLogin(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/login',
            pageTitle: 'Pro Court Sports | Login',
            heading: 'Login',
            description: 'Authentication UI integration is out of scope for WF-010A and is represented as a static placeholder.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Login' },
            ],
        });
    }
    renderRegister(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/register',
            pageTitle: 'Pro Court Sports | Register',
            heading: 'Register',
            description: 'Account registration screens are scaffolded as placeholders in this workflow foundation.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Register' },
            ],
        });
    }
    renderAccount(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/account',
            pageTitle: 'Pro Court Sports | Account',
            heading: 'My Account',
            description: 'Account dashboard functionality is planned for WF-010E. This placeholder confirms route and layout.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Account' },
            ],
        });
    }
    renderOrders(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/orders',
            pageTitle: 'Pro Court Sports | Orders',
            heading: 'Orders',
            description: 'Order history rendering is out of scope for WF-010A and will be implemented in a later storefront workflow.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Orders' },
            ],
        });
    }
    renderWishlist(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/wishlist',
            pageTitle: 'Pro Court Sports | Wishlist',
            heading: 'Wishlist',
            description: 'Wishlist experiences are intentionally stubbed in this presentation foundation workflow.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Wishlist' },
            ],
        });
    }
    renderContact(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/contact',
            pageTitle: 'Pro Court Sports | Contact',
            heading: 'Contact Us',
            description: 'Reach our support team for product advice, order assistance, and supplier enquiries.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Contact' },
            ],
        });
    }
    renderAbout(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/about',
            pageTitle: 'Pro Court Sports | About',
            heading: 'About Pro Court Sports',
            description: 'Learn about our mission, product curation standards, and commitment to racquet sports in South Africa.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'About' },
            ],
        });
    }
    renderFaq(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/faq',
            pageTitle: 'Pro Court Sports | FAQ',
            heading: 'Frequently Asked Questions',
            description: 'FAQ content will be expanded in future workflows. This placeholder confirms storefront navigation wiring.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'FAQ' },
            ],
        });
    }
    renderPrivacy(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/privacy',
            pageTitle: 'Pro Court Sports | Privacy Policy',
            heading: 'Privacy Policy',
            description: 'Privacy policy copy is currently represented as placeholder content for storefront structure validation.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Privacy Policy' },
            ],
        });
    }
    renderTerms(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/terms',
            pageTitle: 'Pro Court Sports | Terms and Conditions',
            heading: 'Terms and Conditions',
            description: 'Terms and conditions copy is currently represented as placeholder content for storefront structure validation.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Terms and Conditions' },
            ],
        });
    }
    renderSports(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/category',
            pageTitle: 'Pro Court Sports | Sports',
            heading: 'Sports',
            description: 'Sport filtering UI is scaffolded. Dynamic category content arrives in WF-010C.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Sports' },
            ],
        });
    }
    renderBrands(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/catalog',
            pageTitle: 'Pro Court Sports | Brands',
            heading: 'Brands',
            description: 'Brand-specific storefront pages are scaffolded in WF-010A and connected to catalog services in WF-010C.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Brands' },
            ],
        });
    }
    renderError(req, res) {
        this.renderPage(req, res, {
            view: 'storefront/error',
            pageTitle: 'Pro Court Sports | Page Not Found',
            heading: 'Page Not Found',
            description: 'The page you requested is not available. Use the navigation above to continue browsing.',
            breadcrumbs: [
                { label: 'Home', href: '/' },
                { label: 'Error' },
            ],
        });
    }
}
exports.StorefrontController = StorefrontController;
exports.storefrontController = new StorefrontController();
