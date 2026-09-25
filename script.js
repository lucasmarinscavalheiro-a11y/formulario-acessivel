const quantityInput = document.querySelector("#quantidade");
const halfPriceInput = document.querySelector("#meia-quantidade");
const sectorInputs = document.querySelectorAll('input[name="setor"]');
const priceBreakdown = document.querySelector("#price-breakdown");
const priceTotal = document.querySelector("#price-total");
const halfPriceError = document.querySelector("#meia-error");
const currency = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

function updatePrice() {
	const selectedSector = document.querySelector('input[name="setor"]:checked');
	const quantity = Number(quantityInput.value);

	if (!selectedSector || !Number.isInteger(quantity) || quantity < 1 || quantity > 6) {
		priceBreakdown.textContent = "Escolha uma quantidade entre 1 e 6.";
		priceTotal.textContent = "—";
		return;
	}

	halfPriceInput.max = String(quantity);
	const halfPriceQuantity = halfPriceInput.value === "" ? 0 : Number(halfPriceInput.value);
	const halfPriceIsValid = Number.isInteger(halfPriceQuantity)
		&& halfPriceQuantity >= 0
		&& halfPriceQuantity <= quantity;
	const errorMessage = `Informe de 0 a ${quantity} ingressos com meia-entrada.`;

	halfPriceInput.setCustomValidity(halfPriceIsValid ? "" : errorMessage);
	halfPriceInput.setAttribute("aria-invalid", String(!halfPriceIsValid));
	halfPriceError.textContent = halfPriceIsValid ? "" : errorMessage;
	halfPriceError.classList.toggle("is-visible", !halfPriceIsValid);
	halfPriceError.hidden = halfPriceIsValid;

	if (!halfPriceIsValid) {
		priceBreakdown.textContent = errorMessage;
		priceTotal.textContent = "—";
		return;
	}

	const unitPrice = Number(selectedSector.dataset.price);
	const fullPriceQuantity = quantity - halfPriceQuantity;
	const priceParts = [];

	if (fullPriceQuantity > 0) {
		priceParts.push(`${fullPriceQuantity} ${fullPriceQuantity === 1 ? "inteira" : "inteiras"} × ${currency.format(unitPrice)}`);
	}
	if (halfPriceQuantity > 0) {
		priceParts.push(`${halfPriceQuantity} ${halfPriceQuantity === 1 ? "meia-entrada" : "meias-entradas"} × ${currency.format(unitPrice / 2)}`);
	}

	priceBreakdown.textContent = priceParts.join(" + ");
	priceTotal.textContent = currency.format(fullPriceQuantity * unitPrice + halfPriceQuantity * unitPrice / 2);
}

quantityInput.addEventListener("input", updatePrice);
halfPriceInput.addEventListener("input", updatePrice);
sectorInputs.forEach((sectorInput) => {
	sectorInput.addEventListener("change", updatePrice);
});

updatePrice();