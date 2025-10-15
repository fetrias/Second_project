class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle?.querySelector('.theme-toggle__icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateIcon(theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
    }
    
    updateIcon(theme) {
        if (this.themeIcon) {
            this.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }
}

class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.cartCount = document.getElementById('cartCount');
        this.init();
    }
    
    init() {
        this.updateCartCount();
        this.bindProductEvents();
    }
    
    bindProductEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('product-card__button')) {
                this.addToCart(e.target.closest('.product-card'));
            }
            
            if (e.target.closest('.product-card') && !e.target.classList.contains('product-card__button')) {
                this.toggleProductSelection(e.target.closest('.product-card'));
            }
        });
    }
    
    addToCart(productCard) {
        const productId = productCard.dataset.productId;
        const productName = productCard.querySelector('.product-card__name').textContent;
        const priceElement = productCard.querySelector('.product-card__price');
        const productPrice = this.parsePrice(priceElement.textContent);
        const productImage = productCard.querySelector('.product-card__image')?.src || '';
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showAddToCartAnimation(productCard);
    }
    
    toggleProductSelection(productCard) {
        productCard.classList.toggle('product-card--selected');
        
        if (productCard.classList.contains('product-card--selected')) {
            productCard.style.transform = 'scale(1.02)';
            setTimeout(() => {
                productCard.style.transform = '';
            }, 200);
        }
    }
    
    parsePrice(priceText) {
        return parseInt(priceText.replace(/[^\d]/g, ''));
    }
    
    updateCartCount() {
        if (this.cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            this.cartCount.textContent = totalItems;
            this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
    showAddToCartAnimation(productCard) {
        const button = productCard.querySelector('.product-card__button');
        const originalText = button.textContent;
        
        button.textContent = 'Добавлено!';
        button.classList.add('product-card__button--added');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('product-card__button--added');
        }, 2000);
    }
}

class DiscountManager {
    constructor() {
        this.discounts = {
            'product-1': 10,
            'product-2': 50
        };
        this.init();
    }
    
    init() {
        this.applyDiscounts();
    }
    
    applyDiscounts() {
        Object.keys(this.discounts).forEach(productId => {
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                this.addDiscountBadge(productCard, this.discounts[productId]);
                this.updatePrice(productCard, this.discounts[productId]);
            }
        });
    }
    
    addDiscountBadge(productCard, discount) {
        const existingBadge = productCard.querySelector('.product-card__discount');
        if (existingBadge) return;
        
        const badge = document.createElement('div');
        badge.className = 'product-card__discount';
        badge.textContent = `-${discount}%`;
        productCard.appendChild(badge);
        productCard.classList.add('product-card--discount');
    }
    
    updatePrice(productCard, discount) {
        const priceElement = productCard.querySelector('.product-card__price');
        const originalPrice = this.parsePrice(priceElement.textContent);
        const discountedPrice = Math.round(originalPrice * (1 - discount / 100));
        
        priceElement.innerHTML = `
            <span class="product-card__price--original">${this.formatPrice(originalPrice)}</span>
            <span class="product-card__price--discounted">${this.formatPrice(discountedPrice)}</span>
        `;
    }
    
    parsePrice(priceText) {
        return parseInt(priceText.replace(/[^\d]/g, ''));
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    }
}

class ModalManager {
    constructor() {
        this.modal = document.getElementById('contactModal');
        this.form = document.getElementById('feedbackForm');
        this.init();
    }
    
    init() {
        this.bindModalEvents();
    }
    
    bindModalEvents() {
        if (!this.modal) return;
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.open) {
                this.closeModal();
            }
        });
        
        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.addEventListener('input', (e) => {
                const maxLength = 500;
                if (e.target.value.length > maxLength) {
                    e.target.value = e.target.value.substring(0, maxLength);
                }
            });
        }
        
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        }
    }
    
    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.startsWith('7') || value.startsWith('8')) {
            value = value.substring(1);
        }
        if (value.length > 0) {
            value = '+7 (' + value;
            if (value.length > 7) {
                value = value.substring(0, 7) + ') ' + value.substring(7);
            }
            if (value.length > 12) {
                value = value.substring(0, 12) + '-' + value.substring(12);
            }
            if (value.length > 15) {
                value = value.substring(0, 15) + '-' + value.substring(15);
            }
        }
        input.value = value;
    }
    
    closeModal() {
        this.modal.close();
        this.resetForm();
    }
    
    resetForm() {
        if (this.form) {
            this.form.reset();
        }
    }
}

class BootstrapCartManager {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn') && 
                e.target.closest('.product-card') && 
                e.target.textContent.includes('Добавить в корзину')) {
                
                this.handleBootstrapAddToCart(e.target);
            }
        });
    }
    
    handleBootstrapAddToCart(button) {
        const productCard = button.closest('.product-card');
        const originalText = button.textContent;
        
        button.textContent = 'Добавлено!';
        button.classList.add('btn-success');
        button.classList.remove('btn-primary');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('btn-success');
            button.classList.add('btn-primary');
        }, 2000);
        
        if (window.cartManager) {
            window.cartManager.addToCart(productCard);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (document.getElementById('themeToggle')) {
        new ThemeManager();
    }
    
    if (document.querySelector('.product-card .btn')) {
    new BootstrapCartManager();
    new BootstrapDiscountManager();
}
    
    if (document.querySelector('.product-card') && !document.querySelector('.product-card .btn')) {
        new CartManager();
        new DiscountManager();
    }
    
    if (document.getElementById('contactModal')) {
        new ModalManager();
    }
});

class BootstrapDiscountManager {
    constructor() {
        this.discounts = {
            'product-1': 10,
            'product-2': 50
        };
        this.init();
    }
    
    init() {
        this.applyDiscounts();
    }
    
    applyDiscounts() {
        Object.keys(this.discounts).forEach(productId => {
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                this.addDiscountBadge(productCard, this.discounts[productId]);
                this.updatePrice(productCard, this.discounts[productId]);
            }
        });
    }
    
    addDiscountBadge(productCard, discount) {
        const existingBadge = productCard.querySelector('.discount-badge');
        if (existingBadge) return;
        
        const badge = document.createElement('span');
        badge.className = 'position-absolute top-0 end-0 badge bg-danger m-2 discount-badge';
        badge.textContent = `-${discount}%`;
        badge.style.fontSize = '0.9rem';
        productCard.appendChild(badge);
    }
    
    updatePrice(productCard, discount) {
        const priceElement = productCard.querySelector('.text-success');
        if (!priceElement) return;
        
        const originalPrice = this.parsePrice(priceElement.textContent);
        const discountedPrice = Math.round(originalPrice * (1 - discount / 100));
        
        priceElement.innerHTML = `
            <span class="text-decoration-line-through text-muted me-2" style="font-size: 0.9rem;">${this.formatPrice(originalPrice)}</span>
            <span>${this.formatPrice(discountedPrice)}</span>
        `;
    }
    
    parsePrice(priceText) {
        return parseInt(priceText.replace(/[^\d]/g, ''));
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    }
}