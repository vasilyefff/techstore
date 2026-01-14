export function createCartModal() {

	return `
    <div class="cart-modal-overlay">
      <div class="cart-modal">
        <button class="cart-modal-close">х</button>

        <h2>Корзина</h2>

        <div id="cart-items"></div>

        <div class="cart-modal-footer">
					<button class="clear-cart-btn">Очистить корзину</button>

					<div class="cart-total">
						<span>Итого:</span>
						<span id="cart-total">0</span>
					</div>
				</div>

      </div>
    </div>
  `;
}
