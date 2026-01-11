export function createProductCard(product) {
	const imagePath = `assets/images/${product.image}`;

	return `
    <div class="product-card">
      <img 
        src="${imagePath}" 
        alt="${product.title}" 
        class="product-image"
      />

      <h3>${product.title}</h3>

      <p class="product-price">
        ${product.price.toLocaleString('ru-RU')} ₽
      </p>
			
			<button 
        class="add-to-cart-btn"
        data-id="${product.id}"
      >
        В корзину
      </button>
    </div>
  `;
}
