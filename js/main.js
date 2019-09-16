//FETCH EXTERNAL FILE
function fetchData(){
  return fetch('bikerentals.json', {
    headers: {
      'Content-Type': 'applications.json',
      'Accept': 'application.json'
    }
  }).then(res => res.json())
};

//LOAD EXTERNAL FILE DATA. USE PROMISE FOR ABILITY TO FETCH OTHER DATA AND RETURN IN PROMISE TOGETHER
function loadData(){
  return Promise.all([fetchData()]);
};

loadData()
  .then(([data]) => {
    let render = '';
    data.products.forEach((item, i)=> {
      render += 
      `
        <div class="store-item">
          <img class="store-item-image" src=${item.image} alt=${item.name}>
          <div class="store-item-body">
            <h4 class="store-item-title">${item.name}</h4>
            <p class="store-item-price">$${item.price.toFixed(2)}</p>
          </div>
          <div class="store-item-button">Add to Cart</div>
        </div>
      `
    });
    document.getElementById('store').innerHTML = render;
    loadEvents();
  }
);

//READY EVENT LISTENERS  
function loadEvents(){
  let trashIcon = document.getElementsByClassName('fa-trash-alt');
 
  for(let i = 0; i < trashIcon.length; i++){
    let button = trashIcon[i];
    button.addEventListener('click', removeCartItem);
  }

  let quantityInput = document.getElementsByClassName('navigation-cart-menu--input');
  for(let i = 0; i < quantityInput.length; i++){
    let input = quantityInput[i];
    input.addEventListener('change', quantityChanged);
  }

  let addToCartButtons = document.getElementsByClassName('store-item-button');
  for(let i = 0; i < addToCartButtons.length; i++){
    let button = addToCartButtons[i];
    button.addEventListener('click', addToCart);
  }

  let nav = document.querySelector('.navigation');
  nav.addEventListener('click', closeMenu);
};

//CLOSE MENU WHEN CLICKED OUTSIDE OF MENU
function closeMenu(e){
  let navOut = document.querySelector('.navigation-out');
  let navToggle = document.getElementById('navigation-toggle');
  let navCloseIcon = document.querySelector('.navigation-menu-close');

  if(e.target == navOut || e.target == navCloseIcon){
    navToggle.checked = false;
  }
};

function removeCartItem(e){
  let buttonClicked = e.target;
  buttonClicked.parentElement.remove();
  updateCartTotal();
};

//When Input is changed in cart for quantity of items this ensures it's only a positive integer
function quantityChanged(e){
  let num = e.target;
  if(isNaN(num.value) || num.value <= 0){
    num.value = 1;
  }
  updateCartTotal();
};

function addToCart(e){
  //Grab the title price and image of element(bike)
  let item = e.target.parentElement;
  let title = item.getElementsByClassName('store-item-title')[0].innerText;
  let price = item.getElementsByClassName('store-item-price')[0].innerText;
  let image = item.getElementsByClassName('store-item-image')[0].src;

  //Create DIV element to inject into DOM into the cart
  let cartRow = document.createElement('div');
  cartRow.className = 'navigation-cart-menu--row';
  cartRow.innerText = title;
  let storeItem = document.getElementsByClassName('navigation-cart-menu')[0];

  let storeItemName = storeItem.getElementsByClassName('navigation-cart-menu--title');

  for(let i = 0; i < storeItemName.length; i++){
    if(storeItemName[i].innerText == title){
      alert('This Item has already been placed in your cart.');
      return;
    }
  }
 
  let render = `
      <img src=${image} class="navigation-cart-menu--img" alt="Item Image">
      <h4 class="navigation-cart-menu--title">${title}</h4>
      <p class="navigation-cart-menu--price">${price}</p>
      <input type="number" id="itemNumber" class="navigation-cart-menu--input" value="1">
      <i class="far fa-trash-alt navigation-cart-menu--trash"></i>
  `;

  //take render and inject into DIV element created
  cartRow.innerHTML = render;

  //Ensure the element is inserted before the last element which is the Total Price
  let insertBeforeItem = document.getElementById('cartTotal');
  storeItem.insertBefore(cartRow, insertBeforeItem);

  //Add event listeners for buttons since they were created after the DOM was loaded
  cartRow.childNodes[9].addEventListener('click', removeCartItem);
  //Add event listener for input value
  cartRow.childNodes[7].addEventListener('change', quantityChanged);

  updateCartTotal();
};

function updateCartTotal(){
  //Get the parent div *menu* & get the cart row
  let cartItemContainer = document.getElementsByClassName('navigation-cart-menu')[0];
  let cartRows = cartItemContainer.getElementsByClassName('navigation-cart-menu--row');

  //loop through the cart elements to calculate the correct total price & get total items in cart
  let total = 0;
  let totalCartItems = 0;
  for(let i = 0; i < cartRows.length; i++){
    let cartRow = cartRows[i];
    //get the price and the quantity in the input
    let priceElement = cartRow.getElementsByClassName('navigation-cart-menu--price')[0];
    let quantityElement = cartRow.getElementsByClassName('navigation-cart-menu--input')[0];
    //remove dollar sign and turn string into number
    let price = parseFloat(priceElement.innerText.replace('$', ''));
    //get values from input fields
    let quantity = quantityElement.value;
    //add total price
    total = total + (price * quantity);
    //ensure we get 2 decimal places
    var totalFixed = total.toFixed(2);
    //add total items in cart
    totalCartItems = totalCartItems + parseInt(quantity);
  }
  //target the cart number element and set it equal to the total items in cart
  document.querySelector('.navigation-cart-number').innerText = totalCartItems;
  let cartTotal = document.getElementById('cartTotal');

  //If the cart price total goes from a value to 0 it's inner text becomes undefined, so we change it back to a string
  if(total === 0){
    cartTotal.innerText = 'Your Cart is Empty';
    return;
  }
  //set the total price
  cartTotal.innerText = `TOTAL PRICE: $${totalFixed}`;
};