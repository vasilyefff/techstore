import { products } from './data/products.js';
import { createProductCard } from './components/ProductCard.js';

const productsContainer = document.getElementById('products');

products.forEach(product => {
	productsContainer.innerHTML += createProductCard(product);
});

