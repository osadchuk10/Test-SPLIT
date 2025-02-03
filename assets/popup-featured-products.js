const events = ['DOMContentLoaded', 'shopify:section:load', 'shopify:section:select'];
events.forEach((event) => {
  document.addEventListener(event, popupSettings);
});
function popupSettings() {
  const showOnce = document.querySelector('.popup').getAttribute('data-show-once') === 'true';  
  const popup = document.querySelector('.popup');
  const close = document.querySelector('.popup__close');
  const overlay = document.querySelector('.popup__overlay');
  const productInfo = document.querySelectorAll('.card__content');
  const prodTitleElement = document.querySelector('.popup__product-name');
  const addToCartButton = document.querySelector('#addToCartPopupButton');
  const successMessage = document.querySelector('.popup__success-message');
  const popupMoney = document.querySelector('.popup__product-money');
  const productOriginalPrice1 = document.querySelector('#Popup-Original-Price-First-Product').getAttribute('data-price');
  const productOriginalPrice2 = document.querySelector('#Popup-Original-Price-Second-Product').getAttribute('data-price');
  const productSalePrice1 = document.querySelector('#popup__product-sale-price-first');
  const productSalePrice2 = document.querySelector('#popup__product-sale-price-second');
  const discount = 10;
  const result = ((discount / 100) * (Number(productOriginalPrice1) + Number(productOriginalPrice2))) / 100;
  const discountPrice1 = ((1 - discount / 100) * Number(productOriginalPrice1)) / 100;
  const discountPrice2 = ((1 - discount / 100) * Number(productOriginalPrice2)) / 100;

  productSalePrice1.textContent = discountPrice1;
  productSalePrice2.textContent = discountPrice2;
  popupMoney.textContent = result.toFixed(2);

  const openClosePopup = () => {
    successMessage.classList.remove('popup__success-message--active');
  
    if (showOnce && localStorage.getItem('popupShown') === 'true') {
      return;
    }
    

    let productTitle = '';
  
    
    productInfo.forEach(item => {
      item.addEventListener('click', () => {
        const titleElement = item.querySelector('.card__heading a');
        if (titleElement) {
          productTitle = titleElement.textContent.trim();
          prodTitleElement.textContent = productTitle;
        }
      });
    });

    popup.classList.add('popup--active');
    overlay.style.display = 'block';
    addToCartButton.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (showOnce) {
      localStorage.setItem('popupShown', 'true');
    }

    const closePopup = () => {
      popup.classList.remove('popup--active');
      overlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    };

    close.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
  };


  document.querySelectorAll('product-form .quick-add__submit').forEach(button => {
   
    
    button.addEventListener('click', openClosePopup);
  });

  

  document.body.addEventListener('click', (event) => {
    if (event.target.closest('modal-opener .quick-add__submit')) {
      const checkButton = () => {
        const addButton = document.querySelector('.product-form__submit');
        if (addButton) {
          addButton.addEventListener('click', openClosePopup, { once: true });
        } else {
          requestAnimationFrame(checkButton);
        }
      };
      checkButton();
    }
  });


  addToCartButton.addEventListener('click', () => {
    const id1 = addToCartButton.dataset.id1;
    const id2 = addToCartButton.dataset.id2;

    const formData = {
      items: [
        { id: parseInt(id1, 10), quantity: 1 },
        { id: parseInt(id2, 10), quantity: 1 },
      ],
    };

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(() => {
        successMessage.classList.add('popup__success-message--active');
        addToCartButton.style.display = 'none';
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
}