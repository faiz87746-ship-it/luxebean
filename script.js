/* =========================================================
   LUXEBEAN — PREMIUM COFFEE EXPERIENCE
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PRELOADER
    ===================================================== */

    const preloader = document.getElementById("preloader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            if (preloader) preloader.classList.add("hidden");
        }, 1200);
    });

    // Fallback in case load already fired
    setTimeout(() => {
        if (preloader) preloader.classList.add("hidden");
    }, 2500);


    /* =====================================================
       CUSTOM CURSOR
    ===================================================== */

    const cursorDot     = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (cursorDot && cursorOutline) {

        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = mouseX + "px";
            cursorDot.style.top  = mouseY + "px";
        });

        (function animateOutline() {
            outlineX += (mouseX - outlineX) * 0.18;
            outlineY += (mouseY - outlineY) * 0.18;
            cursorOutline.style.left = outlineX + "px";
            cursorOutline.style.top  = outlineY + "px";
            requestAnimationFrame(animateOutline);
        })();

        document.querySelectorAll(
            "a, button, .menu-card, .filter-btn, .quick-add"
        ).forEach(el => {
            el.addEventListener("mouseenter", () =>
                cursorOutline.classList.add("hover")
            );
            el.addEventListener("mouseleave", () =>
                cursorOutline.classList.remove("hover")
            );
        });
    }


    /* =====================================================
       HEADER SCROLL EFFECT
    ===================================================== */

    const siteHeader = document.getElementById("siteHeader");

    function updateHeader() {
        if (!siteHeader) return;
        if (window.scrollY > 50) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu    = document.getElementById("mobileMenu");

    if (mobileMenuBtn && mobileMenu) {

        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("open");
            document.body.classList.toggle("menu-open", isOpen);
            mobileMenuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

            const spans = mobileMenuBtn.querySelectorAll("span");
            if (isOpen) {
                spans[0].style.transform = "translateY(6px) rotate(45deg)";
                spans[1].style.opacity   = "0";
                spans[2].style.transform = "translateY(-6px) rotate(-45deg)";
            } else {
                spans[0].style.transform = "";
                spans[1].style.opacity   = "";
                spans[2].style.transform = "";
            }
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("open");
                document.body.classList.remove("menu-open");
                const spans = mobileMenuBtn.querySelectorAll("span");
                spans[0].style.transform = "";
                spans[1].style.opacity   = "";
                spans[2].style.transform = "";
            });
        });
    }


    /* =====================================================
       SEARCH OVERLAY
    ===================================================== */

    const searchBtn     = document.getElementById("searchBtn");
    const searchOverlay = document.getElementById("searchOverlay");
    const closeSearch   = document.getElementById("closeSearch");
    const searchInput   = document.getElementById("searchInput");

    function openSearch() {
        if (!searchOverlay) return;
        searchOverlay.classList.add("open");
        document.body.classList.add("search-open");
        setTimeout(() => searchInput && searchInput.focus(), 300);
    }

    function closeSearchOverlay() {
        if (!searchOverlay) return;
        searchOverlay.classList.remove("open");
        document.body.classList.remove("search-open");
    }

    if (searchBtn)   searchBtn.addEventListener("click", openSearch);
    if (closeSearch) closeSearch.addEventListener("click", closeSearchOverlay);

    if (searchOverlay) {
        searchOverlay.addEventListener("click", e => {
            if (e.target === searchOverlay) closeSearchOverlay();
        });
    }

    // Live search — highlight matching menu cards
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();
            document.querySelectorAll(".menu-card").forEach(card => {
                const name = card.dataset.name ? card.dataset.name.toLowerCase() : "";
                card.style.opacity = (!query || name.includes(query)) ? "1" : "0.3";
            });
        });
    }


    /* =====================================================
       ACTIVE NAVIGATION LINKS
    ===================================================== */

    const sections    = document.querySelectorAll("section[id]");
    const navLinks    = document.querySelectorAll(".nav-link");

    function updateActiveNav() {
        let current = "";
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute("id");
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${current}`
            );
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const id = this.getAttribute("href");
            if (!id || id === "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 88,
                behavior: "smooth"
            });
        });
    });


    /* =====================================================
       MENU FILTERS
    ===================================================== */

    const filterBtns  = document.querySelectorAll(".filter-btn");
    const menuCards   = document.querySelectorAll(".menu-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;

            menuCards.forEach((card, i) => {
                const match =
                    filter === "all" ||
                    card.dataset.category === filter;

                if (match) {
                    card.classList.remove("hidden");
                    card.style.animationDelay = `${i * 60}ms`;
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });


    /* =====================================================
       CART STATE
    ===================================================== */

    let cart = [];

    const cartDrawer  = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCartBtn = document.getElementById("closeCart");
    const cartItemsEl = document.getElementById("cartItems");
    const cartTotalEl = document.getElementById("cartTotal");
    const cartCountEl = document.getElementById("cartCount");


    /* =====================================================
       OPEN / CLOSE CART
    ===================================================== */

    function openCart() {
        if (cartDrawer)  cartDrawer.classList.add("open");
        if (cartOverlay) cartOverlay.classList.add("open");
        document.body.classList.add("cart-open");
    }

    function closeCart() {
        if (cartDrawer)  cartDrawer.classList.remove("open");
        if (cartOverlay) cartOverlay.classList.remove("open");
        document.body.classList.remove("cart-open");
    }

    const cartBtn = document.getElementById("cartBtn");
    if (cartBtn)       cartBtn.addEventListener("click", openCart);
    if (closeCartBtn)  closeCartBtn.addEventListener("click", closeCart);
    if (cartOverlay)   cartOverlay.addEventListener("click", closeCart);

    // Close cart links inside drawer
    document.querySelectorAll(".close-cart-link").forEach(el => {
        el.addEventListener("click", closeCart);
    });


    /* =====================================================
       ADD TO CART — quick-add buttons on menu cards
    ===================================================== */

    document.querySelectorAll(".quick-add").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();

            const name  = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const img   = btn.closest(".menu-card-image")
                            ?.querySelector("img")?.src || "";

            const existing = cart.find(i => i.name === name);

            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name, price, img, qty: 1 });
            }

            renderCart();
            showToast(name);
        });
    });


    /* =====================================================
       RENDER CART
    ===================================================== */

    function renderCart() {
        if (!cartItemsEl) return;

        if (cart.length === 0) {
            cartItemsEl.innerHTML = `
                <div class="empty-cart">
                    <span class="empty-cart-icon">
                        <i class="fa-solid fa-mug-hot"></i>
                    </span>
                    <h4>Your bag is empty</h4>
                    <p>Add something delicious from our menu.</p>
                    <a href="#menu" class="primary-btn close-cart-link">
                        Explore Menu
                    </a>
                </div>`;

            // Re-bind close link
            cartItemsEl.querySelector(".close-cart-link")
                ?.addEventListener("click", closeCart);

        } else {
            cartItemsEl.innerHTML = cart.map((item, i) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span>$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="cart-item-remove" data-index="${i}" aria-label="Remove">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>`
            ).join("");
        }

        // Update total & count
        const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const count = cart.reduce((s, i) => s + i.qty, 0);

        if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
        if (cartCountEl) cartCountEl.textContent = count;

        // Bind remove buttons
        cartItemsEl.querySelectorAll(".cart-item-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                cart.splice(Number(btn.dataset.index), 1);
                renderCart();
            });
        });
    }

    renderCart();


    /* =====================================================
       CHECKOUT BUTTON
    ===================================================== */

    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                showToast("Add items to your bag first!");
                return;
            }
            alert("✓ LuxeBean checkout — ready for payment integration.");
        });
    }


    /* =====================================================
       TOAST NOTIFICATION
    ===================================================== */

    const toast        = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    let toastTimer;

    function showToast(itemName) {
        if (!toast) return;
        if (toastMessage) toastMessage.textContent = itemName + " added.";
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
    }


    /* =====================================================
       SCROLL TO TOP
    ===================================================== */

    const scrollTopBtn = document.getElementById("scrollTop");

    function updateScrollTop() {
        if (!scrollTopBtn) return;
        scrollTopBtn.classList.toggle("visible", window.scrollY > 500);
    }

    window.addEventListener("scroll", updateScrollTop, { passive: true });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealEls = document.querySelectorAll(
        ".section-header, .story-grid, .menu-card, " +
        ".experience-content, .experience-visual, " +
        ".testimonial-card, .newsletter-card, " +
        ".contact-content, .contact-form-card, " +
        ".experience-feature"
    );

    revealEls.forEach(el => el.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach(el => revealObserver.observe(el));


    /* =====================================================
       NEWSLETTER FORM
    ===================================================== */

    const newsletterForm = document.getElementById("newsletterForm");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", e => {
            e.preventDefault();
            const input = newsletterForm.querySelector("input[type='email']");
            if (input && input.value) {
                showToast("Welcome to LuxeBean Club!");
                input.value = "";
            }
        });
    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", e => {
            e.preventDefault();
            showToast("Message sent! We'll be in touch.");
            contactForm.reset();
        });
    }


    /* =====================================================
       ESC KEY — close overlays
    ===================================================== */

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            closeCart();
            closeSearchOverlay();
            if (mobileMenu) {
                mobileMenu.classList.remove("open");
                document.body.classList.remove("menu-open");
            }
        }
    });


    /* =====================================================
       HERO PRODUCT 3D TILT
    ===================================================== */

    const heroProduct = document.querySelector(".hero-product");
    if (heroProduct) {
        heroProduct.addEventListener("mousemove", e => {
            if (window.innerWidth < 900) return;
            const rect = heroProduct.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
            const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
            heroProduct.style.transform =
                `perspective(1200px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
        });
        heroProduct.addEventListener("mouseleave", () => {
            heroProduct.style.transform =
                "perspective(1200px) rotateY(-8deg) rotateX(4deg)";
        });
    }


    console.log("☕ LuxeBean — loaded successfully.");

});
