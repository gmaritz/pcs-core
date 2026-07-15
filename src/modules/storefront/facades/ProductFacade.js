"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFacade = exports.ProductFacade = void 0;
const client_1 = require("@prisma/client");
const content_1 = require("../../content");
const media_1 = require("../../media");
const recommendation_1 = require("../../recommendation");
const services_1 = require("../../catalog/services");
class ProductFacade {
    async buildProductPageViewModel(slug) {
        const products = await services_1.productService.getProducts({
            where: {
                slug,
                status: client_1.RecordStatus.ACTIVE,
                variants: {
                    some: {
                        status: client_1.RecordStatus.ACTIVE,
                        sellingPrice: {
                            not: null,
                        },
                    },
                },
            },
            include: {
                brand: true,
                category: true,
                sport: true,
                variants: {
                    where: {
                        status: client_1.RecordStatus.ACTIVE,
                        sellingPrice: {
                            not: null,
                        },
                    },
                    include: {
                        inventory: true,
                    },
                    orderBy: [
                        {
                            isDefault: 'desc',
                        },
                        {
                            displayOrder: 'asc',
                        },
                        {
                            createdAt: 'asc',
                        },
                    ],
                },
                productSpecifications: {
                    where: {
                        specification: {
                            status: client_1.RecordStatus.ACTIVE,
                        },
                    },
                    include: {
                        specification: true,
                    },
                    orderBy: [
                        {
                            specification: {
                                displayOrder: 'asc',
                            },
                        },
                        {
                            specification: {
                                name: 'asc',
                            },
                        },
                    ],
                },
            },
            take: 1,
        });
        const product = products[0];
        if (!product) {
            return null;
        }
        const primaryVariant = product.variants[0];
        if (!primaryVariant || primaryVariant.sellingPrice === null) {
            return null;
        }
        const gallery = await media_1.mediaService.resolveProductGallery(product.id);
        const recommendations = await recommendation_1.recommendationService.resolveRelatedProducts({
            productId: product.id,
            categoryId: product.categoryId,
            brandId: product.brandId,
            sportId: product.sportId,
            limit: 4,
        });
        const recommendationImages = await media_1.mediaService.resolveProductImages(recommendations.map((item) => item.productId));
        const description = (product.shortDescription ??
            product.description ??
            primaryVariant.description ??
            `${product.name} by ${product.brand.name}`);
        const isAvailable = this.resolveAvailability(primaryVariant.inventory);
        const detail = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            brandName: product.brand.name,
            sportName: product.sport.name,
            categoryName: product.category.name,
            sku: primaryVariant.sku,
            description,
            formattedPrice: this.formatCurrency(Number(primaryVariant.sellingPrice)),
            availabilityLabel: isAvailable ? 'In Stock' : 'Out of Stock',
            isAvailable,
            gallery: {
                primaryImage: {
                    ...gallery.primaryImage,
                    isPrimary: true,
                },
                images: this.toGalleryImages(gallery.images),
            },
            specifications: this.mapSpecifications(product.productSpecifications),
            attributes: this.mapSpecifications(product.productSpecifications),
            relatedProducts: {
                heading: 'Related Products',
                products: recommendations.map((item) => {
                    const media = recommendationImages[item.productId];
                    const related = {
                        id: item.variantId,
                        productId: item.productId,
                        productName: item.productName,
                        brandName: item.brandName,
                        sportName: item.sportName,
                        imageUrl: media.url,
                        imageAlt: media.altText,
                        formattedPrice: this.formatCurrency(item.sellingPrice),
                        availabilityLabel: item.isAvailable ? 'In Stock' : 'Out of Stock',
                        isAvailable: item.isAvailable,
                        productUrl: `/product/${item.productSlug}`,
                    };
                    return related;
                }),
            },
            breadcrumbs: [
                {
                    label: 'Home',
                    href: '/',
                },
                {
                    label: 'Shop',
                    href: '/shop',
                },
                {
                    label: product.sport.name,
                    href: `/shop?sport=${encodeURIComponent(product.sport.slug)}`,
                },
                {
                    label: product.category.name,
                    href: `/shop?category=${encodeURIComponent(product.category.slug)}`,
                },
                {
                    label: product.name,
                },
            ],
        };
        return {
            product: detail,
            metadata: content_1.pageMetadataService.buildProductPageMetadata({
                productName: product.name,
                brandName: product.brand.name,
                description,
                slug: product.slug,
                primaryImageUrl: gallery.primaryImage.url,
            }),
        };
    }
    mapSpecifications(specifications) {
        return specifications.map((entry) => ({
            label: entry.specification.name,
            value: entry.specification.unit
                ? `${entry.value} ${entry.specification.unit}`
                : entry.value,
        }));
    }
    toGalleryImages(images) {
        const primaryUrl = images[0]?.url;
        return images.map((image) => ({
            url: image.url,
            altText: image.altText,
            isPrimary: image.url === primaryUrl,
        }));
    }
    resolveAvailability(inventory) {
        const availableQuantity = inventory.reduce((sum, item) => (sum + (item.quantityOnHand - item.quantityReserved)), 0);
        return availableQuantity > 0;
    }
    formatCurrency(amount) {
        return `R${new Intl.NumberFormat('en-ZA').format(amount)}`;
    }
}
exports.ProductFacade = ProductFacade;
exports.productFacade = new ProductFacade();
