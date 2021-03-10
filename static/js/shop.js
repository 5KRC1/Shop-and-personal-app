let carts = document.querySelectorAll('.addtocart'); //takes buttons from html


// array of objects of all the products
let products = [
    {
        name: 'shark',
        tag: 'shark1',
        price: 5,
        inCart: 0
    },
    {
       name: 'mjolnir',                                                                          
       tag: 'mjolnir1',
       price: 5,
       inCart: 0
    },
    {
        name: 'iron-man',
        tag: 'ironman',
        price: 5,
        inCart: 0
    },
    {
        name: 'avengers',
        tag: 'avengers1',
        price: 5,
        inCart: 0
    },
    {
        name: 'controller',
        tag: 'game',
        price: 5,
        inCart: 0
    },
    {
        name: 'p90',
        tag: 'p901',
        price: 5,
        inCart: 0
    },
    {
        name: 'basic',
        tag: 'basic',
        price: 5,
        inCart: 0
    }

];


// loop that checks for clicks
for (let i=0; i < carts.length; i++){
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
}

// function that updates the span of in cart items in html
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers')

    if( productNumbers ) {
         document.querySelector('.cart-link span').textContent = productNumbers;
    }
}

// function gets the number of total products in cart
function cartNumbers(product){
    let productNumbers = localStorage.getItem('cartNumbers')
    productNumbers = parseInt(productNumbers);
    if( productNumbers ) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart-link span').textContent = productNumbers + 1;
    }else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart-link span').textContent = 1;
    }

    setItems(product)
}

// function that identifies products in cart and updates in cart variable in object
function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if (cartItems != null) {        
        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart +=1;
    }else {
        cartItems = {
            [product.tag]: product
        }
    }
    product.inCart = 1;

    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

// calculates the cost of items in cart
function totalCost(product) {
    let cartCost = localStorage.getItem('totalCost');
   
    if(cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + product.price);
    }else {
        localStorage.setItem('totalCost', product.price); 
    }
}


//cart
function displayCart() {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector('.products-wrap');

    if(cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <div class="${item.tag}">
                <div class="products">
                        <div class="product">
                            <ion-icon name="close-circle" onclick="
                                let container = localStorage.getItem('productsInCart');
                                container = JSON.parse(container);
                                // updates cart numbers
                                let productNumbers = localStorage.getItem('cartNumbers')
                                productNumbers = parseInt(productNumbers);
                                localStorage.setItem('cartNumbers', productNumbers - ${item.inCart});
                                document.querySelector('.cart-link span').textContent = productNumbers - ${item.inCart};
                                // updates the total cost
                                let cartCost = localStorage.getItem('totalCost');
                                cartCost = parseInt(cartCost);
                                localStorage.setItem('totalCost', cartCost - parseInt(${item.inCart}) * parseInt(${item.price}));
                                // remove item from cart
                                delete container.${item.tag};
                                localStorage.setItem('productsInCart', JSON.stringify(container));
                                location.reload();
                            ">
                            </ion-icon>
                            <img src="/static/photos/img/${item.tag}.jpg">
                            <span>${item.name}</span>
                        </div>
                        <div class="price">${item.price} Eur</div>
                        <div class="quantity"><ion-icon name="remove-circle" onclick="
                                let container = localStorage.getItem('productsInCart');
                                container = JSON.parse(container);
                                // updates cart numbers
                                let productNumbers = localStorage.getItem('cartNumbers')
                                productNumbers = parseInt(productNumbers);
                                localStorage.setItem('cartNumbers', productNumbers - 1);
                                document.querySelector('.cart-link span').textContent = productNumbers - 1;
                                // updates the total cost
                                let cartCost = localStorage.getItem('totalCost');
                                cartCost = parseInt(cartCost);
                                localStorage.setItem('totalCost', cartCost - parseInt(${item.price}));
                                // update total
                                
                                // change item inCart
                                if (container['${item.tag}'].inCart > 1){
                                    container['${item.tag}'].inCart -= 1;
                                    localStorage.setItem('productsInCart', JSON.stringify(container));
                                    location.reload();
                                }else if (container['${item.tag}'].inCart == 1){
                                    delete container['${item.tag}'];
                                    localStorage.setItem('productsInCart', JSON.stringify(container));
                                    location.reload();
                                };
                                location.reload();
                        ">
                        </ion-icon></i>${item.inCart}<ion-icon name="add-circle" onclick="
                                let container = localStorage.getItem('productsInCart');
                                container = JSON.parse(container);

                                if (container['${item.tag}'].inCart > 0 && container['${item.tag}'].inCart < 5){
                                // updates cart numbers
                                    let productNumbers = localStorage.getItem('cartNumbers')
                                    productNumbers = parseInt(productNumbers);
                                    localStorage.setItem('cartNumbers', productNumbers + 1);
                                    document.querySelector('.cart-link span').textContent = productNumbers + 1;
                                // updates the total cost
                                    let cartCost = localStorage.getItem('totalCost');
                                    cartCost = parseInt(cartCost);
                                    localStorage.setItem('totalCost', cartCost + parseInt(${item.price}));
                                // remove item from cart
                                    container['${item.tag}'].inCart += 1;
                                    localStorage.setItem('productsInCart', JSON.stringify(container));
                                    location.reload();
                                }else if (container['${item.tag}'].inCart == 5){
                                    alert('Sorry, you cannot buy more than 5.');
                                };
                                
                                location.reload();
                        ">
                        </ion-icon></div>
                        <div class="total">${item.inCart * item.price} Eur</div>
                </div>
            </div>
            `

        });

        let cartCost = localStorage.getItem('totalCost');
        productContainer.innerHTML += `
        <div class="basketTotalContainer">
            <h4 class="basketTotal1">Total: </h4>
            <h4 class="basketTotal">${cartCost} Eur</h4>
        </div>
        `
    }
}



let cart3490 = localStorage.getItem('cartNumbers');
cart3490 = JSON.parse(cart3490);

if (cart3490 == 0){
    localStorage.removeItem('productsInCart');
    localStorage.removeItem('cartNumbers');
    localStorage.removeItem('totalCost');
    location.reload();
}

function button() {
    let btn = document.querySelector(".orderButton");
        btn.addEventListener('click', () => {
            if (localStorage.getItem('productsInCart') != null)
                btn.innerHTML = `
                <a href="/userdata" class="orderLink">Confirm Order</a>
                `  
            else{
                alert('Your cart is empty.');
            }
        });
}



// runs on load cart numbers at start
onLoadCartNumbers();

displayCart();

button();