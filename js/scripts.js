// Function to load HTML content
function loadHTML(file, elementId) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-toggle");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.querySelector(".overlay");

  if (!menuBtn || !sideMenu || !overlay) return;

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    sideMenu.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", () => {
    menuBtn.classList.remove("open");
    sideMenu.classList.remove("open");
    overlay.classList.remove("show");
  });
});

    // Ensure menu is closed on page load
    toggleMenu(false);

    // Add click handlers
    if (menuButton) {
        menuButton.addEventListener('click', () => toggleMenu(true));
    }
    if (closeMenu) {
        closeMenu.addEventListener('click', () => toggleMenu(false));
    }
    if (overlay) {
        overlay.addEventListener('click', () => toggleMenu(false));
    }

    // Top bar scroll effect
    const topBar = document.querySelector('.top-bar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            topBar.classList.add('scrolled');
        } else {
            topBar.classList.remove('scrolled');
        }
    });

// Search functionality
const searchInput = document.getElementById('site-search');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('search-results');

if (searchInput && searchButton && resultsContainer) {
    // Auto-search if URL has search parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    if (searchQuery) {
        searchInput.value = searchQuery;
        performSearch(searchQuery);
    }

    // Search event handlers
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

async function performSearch(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) return;

    resultsContainer.innerHTML = '<p>Searching...</p>';

    try {
        const pagePaths = [
            '/MERCH/',
            '/MERCH/shop/',
            '/MERCH/about/'
        ];

        const results = [];

        for (const path of pagePaths) {
            try {
                const response = await fetch(path);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const content = doc.querySelector('.main-content');

                if (content) {
                    const text = content.textContent.toLowerCase();
                    const searchTermLower = searchTerm.toLowerCase();

                    if (text.includes(searchTermLower)) {
                        const index = text.indexOf(searchTermLower);
                        results.push({
                            title: doc.title || path,
                            url: path,
                            excerpt: text.substring(
                                Math.max(0, index - 50),
                                Math.min(text.length, index + searchTerm.length + 50)
                            )
                        });
                    }
                }
            } catch (error) {
                console.warn(`Failed to search ${path}:`, error);
            }
        }

        displayResults(results);
    } catch (error) {
        resultsContainer.innerHTML = '<p>Search failed. Please try again.</p>';
        console.error('Search error:', error);
    }
}

function displayResults(results) {
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }

    resultsContainer.innerHTML = results.map(result => `
        <div class="result-item">
            <h3><a href="${result.url}">${result.title}</a></h3>
            <p>...${result.excerpt}...</p>
        </div>
    `).join('');
}

document.addEventListener("snipcart.ready", () => {
    const totalEl = document.querySelector(".cart-total");

    Snipcart.store.subscribe(() => {
      const state = Snipcart.store.getState();
      const items = state.cart.items.count;

      if (items > 0) {
        totalEl.style.display = "inline";
      } else {
        totalEl.style.display = "none";
      }
    });
});
