export function createProductCard(product) {

	const categoryEmojiMap = {
		'Телефоны': '📱',
		'Ноутбуки': '💻',
		'Аксессуары': '🎧',
		'Мониторы': '🖥️',
	};

	return `
    <div class="product-card">
     
	    <div class="product-image">
        ${categoryEmojiMap[product.category] || '📦'}
      </div>

      <div class="product-meta">
        <span class="product-category">${product.category}</span>
        <span class="product-rating">⭐ ${product.rating}</span>
      </div>

      <h3 class="product-title">${product.title}</h3>

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
