
let basket = JSON.parse(window.localStorage.getItem("basket")) || [];
let shopingCart = document.querySelector(".shoping-cart");
let label = document.querySelector(".label");
calculation();

function calculation(){
    let cartIcon  = document.querySelector(".cart-amount");
      cartIcon.innerHTML = basket.map(x=>x.quantity).reduce((x,y)=> x+y,0);  
}
let generateCart;
async function getCartData(){
    let response = await fetch("js/products.json");
    let data = await response.json();
 generateCart = ()=> {
     console.log(basket);
    if(basket.length != 0){
      return (shopingCart.innerHTML= basket.map(x=>{
            let search = data.find(y=>y.id === x.id);
            return `
            <div class="cart-item d-flex flex-column flex-md-row mb-4 border position-relative">
            <img class="cart-img" src="${search.img}" alt="">
            <div class="p-4 cart-details">
                <div class="text-center text-md-left">
                <span class="product-name font-weight-bold">${search.name}</span>
                <span class="price badge badge-dark p-2">${search.price}$</span>
                </div>
                <div class=" buttons d-flex justify-content-center justify-content-md-start align-items-baseline">
                <i onclick="decreament(${x.id})" class="fa-solid fa-minus"></i>
                <div id="${x.id}" class="quantity mx-3">${x.quantity}</div>
                <i onclick="increament(${x.id})" class="fa-solid fa-plus"></i>
            </div>
                <p class="product-total text-center text-md-left font-weight-bold mt-3">${search.price * x.quantity}$</p>
            </div>
            <i onclick="removeItem(${x.id})" class="fa-solid fa-xmark"></i>
            </div>
            `
        }).join(""));
    }else{
        label.innerHTML = `
        <div class="cover">
        <h2 class="mt-4">Cart is empty</h2>
        <a href="index.html" class="btn btn-dark text-white">Back To Home</a>
        </div>
        `
    }
}
generateCart();
}
getCartData();
function increament(item){
    let search = basket.find(x=> x.id === item.id);
    if(search === undefined){
        basket.push({
            id : item.id,
            quantity : 1
        });
    }
    else{
        search.quantity += 1;
    }
    getCartData();
    update(item);
    addBasketToLocal(basket);
    console.log(basket);
};
function decreament(item){
    
    let search = basket.find(x=> x.id === item.id);

    if(search === undefined)return;
    else if(search.quantity === 0) return;
    else{
        search.quantity -= 1;
    }
  
    update(item);
    basket = basket.filter(x=>x.quantity != 0);
    addBasketToLocal(basket);
    getCartData();
};
function update(item){
    let search = basket.find(x=>x.id === item.id);
    item.innerHTML = search.quantity;
    calculation();
    generatePrice();
};



function addBasketToLocal(basket){
    window.localStorage.setItem("basket",JSON.stringify(basket));
}

function removeItem(item){
    basket = basket.filter(x=>x.id != item.id);
    generatePrice();
    getCartData(); 
    calculation();
    addBasketToLocal(basket);
}
let totalPrice;
async function generatePrice(){
    let response = await fetch("js/products.json");
    let data = await response.json();
    totalPrice = ()=>{
        if(basket.length != 0){
        let amount= basket.map(x=>{
        let search = data.find(y=> y.id == x.id);
            return x.quantity * search.price;
        }).reduce((x,y)=>x+y,0);
        label.innerHTML = `
        <h3>Total Price : ${amount}$</h3>
        <button class="btn btn-success">checkout</button>
        <button onclick="clearAll()" class="clear btn btn-danger">Clear</button>
        `
    }
    }
    totalPrice();

}
generatePrice();
// totalPrice();

function clearAll(){
    basket = [];
    addBasketToLocal(basket);
    calculation();
    getCartData();
    
}
