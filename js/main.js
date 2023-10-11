let products = document.querySelector(".products");
let basket = JSON.parse(window.localStorage.getItem("basket")) || [];
async function getProductsData(){
    let response = await fetch("js/products.json");
    let data = await response.json();
  let generateShop = ()=>{
        return (products.innerHTML = data.map(x=>{
            let search = basket.find(y=>y.id === x.id) || [];
            return `<div class="col-12 col-md-6 col-lg-3 mb-4">
            <li class="product card" id="product-id-${x.id}">
                <div class="img-wrap card-img">
                    <img src="${x.img}" alt="" style="height: auto; width: 100%;">
                </div>
                <div class="card-body p-3">
                <h3 class="card-title">${x.name}</h3>
                <p class="card-text">${x.desc} </p>
                <div class="price-quantity justify-content-between d-flex">
                <span class="price text-success hp">${x.price}$</span> 
                <div class=" buttons d-flex  justify-content-between align-items-baseline">
                    <i onclick="decreament(${x.id})" class="fa-solid fa-minus"></i>
                    <div id="${x.id}" class="quantity mx-3">
                    ${search.quantity === undefined ? 0 : search.quantity}
                    </div>
                    <i onclick="increament(${x.id})" class="fa-solid fa-plus"></i>
                </div>
            </div>
                </div>
            </li>
            </div>`;
        }).join(""));

    };
    generateShop();

};

getProductsData();

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
    addBasketToLocal(basket);
    update(item);
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
    console.log(basket);
    addBasketToLocal(basket);
};
function update(item){
    let search = basket.find(x=>x.id === item.id);
    item.innerHTML = search.quantity;
    calculation();
};

function calculation(){
    let cartIcon  = document.querySelector(".cart-amount");
      cartIcon.innerHTML = basket.map(x=>x.quantity).reduce((x,y)=> x+y,0);  
}
calculation();

function addBasketToLocal(basket){
    window.localStorage.setItem("basket",JSON.stringify(basket));
}
