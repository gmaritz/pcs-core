"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storefrontPresentationService = exports.StorefrontPresentationService = void 0;
class StorefrontPresentationService {
    formatInteger(value) {
        return new Intl.NumberFormat('en-ZA').format(value);
    }
    formatPrice(value) {
        return `From R${new Intl.NumberFormat('en-ZA').format(value)}`;
    }
    resolveSportImage(slug) {
        const imageMap = {
            tennis: '/images/sports/tennis.png',
            padel: '/images/sports/padel.png',
            squash: '/images/sports/squash.png',
        };
        return imageMap[slug] ?? '/images/sports/ProCourtSports.png';
    }
    resolveSportTagline(slug) {
        const taglineMap = {
            tennis: 'Performance Equipment',
            padel: 'The Fastest Growing Court Sport',
            squash: 'Built For Speed',
        };
        return taglineMap[slug] ?? 'Specialist Court Sports Equipment';
    }
    resolveCategoryImage(slug) {
        const imageMap = {
            'tennis-racquets': '/images/sports/tennis.png',
            'padel-racquets': '/images/sports/padel.png',
            'squash-gear': '/images/sports/squash.png',
            'shoes-accessories': '/images/sports/ProCourtSports.png',
        };
        return imageMap[slug] ?? '/images/sports/ProCourtSports.png';
    }
    resolveCategoryDescription(name) {
        const normalized = name.toLowerCase();
        if (normalized.includes('tennis')) {
            return 'Frames and support gear tailored for club players, competitors, and growing juniors.';
        }
        if (normalized.includes('padel')) {
            return 'Balanced options for control, feel, and explosive power in the modern game.';
        }
        if (normalized.includes('squash')) {
            return 'Lightweight, durable equipment configured for speed and high-intensity rallies.';
        }
        if (normalized.includes('shoe') || normalized.includes('accessor')) {
            return 'Shoes, strings, balls, grips, bags, and essentials that complete the premium player setup.';
        }
        return 'Specialist products selected for performance, durability, and player confidence.';
    }
    resolveSportDescription(name, fallback) {
        if (fallback?.trim()) {
            return fallback;
        }
        const normalized = name.toLowerCase();
        if (normalized.includes('tennis')) {
            return 'Premium racquets, strings, balls, footwear, apparel, and accessories for players of all levels.';
        }
        if (normalized.includes('padel')) {
            return 'Modern padel equipment designed for control, power, comfort, and competitive performance.';
        }
        if (normalized.includes('squash')) {
            return 'High-performance racquets, balls, footwear, and accessories for serious squash players.';
        }
        return 'Specialist court sport equipment curated for quality, confidence, and match-day performance.';
    }
    resolveBrandThemeClass(slug) {
        const themeMap = {
            wilson: 'brand-wilson',
            head: 'brand-head',
            babolat: 'brand-babolat',
            tecnifibre: 'brand-tecnifibre',
            dunlop: 'brand-dunlop',
        };
        return themeMap[slug] ?? '';
    }
}
exports.StorefrontPresentationService = StorefrontPresentationService;
exports.storefrontPresentationService = new StorefrontPresentationService();
