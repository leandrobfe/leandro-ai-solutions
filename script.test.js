/**
 * Unit Tests for Leandro AI Solutions Website
 * Run with: npm test
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Read the actual script file
const scriptPath = path.join(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Setup DOM
const html = `
<!DOCTYPE html>
<html>
<head></head>
<body>
    <select id="languageSelect">
        <option value="en">English</option>
        <option value="pt-BR">Português (BR)</option>
    </select>
    <p data-i18n="hero-subtitle"></p>
    <h2 data-i18n="services-title"></h2>
    <h3 data-i18n="service-1-title"></h3>
    <p data-i18n="service-1-desc"></p>
    <h2 data-i18n="reviews-title"></h2>
    <h2 data-i18n="contact-title"></h2>
    <p data-i18n="contact-subtitle"></p>
    <button data-i18n="btn-contact"></button>
    <span data-i18n="footer-rights"></span>
    <input data-i18n-placeholder="placeholder-name" />
    <div id="reviewsGrid"></div>
</body>
</html>
`;

let dom;
let window;
let document;

// Helper to setup environment
function setupEnvironment(browserLang = 'en-US') {
    dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost'
    });
    window = dom.window;
    document = window.document;
    
    // Mock navigator.language
    Object.defineProperty(window.navigator, 'language', {
        value: browserLang,
        configurable: true,
        writable: true
    });
    
    // Make variables global by modifying script to use window
    const modifiedScript = scriptContent
        .replace('const translations =', 'window.translations =')
        .replace('let currentLang =', 'window.currentLang =')
        .replace('let reviews =', 'window.reviews =')
        .replace('function changeLanguage', 'window.changeLanguage = function')
        .replace('function detectLanguage', 'window.detectLanguage = function')
        .replace('function renderReviews', 'window.renderReviews = function')
        .replace(/detectLanguage\(\);/g, 'window.detectLanguage();');
    
    // Execute script
    const scriptEl = document.createElement('script');
    scriptEl.textContent = modifiedScript;
    document.body.appendChild(scriptEl);
    
    return { window, document };
}

describe('Translations', () => {
    beforeEach(() => {
        setupEnvironment('en-US');
    });

    test('should have English translations', () => {
        expect(window.translations).toHaveProperty('en');
        expect(window.translations.en).toHaveProperty('hero-subtitle');
        expect(window.translations.en).toHaveProperty('services-title');
        expect(window.translations.en).toHaveProperty('reviews-title');
        expect(window.translations.en).toHaveProperty('contact-title');
    });

    test('should have Portuguese translations', () => {
        expect(window.translations).toHaveProperty('pt-BR');
        expect(window.translations['pt-BR']).toHaveProperty('hero-subtitle');
        expect(window.translations['pt-BR']).toHaveProperty('services-title');
        expect(window.translations['pt-BR']).toHaveProperty('reviews-title');
        expect(window.translations['pt-BR']).toHaveProperty('contact-title');
    });

    test('should have same keys in both languages', () => {
        const enKeys = Object.keys(window.translations.en).sort();
        const ptKeys = Object.keys(window.translations['pt-BR']).sort();
        expect(enKeys).toEqual(ptKeys);
    });

    test('English translations should not be empty', () => {
        Object.entries(window.translations.en).forEach(([key, value]) => {
            expect(value).toBeTruthy();
            expect(value.length).toBeGreaterThan(0);
        });
    });

    test('Portuguese translations should not be empty', () => {
        Object.entries(window.translations['pt-BR']).forEach(([key, value]) => {
            expect(value).toBeTruthy();
            expect(value.length).toBeGreaterThan(0);
        });
    });
});

describe('Reviews Data', () => {
    beforeEach(() => {
        setupEnvironment('en-US');
    });

    test('should have English reviews', () => {
        expect(window.reviews).toHaveProperty('en');
        expect(Array.isArray(window.reviews.en)).toBe(true);
        expect(window.reviews.en.length).toBeGreaterThan(0);
    });

    test('should have Portuguese reviews', () => {
        expect(window.reviews).toHaveProperty('pt-BR');
        expect(Array.isArray(window.reviews['pt-BR'])).toBe(true);
        expect(window.reviews['pt-BR'].length).toBeGreaterThan(0);
    });

    test('reviews should have required fields', () => {
        const requiredFields = ['id', 'name', 'company', 'rating', 'text', 'date'];
        
        window.reviews.en.forEach(review => {
            requiredFields.forEach(field => {
                expect(review).toHaveProperty(field);
            });
        });
        
        window.reviews['pt-BR'].forEach(review => {
            requiredFields.forEach(field => {
                expect(review).toHaveProperty(field);
            });
        });
    });

    test('ratings should be between 1 and 5', () => {
        [...window.reviews.en, ...window.reviews['pt-BR']].forEach(review => {
            expect(review.rating).toBeGreaterThanOrEqual(1);
            expect(review.rating).toBeLessThanOrEqual(5);
        });
    });

    test('review IDs should be unique within each language', () => {
        const enIds = window.reviews.en.map(r => r.id);
        const ptIds = window.reviews['pt-BR'].map(r => r.id);
        
        expect(new Set(enIds).size).toBe(enIds.length);
        expect(new Set(ptIds).size).toBe(ptIds.length);
    });

    test('reviews should have valid names (not empty)', () => {
        [...window.reviews.en, ...window.reviews['pt-BR']].forEach(review => {
            expect(review.name.trim().length).toBeGreaterThan(0);
        });
    });

    test('reviews should have valid text (not empty)', () => {
        [...window.reviews.en, ...window.reviews['pt-BR']].forEach(review => {
            expect(review.text.trim().length).toBeGreaterThan(0);
        });
    });
});

describe('changeLanguage Function', () => {
    beforeEach(() => {
        setupEnvironment('en-US');
    });

    test('should update currentLang when changing to Portuguese', () => {
        window.changeLanguage('pt-BR');
        expect(window.currentLang).toBe('pt-BR');
    });

    test('should update currentLang when changing to English', () => {
        window.changeLanguage('pt-BR');
        window.changeLanguage('en');
        expect(window.currentLang).toBe('en');
    });

    test('should update DOM elements with data-i18n attribute for English', () => {
        window.changeLanguage('en');
        const heroSubtitle = document.querySelector('[data-i18n="hero-subtitle"]');
        expect(heroSubtitle.innerText).toBe(window.translations.en['hero-subtitle']);
    });

    test('should update DOM elements with data-i18n attribute for Portuguese', () => {
        window.changeLanguage('pt-BR');
        const heroSubtitle = document.querySelector('[data-i18n="hero-subtitle"]');
        expect(heroSubtitle.innerText).toBe(window.translations['pt-BR']['hero-subtitle']);
    });

    test('should update services title correctly for English', () => {
        window.changeLanguage('en');
        const servicesTitle = document.querySelector('[data-i18n="services-title"]');
        expect(servicesTitle.innerText).toBe('Our Services');
    });

    test('should update services title correctly for Portuguese', () => {
        window.changeLanguage('pt-BR');
        const servicesTitle = document.querySelector('[data-i18n="services-title"]');
        expect(servicesTitle.innerText).toBe('Nossos Serviços');
    });

    test('should update contact title correctly', () => {
        window.changeLanguage('en');
        const contactTitle = document.querySelector('[data-i18n="contact-title"]');
        expect(contactTitle.innerText).toBe('Ready to Transform Your Business?');
        
        window.changeLanguage('pt-BR');
        expect(contactTitle.innerText).toBe('Pronto para Transformar seu Negócio?');
    });
});

describe('renderReviews Function', () => {
    beforeEach(() => {
        setupEnvironment('en-US');
    });

    test('should render reviews in the grid', () => {
        window.currentLang = 'en';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        expect(grid.innerHTML).not.toBe('');
    });

    test('should render correct number of review cards for English', () => {
        window.currentLang = 'en';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        const cards = grid.querySelectorAll('.review-card');
        expect(cards.length).toBe(window.reviews.en.length);
    });

    test('should render correct number of review cards for Portuguese', () => {
        window.currentLang = 'pt-BR';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        const cards = grid.querySelectorAll('.review-card');
        expect(cards.length).toBe(window.reviews['pt-BR'].length);
    });

    test('should render star ratings', () => {
        window.currentLang = 'en';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        const stars = grid.querySelectorAll('.star');
        expect(stars.length).toBeGreaterThan(0);
    });

    test('should render reviewer names', () => {
        window.currentLang = 'en';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        const names = grid.querySelectorAll('.review-name');
        expect(names.length).toBe(window.reviews.en.length);
        expect(names[0].textContent).toBe(window.reviews.en[0].name);
    });

    test('should render reviewer companies', () => {
        window.currentLang = 'en';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        const companies = grid.querySelectorAll('.review-company');
        expect(companies.length).toBe(window.reviews.en.length);
        expect(companies[0].textContent).toBe(window.reviews.en[0].company);
    });

    test('should render review dates', () => {
        window.currentLang = 'en';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        const dates = grid.querySelectorAll('.review-date');
        expect(dates.length).toBe(window.reviews.en.length);
        expect(dates[0].textContent).toBe(window.reviews.en[0].date);
    });

    test('should render review text in quotes', () => {
        window.currentLang = 'en';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        const texts = grid.querySelectorAll('.review-text');
        expect(texts.length).toBe(window.reviews.en.length);
        expect(texts[0].textContent).toContain(window.reviews.en[0].text);
    });

    test('should render different content for different languages', () => {
        window.currentLang = 'en';
        window.renderReviews();
        const englishFirstReviewText = document.querySelector('.review-text').textContent;
        
        window.currentLang = 'pt-BR';
        window.renderReviews();
        const portugueseFirstReviewText = document.querySelector('.review-text').textContent;
        
        expect(englishFirstReviewText).not.toBe(portugueseFirstReviewText);
    });
});

describe('detectLanguage Function', () => {
    test('should return "en" for English browser language', () => {
        setupEnvironment('en-US');
        // detectLanguage is called automatically, check the result
        expect(window.currentLang).toBe('en');
    });

    test('should return "pt-BR" for Brazilian Portuguese browser language', () => {
        setupEnvironment('pt-BR');
        expect(window.currentLang).toBe('pt-BR');
    });

    test('should return "pt-BR" for Portuguese (Portugal) browser language', () => {
        setupEnvironment('pt-PT');
        expect(window.currentLang).toBe('pt-BR');
    });

    test('should default to "en" for French browser language', () => {
        setupEnvironment('fr-FR');
        expect(window.currentLang).toBe('en');
    });

    test('should default to "en" for German browser language', () => {
        setupEnvironment('de-DE');
        expect(window.currentLang).toBe('en');
    });

    test('should default to "en" for Spanish browser language', () => {
        setupEnvironment('es-ES');
        expect(window.currentLang).toBe('en');
    });

    test('should set language selector value correctly', () => {
        setupEnvironment('pt-BR');
        const select = document.getElementById('languageSelect');
        expect(select.value).toBe('pt-BR');
    });
});

describe('DOM Structure', () => {
    beforeEach(() => {
        setupEnvironment('en-US');
    });

    test('should have language selector', () => {
        const languageSelect = document.getElementById('languageSelect');
        expect(languageSelect).not.toBeNull();
    });

    test('should have reviews grid container', () => {
        const reviewsGrid = document.getElementById('reviewsGrid');
        expect(reviewsGrid).not.toBeNull();
    });

    test('should have elements with data-i18n attributes', () => {
        const i18nElements = document.querySelectorAll('[data-i18n]');
        expect(i18nElements.length).toBeGreaterThan(0);
    });

    test('language selector should have English option', () => {
        const select = document.getElementById('languageSelect');
        const enOption = select.querySelector('option[value="en"]');
        expect(enOption).not.toBeNull();
    });

    test('language selector should have Portuguese option', () => {
        const select = document.getElementById('languageSelect');
        const ptOption = select.querySelector('option[value="pt-BR"]');
        expect(ptOption).not.toBeNull();
    });
});

describe('Star Rating Generation', () => {
    beforeEach(() => {
        setupEnvironment('en-US');
    });

    test('should generate correct number of stars for 5-star rating', () => {
        window.currentLang = 'en';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        const firstCard = grid.querySelector('.review-card');
        const stars = firstCard.querySelectorAll('.star');
        
        // First review has 5 stars
        expect(stars.length).toBe(window.reviews.en[0].rating);
    });

    test('should render SVG elements for stars', () => {
        window.currentLang = 'en';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        const stars = grid.querySelectorAll('.star');
        
        stars.forEach(star => {
            expect(star.tagName.toLowerCase()).toBe('svg');
        });
    });

    test('stars should have path elements', () => {
        window.currentLang = 'en';
        window.renderReviews();
        
        const grid = document.getElementById('reviewsGrid');
        const star = grid.querySelector('.star');
        const path = star.querySelector('path');
        
        expect(path).not.toBeNull();
    });
});

describe('Integration Tests', () => {
    test('should initialize correctly with English browser', () => {
        setupEnvironment('en-US');
        
        expect(window.currentLang).toBe('en');
        expect(document.getElementById('languageSelect').value).toBe('en');
        
        const grid = document.getElementById('reviewsGrid');
        expect(grid.innerHTML).not.toBe('');
    });

    test('should initialize correctly with Portuguese browser', () => {
        setupEnvironment('pt-BR');
        
        expect(window.currentLang).toBe('pt-BR');
        expect(document.getElementById('languageSelect').value).toBe('pt-BR');
        
        const servicesTitle = document.querySelector('[data-i18n="services-title"]');
        expect(servicesTitle.innerText).toBe('Nossos Serviços');
    });

    test('should switch languages correctly', () => {
        setupEnvironment('en-US');
        
        // Start in English
        expect(window.currentLang).toBe('en');
        
        // Switch to Portuguese
        window.changeLanguage('pt-BR');
        expect(window.currentLang).toBe('pt-BR');
        
        const servicesTitle = document.querySelector('[data-i18n="services-title"]');
        expect(servicesTitle.innerText).toBe('Nossos Serviços');
        
        // Switch back to English
        window.changeLanguage('en');
        expect(window.currentLang).toBe('en');
        expect(servicesTitle.innerText).toBe('Our Services');
    });
});
