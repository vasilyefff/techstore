import { products } from './data/products.js';
import { createProductCard } from './components/ProductCard.js';
import { createCartModal } from './components/CartModal.js';

/*
	===== DOM-элементы страницы =====
*/
const productsContainer = document.getElementById('products');
const openCartBtn = document.getElementById('open-cart-btn');
const cartCountElement = document.getElementById('cart-count');
const sortSelect = document.getElementById('sortSelect');

/*
	===== Состояние корзины =====
*/
const cart = JSON.parse(localStorage.getItem('cart')) || [];

/*
	===== Рендер товаров (ЕДИНАЯ ФУНКЦИЯ) =====
*/
function renderProducts(productsArray) {
	productsContainer.innerHTML = productsArray
		.map(product => createProductCard(product))
		.join('');

	// синхронизация кнопок с корзиной
	document.querySelectorAll('.add-to-cart-btn').forEach(button => {
		const id = Number(button.dataset.id);
		const cartItem = cart.find(item => item.product.id === id);
		renderAddButton(button, cartItem);
	});
}

/*
	===== Вспомогательные функции =====
*/
function getCartTotal(cart) {
	return cart.reduce((total, item) => {
		return total + item.product.price * item.quantity;
	}, 0);
}

function getCartCount(cart) {
	return cart.reduce((total, item) => {
		return total + item.quantity;
	}, 0);
}

function updateCartCount(cart) {
	cartCountElement.textContent = getCartCount(cart);
}

function saveCart(cart) {
	localStorage.setItem('cart', JSON.stringify(cart));
}

function renderAddButton(button, cartItem) {
	if (!cartItem) {
		button.classList.remove('counter');
		button.innerHTML = 'В корзину';
		return;
	}

	button.classList.add('counter');
	button.innerHTML = `
		<button class="minus">−</button>
		<span>${cartItem.quantity}</span>
		<button class="plus">+</button>
	`;
}

/*
	===== Фильтрация и сортировка =====
*/
let currentCategory = 'all';
const categoryButtons = document.querySelectorAll('.category-filters button');

categoryButtons.forEach(button => {
	button.addEventListener('click', () => {
		currentCategory = button.dataset.category;

		categoryButtons.forEach(btn => btn.classList.remove('active'));
		button.classList.add('active');

		applyFilters();
	});
});

sortSelect.addEventListener('change', applyFilters);

function applyFilters() {
	let filteredProducts = [...products];

	if (currentCategory !== 'all') {
		filteredProducts = filteredProducts.filter(
			product => product.category === currentCategory
		);
	}

	switch (sortSelect.value) {
		case 'price-asc':
			filteredProducts.sort((a, b) => a.price - b.price);
			break;
		case 'price-desc':
			filteredProducts.sort((a, b) => b.price - a.price);
			break;
		case 'rating-desc':
			filteredProducts.sort((a, b) => b.rating - a.rating);
			break;
	}

	renderProducts(filteredProducts);
}

/*
	===== Добавление товара в корзину =====
*/
productsContainer.addEventListener('click', (event) => {
	const button = event.target.closest('.add-to-cart-btn');
	if (!button) return;

	const productId = Number(button.dataset.id);
	const product = products.find(p => p.id === productId);
	if (!product) return;

	let cartItem = cart.find(item => item.product.id === productId);

	if (event.target.classList.contains('plus')) {
		cartItem.quantity++;
	}
	else if (event.target.classList.contains('minus')) {
		if (cartItem.quantity === 1) {
			cart.splice(cart.indexOf(cartItem), 1);
			cartItem = null;
		} else {
			cartItem.quantity--;
		}
	}
	else {
		if (!cartItem) {
			cartItem = { product, quantity: 1 };
			cart.push(cartItem);
		}
	}

	saveCart(cart);
	updateCartCount(cart);
	renderAddButton(button, cartItem);
});

/*
	===== Рендер корзины =====
*/
function renderCart(cart, container) {
	const cartFooter = document.querySelector('.cart-modal-footer');

	if (cart.length === 0) {
		container.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
		cartFooter.style.display = 'none';
		return;
	}

	cartFooter.style.display = 'flex';
	container.innerHTML = '';

	cart.forEach(item => {
		container.innerHTML += `
			<div class="cart-item">
				<span class="cart-item-title">${item.product.title}</span>

				<div class="cart-item-quantity">
					<button data-id="${item.product.id}" class="quantity-btn minus-btn">−</button>
					<span>${item.quantity}</span>
					<button data-id="${item.product.id}" class="quantity-btn plus-btn">+</button>
				</div>

				<span class="cart-item-price">
					${(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
				</span>
			</div>
		`;
	});
}

/*
	===== Открытие модального окна корзины =====
*/
openCartBtn.addEventListener('click', () => {
	const modalWrapper = document.createElement('div');
	modalWrapper.innerHTML = createCartModal();
	document.body.appendChild(modalWrapper);

	const cartItemsContainer = modalWrapper.querySelector('#cart-items');
	const cartTotalElement = modalWrapper.querySelector('#cart-total');
	const closeBtn = modalWrapper.querySelector('.cart-modal-close');
	const modalOverlay = modalWrapper.querySelector('.cart-modal-overlay');

	modalOverlay.addEventListener('click', (event) => {
		if (event.target === modalOverlay) {
			modalWrapper.remove();
		}
	});

	renderCart(cart, cartItemsContainer);
	cartTotalElement.textContent = getCartTotal(cart).toLocaleString('ru-RU');

	cartItemsContainer.addEventListener('click', (event) => {
		const target = event.target;
		if (!target.classList.contains('quantity-btn')) return;

		const id = Number(target.dataset.id);
		const cartItem = cart.find(item => item.product.id === id);
		if (!cartItem) return;

		if (target.classList.contains('plus-btn')) cartItem.quantity++;
		if (target.classList.contains('minus-btn')) {
			if (cartItem.quantity === 1) {
				cart.splice(cart.indexOf(cartItem), 1);
			} else {
				cartItem.quantity--;
			}
		}

		saveCart(cart);
		updateCartCount(cart);
		renderCart(cart, cartItemsContainer);
		cartTotalElement.textContent = getCartTotal(cart).toLocaleString('ru-RU');
	});

	const clearCartBtn = modalWrapper.querySelector('.clear-cart-btn');

	clearCartBtn.addEventListener('click', () => {
		cart.length = 0;
		localStorage.removeItem('cart');
		renderCart(cart, cartItemsContainer);
		updateCartCount(cart);
		cartTotalElement.textContent = '0';
	});

	closeBtn.addEventListener('click', () => {
		modalWrapper.remove();
	});
});

/*
	===== Инициализация =====
*/
updateCartCount(cart);
renderProducts(products);
