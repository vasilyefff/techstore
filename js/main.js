import { products } from './data/products.js';
import { createProductCard } from './components/ProductCard.js';

const productsContainer = document.getElementById('products');
const cartTotalElement = document.getElementById('cart-total');
const cartItemsContainer = document.getElementById('cart-items');

const cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartTotal(cart);
renderCart(cart);

productsContainer.innerHTML = products
	.map(product => createProductCard(product))
	.join('');


function getCartTotal(cart) {
	return cart.reduce((total, item) => {
		return total + item.product.price * item.quantity;
	}, 0);
}

function updateCartTotal(cart) {
	const total = getCartTotal(cart);
	cartTotalElement.textContent = total.toLocaleString('ru-RU');
}

function saveCart(cart) {
	localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart(cart) {
	cartItemsContainer.innerHTML = '';

	cart.forEach(item => {
		const cartItemHTML = `
			<div class="cart-item">
				<span class="cart-item-title">
					${item.product.title}
				</span>

				<span class="cart-item-quantity">
					x ${item.quantity}
				</span>

				<span class="cart-item-price">
					${(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
				</span>
			</div>
		`;

		cartItemsContainer.innerHTML += cartItemHTML;
	});
}


productsContainer.addEventListener('click', (event) => {
	const button = event.target;

	if (!button.classList.contains('add-to-cart-btn')) return;

	const productId = Number(button.dataset.id);
	const product = products.find(item => item.id === productId);

	if (!product) return;

	const cartItem = cart.find(item => item.product.id === product.id);

	if (cartItem) {
		cartItem.quantity += 1;
	} else {
		cart.push({
			product,
			quantity: 1,
		});
	}

	saveCart(cart);
	updateCartTotal(cart);
	renderCart(cart);
});
