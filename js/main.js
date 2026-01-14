import { products } from './data/products.js';
import { createProductCard } from './components/ProductCard.js';
import { createCartModal } from './components/CartModal.js';

/*
	===== DOM-элементы страницы =====
	Здесь только то, что реально существует в index.html
*/
const productsContainer = document.getElementById('products');
const openCartBtn = document.getElementById('open-cart-btn');
const cartCountElement = document.getElementById('cart-count');

/*
	===== Состояние корзины =====
	Загружаем корзину из localStorage.
	Если там ничего нет — начинаем с пустого массива.
*/
const cart = JSON.parse(localStorage.getItem('cart')) || [];

/*
	При загрузке страницы обновляем только счётчик товаров,
	сама корзина рендерится ТОЛЬКО при открытии модалки.
*/
updateCartCount(cart);

/*
	===== Рендер списка товаров =====
	Генерируем HTML карточек товаров и вставляем на страницу.
*/
productsContainer.innerHTML = products
	.map(product => createProductCard(product))
	.join('');

/*
	===== Вспомогательные функции =====
*/

/*
	Считает общую стоимость корзины
*/
function getCartTotal(cart) {
	return cart.reduce((total, item) => {
		return total + item.product.price * item.quantity;
	}, 0);
}

/*
	Считает общее количество товаров в корзине
	(сумма всех quantity)
*/
function getCartCount(cart) {
	return cart.reduce((total, item) => {
		return total + item.quantity;
	}, 0);
}

/*
	Обновляет счётчик 🛒 на странице
*/
function updateCartCount(cart) {
	cartCountElement.textContent = getCartCount(cart);
}

/*
	Сохраняет текущее состояние корзины в localStorage
*/
function saveCart(cart) {
	localStorage.setItem('cart', JSON.stringify(cart));
}

/*
	===== Рендер корзины =====
	Функция универсальная — получает контейнер,
	в который нужно отрисовать корзину.
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
				<span class="cart-item-title">
					${item.product.title}
				</span>

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
	===== Добавление товара в корзину =====
	Используем делегирование событий на контейнере товаров
*/
productsContainer.addEventListener('click', (event) => {
	const button = event.target;

	// Реагируем только на кнопку "Добавить в корзину"
	if (!button.classList.contains('add-to-cart-btn')) return;

	const productId = Number(button.dataset.id);
	const product = products.find(item => item.id === productId);

	if (!product) return;

	// Проверяем, есть ли уже такой товар в корзине
	const cartItem = cart.find(item => item.product.id === product.id);

	if (cartItem) {
		cartItem.quantity++;
	} else {
		cart.push({
			product,
			quantity: 1,
		});
	}

	saveCart(cart);
	updateCartCount(cart);
});

/*===== Очитска корзины =====*/


/*
	===== Открытие модального окна корзины =====
*/
openCartBtn.addEventListener('click', () => {
	// Создаём модалку и добавляем её в DOM
	const modalWrapper = document.createElement('div');
	modalWrapper.innerHTML = createCartModal();
	document.body.appendChild(modalWrapper);

	// Находим элементы внутри модалки
	const cartItemsContainer = modalWrapper.querySelector('#cart-items');
	const cartTotalElement = modalWrapper.querySelector('#cart-total');
	const closeBtn = modalWrapper.querySelector('.cart-modal-close');
	const modalOverlay = modalWrapper.querySelector('.cart-modal-overlay');


	modalOverlay.addEventListener('click', (event) => {
		if (event.target === modalOverlay) {
			modalWrapper.remove();
		}
	});


	// Отрисовываем корзину и сумму
	renderCart(cart, cartItemsContainer);
	cartTotalElement.textContent = getCartTotal(cart).toLocaleString('ru-RU');

	/*
		Управление количеством товаров в модалке
		(+ / −)
	*/
	cartItemsContainer.addEventListener('click', (event) => {
		const target = event.target;

		if (!target.classList.contains('quantity-btn')) return;

		const id = Number(target.dataset.id);
		const cartItem = cart.find(item => item.product.id === id);

		if (!cartItem) return;

		if (target.classList.contains('plus-btn')) {
			cartItem.quantity++;
		}

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

	// Очистка корзины
	const clearCartBtn = modalWrapper.querySelector('.clear-cart-btn');

	clearCartBtn.addEventListener('click', () => {
		cart.length = 0;              // очищаем массив
		localStorage.removeItem('cart'); // чистим storage

		renderCart(cart, cartItemsContainer);
		updateCartCount(cart);
		updateCartTotal(cart);
	});


	// Закрытие модалки по кнопке "Х"
	closeBtn.addEventListener('click', () => {
		modalWrapper.remove();
	});

});

