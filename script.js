/* ==========================================
   FORM — PREMIUM ECOMMERCE JAVASCRIPT
========================================== */

/*
IMPORTANT:
The ibb.co URLs supplied are page URLs, not always
direct image files.

If an image does not appear, replace its URL below
with the direct .jpg / .png / .webp image URL.
*/

const products = [
  {
    id: 1,
    name: "RELAXED DENIM",
    category: "denim",
    categoryName: "DENIM",
    price: 2499,
    image: "https://ibb.co/rjpHdzg",
    sizes: [28, 30, 32, 34, 36],
    description: "A relaxed everyday denim silhouette with a clean contemporary shape."
  },
  {
    id: 2,
    name: "WIDE LEG 90",
    category: "wide",
    categoryName: "WIDE LEG",
    price: 2799,
    image: "https://ibb.co/Qv0rPpNQ",
    sizes: [30, 32, 34, 36, 38],
    description: "A wide-leg silhouette designed for volume, movement and modern proportion."
  },
  {
    id: 3,
    name: "RAW BAGGY",
    category: "baggy",
    categoryName: "BAGGY",
    price: 2999,
    image: "https://ibb.co/vvKc9HSk",
    sizes: [28, 30, 32, 34, 36],
    description: "Relaxed through the leg with a structured shape and effortless attitude."
  },
  {
    id: 4,
    name: "SIGNATURE DENIM",
    category: "denim",
    categoryName: "DENIM",
    price: 3299,
    image: "https://ibb.co/kVbxynkX",
    sizes: [30, 32, 34, 36, 38],
    description: "Our signature denim built around a premium contemporary fit."
  },
  {
    id: 5,
    name: "EVERYDAY TROUSER",
    category: "trouser",
    categoryName: "TROUSERS",
    price: 2299,
    image: "https://ibb.co/R49TKpNr",
    sizes: [28, 30, 32, 34, 36],
    description: "A refined everyday trouser designed to work across every look."
  },
  {
    id: 6,
    name: "OVERSIZED FIT",
    category: "baggy",
    categoryName: "BAGGY",
    price: 2899,
    image: "https://ibb.co/DHdCMGtG",
    sizes: [30, 32, 34, 36, 38],
    description: "An oversized relaxed silhouette with a strong editorial profile."
  }
];

/* ==========================================
   STATE
========================================== */

let cart = JSON.parse(localStorage.getItem("formCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("formWishlist")) || [];
let activeProduct = null;
let selectedSize = null;
let modalQuantity = 1;
let currentFilter = "all";

/* ==========================================
   HELPERS
========================================== */

const money = amount => {
  return "₹" + amount.toLocaleString("en-IN");
};

function saveState() {
  localStorage.setItem("formCart", JSON.stringify(cart));
  localStorage.setItem("formWishlist", JSON.stringify(wishlist));
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

/* ==========================================
   PRODUCT CARD
========================================== */

function productCard(product) {

  const liked = wishlist.includes(product.id);

  return `
    <article class="product-card" data-id="${product.id}">

      <div class="product-image">

        <span class="product-number">
          ${String(product.id).padStart(2, "0")}
        </span>

        <button class="wishlist ${liked ? "active" : ""}" 
                data-wishlist="${product.id}">
          <svg viewBox="0 0 24 24">
            <path d="M20.8 8.8c0 5.5-8.8 10.5-8.8 10.5S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z"/>
          </svg>
        </button>

        <img 
          src="${product.image}" 
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.opacity='.25'"
        >

        <button class="quick-add" data-quick="${product.id}">
          QUICK ADD
        </button>

      </div>

      <div class="product-meta">

        <div class="product-top">
          <span class="product-name">${product.name}</span>
          <span class="product-price">${money(product.price)}</span>
        </div>

        <div class="product-category">
          ${product.categoryName}
        </div>

        <div class="product-sizes">
          ${product.sizes.map(size => `<span>${size}</span>`).join("")}
        </div>

      </div>

    </article>
  `;
}

/* ==========================================
   RENDER PRODUCTS
========================================== */

function renderProducts() {

  const featured = document.getElementById("featuredProducts");
  const shop = document.getElementById("shopProducts");

  if (featured) {
    featured.innerHTML = products
      .slice(0, 6)
      .map(productCard)
      .join("");
  }

  renderShop();
  attachProductEvents();
}

function renderShop() {

  const shop = document.getElementById("shopProducts");

  let filtered = [...products];

  if (currentFilter !== "all") {
    filtered = filtered.filter(
      product => product.category === currentFilter
    );
  }

  const sort = document.getElementById("sortSelect")?.value;

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (sort === "newest") {
    filtered.sort((a, b) => b.id - a.id);
  }

  shop.innerHTML = filtered.map(productCard).join("");

  attachProductEvents();
}

/* ==========================================
   PRODUCT EVENTS
========================================== */

function attachProductEvents() {

  document.querySelectorAll(".product-card").forEach(card => {

    card.addEventListener("click", e => {

      if (
        e.target.closest(".wishlist") ||
        e.target.closest(".quick-add")
      ) return;

      const id = Number(card.dataset.id);
      openProduct(id);
    });

  });

  document.querySelectorAll("[data-quick]").forEach(button => {

    button.addEventListener("click", e => {

      e.stopPropagation();

      const id = Number(button.dataset.quick);
      openProduct(id);
    });

  });

  document.querySelectorAll("[data-wishlist]").forEach(button => {

    button.addEventListener("click", e => {

      e.stopPropagation();

      const id = Number(button.dataset.wishlist);

      toggleWishlist(id);
    });

  });
}

/* ==========================================
   WISHLIST
========================================== */

function toggleWishlist(id) {

  if (wishlist.includes(id)) {

    wishlist = wishlist.filter(item => item !== id);
    showToast("REMOVED FROM WISHLIST");

  } else {

    wishlist.push(id);
    showToast("ADDED TO WISHLIST");

  }

  saveState();
  renderProducts();
}

/* ==========================================
   PRODUCT MODAL
========================================== */

function openProduct(id) {

  activeProduct = products.find(product => product.id === id);

  if (!activeProduct) return;

  selectedSize = activeProduct.sizes[2] || activeProduct.sizes[0];
  modalQuantity = 1;

  document.getElementById("modalImage").src = activeProduct.image;
  document.getElementById("modalName").textContent = activeProduct.name;
  document.getElementById("modalPrice").textContent = money(activeProduct.price);
  document.getElementById("modalAddPrice").textContent = money(activeProduct.price);
  document.getElementById("modalCategory").textContent = activeProduct.categoryName;
  document.getElementById("modalDescription").textContent = activeProduct.description;
  document.getElementById("modalQty").textContent = modalQuantity;

  document.querySelectorAll(".size").forEach(button => {

    button.classList.toggle(
      "selected",
      Number(button.textContent) === selectedSize
    );

  });

  document.getElementById("productModal").classList.add("open");

  document.body.style.overflow = "hidden";
}

/* ==========================================
   CLOSE PRODUCT
========================================== */

document.getElementById("closeProduct").addEventListener("click", () => {

  document.getElementById("productModal").classList.remove("open");

  document.body.style.overflow = "";

});

/* ==========================================
   SIZE SELECT
========================================== */

document.querySelectorAll(".size").forEach(button => {

  button.addEventListener("click", () => {

    selectedSize = Number(button.textContent);

    document.querySelectorAll(".size").forEach(btn => {
      btn.classList.remove("selected");
    });

    button.classList.add("selected");
  });

});

/* ==========================================
   QUANTITY
========================================== */

document.getElementById("minusQty").addEventListener("click", () => {

  if (modalQuantity > 1) {
    modalQuantity--;
    document.getElementById("modalQty").textContent = modalQuantity;
  }

});

document.getElementById("plusQty").addEventListener("click", () => {

  modalQuantity++;

  document.getElementById("modalQty").textContent = modalQuantity;

});

/* ==========================================
   ADD TO CART
========================================== */

document.getElementById("modalAdd").addEventListener("click", () => {

  if (!activeProduct) return;

  addToCart(
    activeProduct.id,
    selectedSize,
    modalQuantity
  );

  document.getElementById("productModal").classList.remove("open");

  document.body.style.overflow = "";

  openCart();
});

/* ==========================================
   ADD PRODUCT
========================================== */

function addToCart(id, size = 32, quantity = 1) {

  const existing = cart.find(
    item => item.id === id && item.size === size
  );

  if (existing) {

    existing.quantity += quantity;

  } else {

    cart.push({
      id,
      size,
      quantity
    });

  }

  saveState();
  updateCart();
  showToast("ADDED TO BAG");

}

/* ==========================================
   CART
========================================== */

function updateCart() {

  const cartItems = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartBottom = document.getElementById("cartBottom");

  const count = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  document.getElementById("cartCount").textContent = count;

  if (cart.length === 0) {

    cartItems.innerHTML = "";
    cartEmpty.style.display = "block";
    cartBottom.style.display = "none";

    return;
  }

  cartEmpty.style.display = "none";
  cartBottom.style.display = "block";

  cartItems.innerHTML = cart.map((item, index) => {

    const product = products.find(p => p.id === item.id);

    if (!product) return "";

    return `
      <div class="cart-item">

        <img src="${product.image}" alt="${product.name}">

        <div>

          <div class="cart-item-name">
            ${product.name}
          </div>

          <div class="cart-item-size">
            SIZE ${item.size}
          </div>

          <div class="cart-item-price">
            ${money(product.price)}
          </div>

          <div class="cart-quantity">

            <button data-minus="${index}">−</button>

            <span>${item.quantity}</span>

            <button data-plus="${index}">+</button>

          </div>

          <button class="remove-item" data-remove="${index}">
            REMOVE
          </button>

        </div>

      </div>
    `;

  }).join("");

  const subtotal = cart.reduce((total, item) => {

    const product = products.find(p => p.id === item.id);

    return total + product.price * item.quantity;

  }, 0);

  document.getElementById("cartSubtotal").textContent = money(subtotal);

  attachCartEvents();
}

function attachCartEvents() {

  document.querySelectorAll("[data-minus]").forEach(button => {

    button.onclick = () => {

      const index = Number(button.dataset.minus);

      cart[index].quantity--;

      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }

      saveState();
      updateCart();
    };

  });

  document.querySelectorAll("[data-plus]").forEach(button => {

    button.onclick = () => {

      const index = Number(button.dataset.plus);

      cart[index].quantity++;

      saveState();
      updateCart();
    };

  });

  document.querySelectorAll("[data-remove]").forEach(button => {

    button.onclick = () => {

      const index = Number(button.dataset.remove);

      cart.splice(index, 1);

      saveState();
      updateCart();

      showToast("REMOVED FROM BAG");
    };

  });

}

/* ==========================================
   CART OPEN / CLOSE
========================================== */

function openCart() {

  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("drawerBackdrop").classList.add("open");

}

function closeCart() {

  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("drawerBackdrop").classList.remove("open");

}

document.getElementById("cartBtn").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

document.getElementById("drawerBackdrop").addEventListener("click", closeCart);

document.getElementById("continueShopping").addEventListener("click", closeCart);

/* ==========================================
   FILTERS
========================================== */

document.querySelectorAll(".filter-btn").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderShop();

  });

});

document.getElementById("sortSelect").addEventListener(
  "change",
  renderShop
);

/* ==========================================
   GRID / LIST
========================================== */

document.getElementById("gridView").addEventListener("click", () => {

  document.getElementById("shopProducts").classList.remove("list-view");

  document.getElementById("gridView").classList.add("active");
  document.getElementById("listView").classList.remove("active");

});

document.getElementById("listView").addEventListener("click", () => {

  document.getElementById("shopProducts").classList.add("list-view");

  document.getElementById("listView").classList.add("active");
  document.getElementById("gridView").classList.remove("active");

});

/* ==========================================
   SEARCH
========================================== */

const searchOverlay = document.getElementById("searchOverlay");
const searchInput = document.getElementById("searchInput");

document.getElementById("searchBtn").addEventListener("click", () => {

  searchOverlay.classList.add("open");
  document.body.style.overflow = "hidden";

  setTimeout(() => searchInput.focus(), 400);

});

document.getElementById("closeSearch").addEventListener("click", () => {

  searchOverlay.classList.remove("open");
  document.body.style.overflow = "";

});

searchInput.addEventListener("input", () => {

  const query = searchInput.value.toLowerCase().trim();

  const results = products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.categoryName.toLowerCase().includes(query)
  );

  document.getElementById("searchResults").innerHTML =
    query
      ? results.map(product => `
          <div class="search-result" data-search-id="${product.id}">
            <img src="${product.image}" alt="">
            <strong>${product.name}</strong>
            <span>${money(product.price)}</span>
          </div>
        `).join("")
      : "";

  document.querySelectorAll("[data-search-id]").forEach(result => {

    result.onclick = () => {

      searchOverlay.classList.remove("open");
      document.body.style.overflow = "";

      openProduct(Number(result.dataset.searchId));
    };

  });

});

/* ==========================================
   BUY NOW
========================================== */

document.getElementById("modalBuy").addEventListener("click", () => {

  if (!activeProduct) return;

  addToCart(
    activeProduct.id,
    selectedSize,
    modalQuantity
  );

  document.getElementById("productModal").classList.remove("open");

  document.body.style.overflow = "";

  openCheckout();

});

/* ==========================================
   CHECKOUT
========================================== */

function openCheckout() {

  closeCart();

  document.getElementById("checkoutPage").classList.add("open");

  document.body.style.overflow = "hidden";

  renderCheckout();

}

function renderCheckout() {

  const container = document.getElementById("checkoutItems");

  if (cart.length === 0) {

    container.innerHTML = "<p>Your bag is empty.</p>";

    return;
  }

  container.innerHTML = cart.map(item => {

    const product = products.find(p => p.id === item.id);

    return `
      <div class="summary-item">
        <span>
          ${product.name} × ${item.quantity}
          <br>
          <small>SIZE ${item.size}</small>
        </span>
        <strong>
          ${money(product.price * item.quantity)}
        </strong>
      </div>
    `;

  }).join("");

  const total = cart.reduce((sum, item) => {

    const product = products.find(p => p.id === item.id);

    return sum + product.price * item.quantity;

  }, 0);

  document.getElementById("checkoutTotal").textContent = money(total);
}

document.getElementById("checkoutBtn").addEventListener(
  "click",
  openCheckout
);

document.getElementById("closeCheckout").addEventListener("click", () => {

  document.getElementById("checkoutPage").classList.remove("open");

  document.body.style.overflow = "";

});

/* ==========================================
   CHECKOUT FORM
========================================== */

document.getElementById("checkoutForm").addEventListener(
  "submit",
  e => {

    e.preventDefault();

    showToast("ORDER PLACED SUCCESSFULLY");

    cart = [];

    saveState();
    updateCart();

    setTimeout(() => {

      document.getElementById("checkoutPage").classList.remove("open");

      document.body.style.overflow = "";

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }, 1800);

  }
);

/* ==========================================
   MOBILE MENU
========================================== */

document.getElementById("menuBtn").addEventListener("click", () => {

  document.getElementById("mobileMenu").classList.toggle("open");

});

document.querySelectorAll(".mobile-menu a").forEach(link => {

  link.addEventListener("click", () => {

    document.getElementById("mobileMenu").classList.remove("open");

  });

});

/* ==========================================
   NAV SCROLL
========================================== */

window.addEventListener("scroll", () => {

  const navbar = document.getElementById("navbar");

  navbar.classList.toggle(
    "scrolled",
    window.scrollY > 30
  );

});

/* ==========================================
   REVEAL ANIMATIONS
========================================== */

const observer = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }

    });

  },
  {
    threshold: .12
  }
);

document.querySelectorAll(".reveal").forEach(element => {
  observer.observe(element);
});

/* ==========================================
   HERO PARALLAX
========================================== */

window.addEventListener("scroll", () => {

  const image = document.querySelector(".hero-image img");

  if (!image) return;

  const scroll = window.scrollY;

  if (scroll < window.innerHeight) {
    image.style.transform =
      `scale(1.04) translateY(${scroll * .08}px)`;
  }

});

/* ==========================================
   INITIALIZE
========================================== */

renderProducts();
updateCart();