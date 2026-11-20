document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 1. SIZE SELECTION TOGGLE
    // ==========================================
    const sizePills = document.querySelectorAll('.size-pill');
    if (sizePills.length > 0) {
        sizePills.forEach(pill => {
            pill.addEventListener('click', function () {
                sizePills.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // ==========================================
    // 2. QUANTITY COUNTER
    // ==========================================
    const qtyDisplay = document.getElementById('qtyDisplay');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    
    if (qtyDisplay && qtyMinus && qtyPlus) {
        qtyMinus.onclick = null;
        qtyPlus.onclick = null;

        let isProcessing = false;

        qtyMinus.replaceWith(qtyMinus.cloneNode(true));
        qtyPlus.replaceWith(qtyPlus.cloneNode(true));
        
        const freshMinus = document.getElementById('qtyMinus');
        const freshPlus = document.getElementById('qtyPlus');
        const freshDisplay = document.getElementById('qtyDisplay');

        freshMinus.addEventListener('click', function (e) {
            e.preventDefault();
            if (isProcessing) return;
            isProcessing = true;

            let currentQty = parseInt(freshDisplay.textContent.trim()) || 1;
            if (currentQty > 1) {
                freshDisplay.textContent = currentQty - 1;
            }
            setTimeout(() => { isProcessing = false; }, 100);
        });

        freshPlus.addEventListener('click', function (e) {
            e.preventDefault();
            if (isProcessing) return;
            isProcessing = true;

            let currentQty = parseInt(freshDisplay.textContent.trim()) || 1;
            freshDisplay.textContent = currentQty + 1;
            setTimeout(() => { isProcessing = false; }, 100);
        });
    }

    // ==========================================
    // 3. BUY NOW BUTTON
    // ==========================================
    const buyNowBtn = document.getElementById('buyNowBtn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const productTitleEl = document.querySelector('h1');
            const productTitle = productTitleEl ? productTitleEl.textContent.trim() : "Hebor Item";
            
            const activeSize = document.querySelector('.size-pill.active');
            const selectedSize = activeSize ? activeSize.getAttribute('data-size') : 'MEDIUM';
            
            const currentQtyEl = document.getElementById('qtyDisplay');
            const currentQty = currentQtyEl ? (parseInt(currentQtyEl.textContent.trim()) || 1) : 1;

            const recipient = "order@examplewebsite142.com";
            const subject = `Order Inquiry: ${productTitle}`;
            const body = `Hello Hebor,\n\nI would like to place an order for:\n\n- Product: ${productTitle}\n- Size: ${selectedSize}\n- Quantity: ${currentQty}\n\nPlease let me know the next steps for payment and shipping.\n\nThank you!`;

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(gmailUrl, '_blank');
        });
    }

    // ==========================================
    // 4. ADD TO SHOPPING BAG BUTTON
    // ==========================================
    const addToBagBtn = document.getElementById('addToShopping bagBtn') || document.getElementById('addToCartBtn') || document.getElementById('addToBagBtn');
    if (addToBagBtn) {
        addToBagBtn.addEventListener('click', function () {
            const productTitleEl = document.querySelector('h1');
            const productTitle = productTitleEl ? productTitleEl.textContent.trim() : "Hebor Item";
            const activeSize = document.querySelector('.size-pill.active');
            const selectedSize = activeSize ? activeSize.getAttribute('data-size') : 'MEDIUM';
            const currentQty = qtyDisplay ? (parseInt(qtyDisplay.textContent.trim()) || 1) : 1;

            const productImgEl = document.querySelector('main img');
            let imgPath = productImgEl ? productImgEl.src : 'Dont be late tee.png';

            let itemPrice = 500;
            const priceDiv = document.querySelector('.fw-bold.fs-4.text-dark');
            if (priceDiv && priceDiv.textContent.includes('PHP')) {
                const parsed = parseInt(priceDiv.textContent.replace(/[^0-9]/g, ''));
                if (!isNaN(parsed)) itemPrice = parsed;
            }

            let shoppingbag = JSON.parse(localStorage.getItem('heborshopping bag')) || [];
            const existingIndex = shoppingbag.findIndex(item => item.name === productTitle && item.size === selectedSize);

            if (existingIndex > -1) {
                shoppingbag[existingIndex].quantity += currentQty;
            } else {
                shoppingbag.push({
                    name: productTitle,
                    size: selectedSize,
                    quantity: currentQty,
                    price: itemPrice,
                    image: imgPath
                });
            }

            localStorage.setItem('heborshopping bag', JSON.stringify(shoppingbag));
            alert(`Tagumpay! Naidagdag ang ${currentQty}x ${productTitle} (${selectedSize}) sa iyong Shopping Bag.`);
        });
    }

    // ==========================================
    // 5. SHOPPING BAG PAGE LOGIC
    // ==========================================
    const shoppingbagContainer = document.getElementById('shoppingbagItemsContainer');
    if (shoppingbagContainer) {
        const emptyMsg = document.getElementById('emptyShopping bagMessage');
        const checkoutSection = document.getElementById('checkoutSection');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const subtotalDisplay = document.getElementById('subtotalDisplay');

        function getSelectedBagItems() {
            const shoppingbag = JSON.parse(localStorage.getItem('heborshopping bag')) || [];
            const checkboxes = document.querySelectorAll('.bag-circle-check');
            const selected = [];

            checkboxes.forEach((cb) => {
                if (cb.checked) {
                    const idx = parseInt(cb.getAttribute('data-index'));
                    if (shoppingbag[idx]) {
                        selected.push(shoppingbag[idx]);
                    }
                }
            });

            return selected;
        }

        function updateCheckedSubtotal() {
            const selectedItems = getSelectedBagItems();
            const checkedSubtotal = selectedItems.reduce((sum, item) => {
                const unitPrice = item.price || 500;
                const qty = item.quantity || 1;
                return sum + (unitPrice * qty);
            }, 0);

            if (subtotalDisplay) {
                subtotalDisplay.textContent = `Subtotal: PHP ${checkedSubtotal.toLocaleString()}`;
            }
        }

        function loadshoppingbag() {
            let shoppingbag = JSON.parse(localStorage.getItem('heborshopping bag')) || [];

            if (shoppingbag.length === 0) {
                shoppingbagContainer.innerHTML = '';
                if (emptyMsg) emptyMsg.classList.remove('d-none');
                if (checkoutSection) checkoutSection.classList.add('d-none');
                return;
            }

            if (emptyMsg) emptyMsg.classList.add('d-none');
            if (checkoutSection) checkoutSection.classList.remove('d-none');
            shoppingbagContainer.innerHTML = '';

            shoppingbag.forEach((item, index) => {
                const unitPrice = item.price || 500;
                const itemTotalPrice = unitPrice * (item.quantity || 1);

                const itemRow = document.createElement('div');
                itemRow.className = 'row align-items-center py-3 border-bottom';
                itemRow.innerHTML = `
                    <div class="col-6 col-md-6 d-flex align-items-center gap-3 mb-2 mb-md-0">
                        <input type="checkbox" class="bag-circle-check" data-index="${index}" checked aria-label="Select ${item.name}">
                        <div class="p-2 bg-white rounded border d-flex align-items-center justify-content-center" style="width: 70px; height: 70px; min-width: 70px;">
                            <img src="${item.image || 'Dont be late tee.png'}" alt="${item.name}" class="img-fluid" style="max-height: 60px; object-fit: contain;">
                        </div>
                        <div>
                            <h4 class="fw-bold mb-1" style="color: #8c5843; font-size: 15px;">${item.name}</h4>
                            <div class="text-dark fw-semibold" style="font-size: 13px;">PHP ${unitPrice.toLocaleString()}</div>
                            <div class="text-secondary" style="font-size: 12px;">SIZE: ${item.size}</div>
                        </div>
                    </div>
                    <div class="col-6 col-md-4 text-center mb-2 mb-md-0">
                        <div class="d-inline-flex align-items-center justify-content-center px-3 py-1 border rounded-pill bg-white shadow-sm gap-3">
                            <button type="button" class="btn btn-link text-dark text-decoration-none fw-bold p-0 qty-minus-bag" data-index="${index}" style="font-size: 16px;">&minus;</button>
                            <span class="fw-bold text-dark" style="font-size: 14px; min-width: 20px;">${item.quantity}</span>
                            <button type="button" class="btn btn-link text-dark text-decoration-none fw-bold p-0 qty-plus-bag" data-index="${index}" style="font-size: 16px;">&plus;</button>
                            <button type="button" class="btn btn-link text-secondary text-decoration-none fw-bold p-0 ms-2 remove-item" data-index="${index}" style="font-size: 16px;" title="Remove">&times;</button>
                        </div>
                    </div>
                    <div class="col-12 col-md-2 text-center text-md-end mt-2 mt-md-0">
                        <span class="fw-bold fs-5 text-dark">PHP ${itemTotalPrice.toLocaleString()}</span>
                    </div>
                `;
                shoppingbagContainer.appendChild(itemRow);
            });

            updateCheckedSubtotal();

            document.querySelectorAll('.bag-circle-check').forEach(cb => {
                cb.addEventListener('change', updateCheckedSubtotal);
            });

            document.querySelectorAll('.qty-minus-bag').forEach(btn => {
                btn.addEventListener('click', function () {
                    const idx = parseInt(this.getAttribute('data-index'));
                    if (shoppingbag[idx].quantity > 1) {
                        shoppingbag[idx].quantity -= 1;
                        localStorage.setItem('heborshopping bag', JSON.stringify(shoppingbag));
                        loadshoppingbag();
                    }
                });
            });

            document.querySelectorAll('.qty-plus-bag').forEach(btn => {
                btn.addEventListener('click', function () {
                    const idx = parseInt(this.getAttribute('data-index'));
                    shoppingbag[idx].quantity += 1;
                    localStorage.setItem('heborshopping bag', JSON.stringify(shoppingbag));
                    loadshoppingbag();
                });
            });

            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function () {
                    const idx = parseInt(this.getAttribute('data-index'));
                    shoppingbag.splice(idx, 1);
                    localStorage.setItem('heborshopping bag', JSON.stringify(shoppingbag));
                    loadshoppingbag();
                });
            });
        }

        loadshoppingbag();

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function () {
                const selectedItems = getSelectedBagItems();

                if (selectedItems.length === 0) {
                    alert("Paki-tick muna ang kahit isang item na gusto mong i-checkout.");
                    return;
                }

                const recipient = "order@examplewebsite142.com";
                const subject = "Bulk Order Checkout: Hebor Shopping Bag";

                let totalAmount = 0;
                let body = "Hello Hebor,\n\nI would like to place an order for the following selected items in my shopping bag:\n\n";

                selectedItems.forEach((item, i) => {
                    const unitPrice = item.price || 500;
                    const qty = item.quantity || 1;
                    const itemTotal = unitPrice * qty;
                    totalAmount += itemTotal;
                    body += `${i + 1}. Product: ${item.name}\n   - Size: ${item.size}\n   - Quantity: ${qty}\n   - Total: PHP ${itemTotal.toLocaleString()}\n\n`;
                });

                body += `Selected Subtotal: PHP ${totalAmount.toLocaleString()}\n\nPlease let me know the next steps for payment and shipping.\n\nThank you!`;

                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(gmailUrl, '_blank');
            });
        }
    }
    
    // ==========================================
    // 6. LIKES SYSTEM
    // ==========================================
    const likeButtons = document.querySelectorAll('.like-btn');
    if (likeButtons.length > 0) {
        let likedItems = JSON.parse(localStorage.getItem('heborLikes')) || [];
  
        likeButtons.forEach(button => {
            const itemName = button.getAttribute('data-name');
            const isAlreadyLiked = likedItems.some(item => item.name === itemName);
            
            if (isAlreadyLiked) {
                fillHeart(button);
            }
  
            button.addEventListener('click', () => {
                const item = {
                    name: button.getAttribute('data-name'),
                    size: button.getAttribute('data-size') || 'MEDIUM',
                    price: parseInt(button.getAttribute('data-price')) || 500,
                    image: button.getAttribute('data-image')
                };
  
                likedItems = JSON.parse(localStorage.getItem('heborLikes')) || [];
                const existingIndex = likedItems.findIndex(liked => liked.name === item.name);
  
                if (existingIndex > -1) {
                    likedItems.splice(existingIndex, 1);
                    localStorage.setItem('heborLikes', JSON.stringify(likedItems));
                    outlineHeart(button);
                    alert(`Naalis na ang ${item.name} sa iyong Likes.`);
                } else {
                    likedItems.push(item);
                    localStorage.setItem('heborLikes', JSON.stringify(likedItems));
                    fillHeart(button);
                    alert(`Naidagdag na ang ${item.name} sa iyong Likes!`);
                }
            });
        });
    }
  
    function fillHeart(button) {
        const svg = button.querySelector('.heart-icon');
        if (svg) {
            svg.innerHTML = '<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>';
        }
    }

    function outlineHeart(button) {
        const svg = button.querySelector('.heart-icon');
        if (svg) {
            svg.innerHTML = '<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.27-3.04 7.8 3.243q.09.021.198.043c.106-.022.137-.021.198-.065C12.73-3.04 23.333 4.868 8 15"/>';
        }
    }

    // ==========================================
    // 7. LIKES PAGE DISPLAY
    // ==========================================
    const likesGridContainer = document.getElementById('likesGridContainer');
    const emptyLikesMessage = document.getElementById('emptyLikesMessage');

    if (likesGridContainer) {
        const likes = JSON.parse(localStorage.getItem('heborLikes')) || [];

        if (likes.length === 0) {
            likesGridContainer.innerHTML = '';
            emptyLikesMessage.classList.remove('d-none');
        } else {
            emptyLikesMessage.classList.add('d-none');
            likesGridContainer.innerHTML = '';

            likes.forEach((item, index) => {
                const getProductPageUrl = (name) => {
                    const formattedName = name.toLowerCase().trim();
                    if (formattedName.includes('do good work')) return 'do_good_work_tee.html';
                    if (formattedName.includes('dont be late') || formattedName.includes("don't be late")) return 'don_t_be_late_tee.html';
                    if (formattedName.includes('everyday comfort')) return 'everyday_comfort_tee.html';
                    return `${name.toLowerCase()}.html`;
                };

                const productUrl = getProductPageUrl(item.name);

                const col = document.createElement('div');
                col.className = 'col-md-4 col-sm-6 mb-4';
                col.innerHTML = `
                    <div class="card h-100 border-0 shadow-sm text-center p-3" style="background-color: #f8f9fa;">
                        <a href="${productUrl}" class="text-decoration-none">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid mb-3 rounded" style="max-height: 220px; object-fit: cover;">
                        </a>
                        <div class="card-body d-flex flex-column justify-content-between p-2">
                            <div>
                                <h5 class="card-title mb-2">
                                    <a href="${productUrl}" class="text-dark text-decoration-none product-title fw-bold" style="font-size: 16px;">
                                        ${item.name}
                                    </a>
                                </h5>
                                <p class="text-muted fw-semibold mb-3">₱${item.price}</p>
                            </div>
                            <div class="d-flex gap-2 justify-content-center">
                                <a href="${productUrl}" class="btn btn-dark rounded-pill px-3 py-1 text-uppercase fw-bold" style="font-size: 12px;">
                                    View Item
                                </a>
                                <button class="btn btn-outline-danger rounded-pill px-3 py-1 text-uppercase fw-bold remove-like-btn" data-index="${index}" style="font-size: 12px;">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                likesGridContainer.appendChild(col);
            });

            document.querySelectorAll('.remove-like-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const idx = this.getAttribute('data-index');
                    likes.splice(idx, 1);
                    localStorage.setItem('heborLikes', JSON.stringify(likes));
                    location.reload();
                });
            });
        }
    }

    // ==========================================
    // 8. CONTACT US FORM
    // ==========================================
    const contactForm = document.getElementById('ContactusForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            const recipient = "hello@examplewebsite142.com";
            const subject = `Contact inquiry from ${name}`;
            const body = `Hello Hebor,\n\nMy name is ${name}\n\n${message}\n\nYou may contact me through this email: ${email}\n\nThank you best regards, \n\n ${name}`;

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(gmailUrl, '_blank');
        });
    }
    
    // ==========================================
    // 9. LITERAL SITE-WIDE SEARCH BAR
    // ==========================================
    const hasSearchButtonInNav = document.querySelector('nav a[href="store.html"]');

    if (hasSearchButtonInNav) {
        const searchModal = document.createElement('div');
        searchModal.id = 'heborSearchModal';
        searchModal.setAttribute('role', 'dialog');
        searchModal.setAttribute('aria-modal', 'true');
        searchModal.setAttribute('aria-label', 'Search Hebor Website');
        searchModal.innerHTML = `
            <div class="hebor-search-card">
                <div class="hebor-search-top">
                    <input type="text" id="heborSearchInput" class="hebor-search-input" placeholder="Search shirts, history, team, contact, privacy policy, likes, bag..." autocomplete="off">
                    <button type="button" id="heborSearchClose" class="hebor-search-close" aria-label="Close search">&times;</button>
                </div>
                <div id="heborSearchStatus" class="small text-secondary mb-2">Type a keyword from the Hebor website.</div>
                <div id="heborSearchResults" class="hebor-search-results"></div>
            </div>
        `;
        document.body.appendChild(searchModal);

        const searchInput = document.getElementById('heborSearchInput');
        const searchClose = document.getElementById('heborSearchClose');
        const searchStatus = document.getElementById('heborSearchStatus');
        const searchResults = document.getElementById('heborSearchResults');

        function buildSiteIndex() {
            const baseIndex = [
                {
                    page: 'Home',
                    title: 'Welcome to Hebor',
                    url: 'index.html',
                    keywords: 'home welcome hebor emblem shop now store carousel'
                },
                {
                    page: 'Store',
                    title: "Don't Be Late Tee (PHP 500)",
                    url: 'don_t_be_late_tee.html',
                    keywords: "store shirt tee don't be late because time is gold php 500 small medium large"
                },
                {
                    page: 'Store',
                    title: 'Everyday Comfort tee (PHP 750)',
                    url: 'everyday_comfort_tee.html',
                    keywords: 'store shirt tee everyday comfort the shirt for you php 750 small medium large'
                },
                {
                    page: 'Store',
                    title: 'Do Good Work Tee (PHP 500)',
                    url: 'do_good_work_tee.html',
                    keywords: 'store shirt tee do good work being good is the new trend php 500 small medium large'
                },
                {
                    page: 'About Us',
                    title: 'History — Hebor in Hagonoy, Bulacan',
                    url: 'about_us.html',
                    keywords: 'about us history hagonoy bulacan chore gathering errand filipino fashion'
                },
                {
                    page: 'About Us',
                    title: 'People Behind Hebor',
                    url: 'about_us.html',
                    keywords: 'about us people behind hebor psalm lambus jan arelle layug nicole grace pantin juan miguel sotto team'
                },
                {
                    page: 'Contact Us',
                    title: 'Contact Us Form & Inquiry',
                    url: 'contact_us.html',
                    keywords: 'contact us form full name email address message submit inquiry'
                },
                {
                    page: 'Privacy Policy',
                    title: '1. Information We Collect',
                    url: 'privacy_policy.html',
                    keywords: 'privacy policy information we collect name email order specifications shirt size quantity messages'
                },
                {
                    page: 'Privacy Policy',
                    title: '2. How We Use Your Information & Email Transparency',
                    url: 'privacy_policy.html',
                    keywords: 'privacy policy how we use information email transparency full email copies logistics'
                },
                {
                    page: 'Privacy Policy',
                    title: '3. Data Confidentiality',
                    url: 'privacy_policy.html',
                    keywords: 'privacy policy data confidentiality personal data sell trade rent fulfillment'
                },
                {
                    page: 'Shopping Bag',
                    title: 'Shopping Bag & Bulk Checkout',
                    url: 'shopping_bag.html',
                    keywords: 'shopping bag cart quantity subtotal proceed to checkout bulk order'
                },
                {
                    page: 'Likes',
                    title: 'Liked Items',
                    url: 'likes.html',
                    keywords: 'likes liked items favorites heart view item remove'
                }
            ];

            const savedLikes = JSON.parse(localStorage.getItem('heborLikes')) || [];
            savedLikes.forEach((item) => {
                if (item && item.name) {
                    baseIndex.push({
                        page: 'Likes',
                        title: `Liked: ${item.name}`,
                        url: 'likes.html',
                        keywords: `likes liked item ${item.name} ${item.size || ''} php ${item.price || ''}`
                    });
                }
            });

            const savedBag = JSON.parse(localStorage.getItem('heborshopping bag')) || [];
            savedBag.forEach((item) => {
                if (item && item.name) {
                    baseIndex.push({
                        page: 'Shopping Bag',
                        title: `In Bag: ${item.name} (${item.size || 'M'}) x${item.quantity || 1}`,
                        url: 'shopping_bag.html',
                        keywords: `shopping bag in bag ${item.name} ${item.size || ''} quantity ${item.quantity || 1}`
                    });
                }
            });

            return baseIndex;
        }

        function displayMatches(items) {
            searchResults.innerHTML = items.map((entry) => `
                <a href="${entry.url}" class="hebor-search-item">
                    <span class="hebor-search-badge">${entry.page}</span>
                    <div class="hebor-search-title">${entry.title}</div>
                    <p class="hebor-search-snippet">Go to ${entry.url}</p>
                </a>
            `).join('');
        }

        function renderSearchResults(query) {
            const trimmed = query.trim().toLowerCase();
            const index = buildSiteIndex();

            if (!trimmed) {
                searchStatus.textContent = 'Showing all sections available across the Hebor website.';
                displayMatches(index);
                return;
            }

            const terms = trimmed.split(/\s+/).filter(Boolean);
            const matches = index.filter((entry) => {
                const haystack = `${entry.page} ${entry.title} ${entry.keywords}`.toLowerCase();
                return terms.every((term) => haystack.includes(term));
            });

            if (matches.length === 0) {
                searchStatus.textContent = `No results found for "${query}" in the website content.`;
                searchResults.innerHTML = '';
                return;
            }

            searchStatus.textContent = `${matches.length} result(s) found for "${query}".`;
            displayMatches(matches);
        }

        function openSearchModal() {
            searchModal.classList.add('active');
            searchInput.value = '';
            renderSearchResults('');
            setTimeout(() => searchInput.focus(), 50);
        }

        function closeSearchModal() {
            searchModal.classList.remove('active');
        }

        document.addEventListener('click', function (e) {
            const clickedSearchLink = e.target.closest('nav a[href="store.html"]');
            if (clickedSearchLink) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') {
                    e.stopImmediatePropagation();
                }
                openSearchModal();
            }
        }, true);

        searchClose.addEventListener('click', closeSearchModal);

        searchModal.addEventListener('click', function (e) {
            if (e.target === searchModal) {
                closeSearchModal();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                closeSearchModal();
            }
        });

        searchInput.addEventListener('input', function () {
            renderSearchResults(this.value);
        });
    }
   
    
});
