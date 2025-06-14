function searchProdutos() {
  let dados;
  fetch("./menu.json")
    .then((resposta) => resposta.json())
    .then((json) => {
      renderProdutos(json);
    });
}
searchProdutos();

function renderProdutos(dados) {
  if (Array.isArray(dados) && dados.length > 0) {
    let menuArea = document.querySelector("#menu");
    dados.forEach((item, index) => {
      let template = `<li class="item-menu" data-id="${index}">
            <div class="item-menu-left">
              <div class="menu-text">
              <span class="item-menu-price">${item.preco.toLocaleString(
                "pt-br",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}</span>
              <h2 class="item-menu-title">${item.produto}</h2>
              </div>
              <p class="item-menu-decription">${
                item.hasOwnProperty("description")
                  ? item.description
                  : "Nenhum descrição informada"
              }</p>
            </div>
            <button class="btn-add" data-id="${index}">Adicionar</button>
          </li>`;

      menuArea.innerHTML += template;
    });
    addItemCart();
  }
}

//Info: Função para adicionar items no carrinho
function addItemCart() {
  let btnAdd = document.querySelectorAll(".btn-add");
  let cardItemArea = document.querySelector("#cart .cart-items-area");
  let total = document.querySelector(".total-carts .total-carts-price");
  let meuCarrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  function NovoItem(idProd, produto, preco) {
    this.id = idProd;
    this.produto = produto;
    this.preco = preco;
    this.qtd = 1;
  }

  // Info: Função para o botão adicionar
  function handleAddItemCart(e) {
    let idProd = +e.currentTarget.getAttribute("data-id");
    let parent = e.currentTarget.parentElement;
    let produto = parent.querySelector(".item-menu-title").innerText;
    let price = +parent
      .querySelector(".item-menu-price")
      .innerText.replace("R$", "")
      .replace(",", ".");

    let novoItem = new NovoItem(idProd, produto, price);
    if (!meuCarrinho.some((produto) => produto.id === novoItem.id)) {
      meuCarrinho.push(novoItem);
    } else {
      let index = meuCarrinho.findIndex((produto) => produto.id === idProd);
      meuCarrinho[index].qtd += 1;
    }
    renderCarrinho();
  }

  function renderCarrinho() {
    cardItemArea.innerHTML = "";
    if (meuCarrinho.length === 0) {
      cardItemArea.innerHTML = "Nenhum item no carrinho";
      total.innerText = "R$ 00,00";
    } else {
      meuCarrinho.forEach((item) => {
        cardItemArea.innerHTML += `
      <div class="cart-item" data-id="${item.id}">
            <h2 class="cart-item-title">${item.produto}</h2>
            <div class="cart-item-buttons">
              <button class="remove">-</button>
              <span class="item-qtd">${item.qtd}</span>
              <button class="add">+</button>
            </div>
            <span class="remove-item">Remover</span>
          </div>
    `;
        let totalCarrinho = meuCarrinho.reduce((acumulador, item) => {
          return (acumulador += item.preco * item.qtd);
        }, 0);

        total.innerText = totalCarrinho.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });
      });
    }

    let btnsADD = document.querySelectorAll(".cart-item .add");
    let btnRemove = document.querySelectorAll(".cart-item .remove");
    let removeItem = document.querySelectorAll(".cart-item .remove-item");

    // Info: Botão de adicionar quantidade
    function HandleAddQtd(e) {
      let parent = e.currentTarget.parentElement.parentElement;
      let index = meuCarrinho.findIndex(
        (prod) => prod.id === +parent.getAttribute("data-id")
      );
      meuCarrinho[index].qtd += 1;
      renderCarrinho();
    }

    // Info: Botão de remover quantidade
    function HandleRemoveQtd(e) {
      let parents = e.currentTarget.parentElement.parentElement;
      let index = meuCarrinho.findIndex(
        (prod) => prod.id === +parents.getAttribute("data-id")
      );
      meuCarrinho[index].qtd -= 1;
      if (meuCarrinho[index].qtd === 0) {
        meuCarrinho.splice(index, 1);
      }
      renderCarrinho();
    }

    // info: Botão de remover item do carrinho
    function handleRemoveItem(e) {
      let parents = e.currentTarget.parentElement;
      let index = meuCarrinho.findIndex(
        (prod) => prod.id === +parents.getAttribute("data-id")
      );
      meuCarrinho.splice(index, 1);
      renderCarrinho();
    }

    btnsADD.forEach((item) => item.addEventListener("click", HandleAddQtd));
    btnRemove.forEach((item) =>
      item.addEventListener("click", HandleRemoveQtd)
    );

    removeItem.forEach((item) =>
      item.addEventListener("click", handleRemoveItem)
    );

    localStorage.setItem("carrinho", JSON.stringify(meuCarrinho));
  }

  renderCarrinho();

  btnAdd.forEach((button) => {
    if (button) {
      button.addEventListener("click", handleAddItemCart);
    }
  });
}
