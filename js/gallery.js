// Gallery Board System with Netlify CMS Integration
document.addEventListener('DOMContentLoaded', async function() {
    const galleryContainer = document.querySelector('.gallery-items');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const pagination = document.getElementById('pagination');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbersContainer = document.getElementById('pageNumbers');

    let allPosts = [];
    let filteredPosts = [];
    let currentFilter = 'all';
    let currentView = 'list';
    let currentSort = 'date-desc';
    let currentPage = 1;
    const postsPerPage = 10;

    // Initialize: Load posts from Netlify CMS markdown files
    async function loadPosts() {
        try {
            // Try to fetch posts from _posts/gallery directory
            const response = await fetch('_posts/gallery/');

            // If the fetch fails or directory listing isn't available,
            // fall back to static data
            if (!response.ok) {
                console.log('Using static gallery data');
                loadStaticPosts();
                return;
            }

            // Parse markdown files (this would need server-side support)
            // For now, we'll use static data with the structure ready for CMS
            loadStaticPosts();
        } catch (error) {
            console.error('Error loading posts:', error);
            loadStaticPosts();
        }
    }

    // Load static posts (fallback and initial data)
    function loadStaticPosts() {
        allPosts = [
            {
                id: 'post-001',
                title: 'Laboratory Environment',
                date: '2024-11-05',
                author: 'AgTech Lab',
                category: 'lab',
                thumbnail: 'images/gallery/chamdog_to.jpg',
                images: ['images/gallery/chamdog_to.jpg'],
                description: 'AgTech Research Lab workspace and facilities',
                content: 'Our state-of-the-art laboratory provides researchers with cutting-edge equipment and a collaborative environment for agricultural technology innovation.',
                tags: ['laboratory', 'facilities'],
                published: true
            },
            {
                id: 'post-002',
                title: 'ASABE Conference Presentation',
                date: '2024-11-04',
                author: 'AgTech Lab',
                category: 'event',
                thumbnail: 'images/gallery/ASABE_pr.JPG',
                images: ['images/gallery/ASABE_pr.JPG'],
                description: 'Presenting our latest research at ASABE Annual International Meeting',
                content: 'Our team presented groundbreaking research on precision agriculture and autonomous systems at the ASABE Annual International Meeting. The presentation highlighted our novel approaches to crop monitoring and automated decision-making systems.',
                tags: ['conference', 'presentation', 'ASABE'],
                published: true
            },
            {
                id: 'post-003',
                title: 'Bug Monitoring System Setup',
                date: '2024-11-03',
                author: 'AgTech Lab',
                category: 'event',
                thumbnail: 'images/gallery/bug_monitering.jpg',
                images: ['images/gallery/bug_monitering.jpg'],
                description: 'Installing and testing our automated pest monitoring system in the field',
                content: 'Field deployment of our AI-powered bug monitoring system. This innovative system uses computer vision and machine learning to identify and track pest populations in real-time, helping farmers make data-driven pest management decisions.',
                tags: ['monitoring', 'AI', 'field-work'],
                published: true
            },
            {
                id: 'post-004',
                title: 'Lab Festival Participation',
                date: '2024-11-02',
                author: 'AgTech Lab',
                category: 'event',
                thumbnail: 'images/gallery/chamdog_fes.JPG',
                images: ['images/gallery/chamdog_fes.JPG'],
                description: 'AgTech Lab participation in university research festival',
                content: 'Our lab participated in the annual university research festival, showcasing our latest projects and engaging with students and faculty from across campus. Great opportunity to share our work and inspire the next generation of agricultural technology researchers.',
                tags: ['festival', 'outreach', 'community'],
                published: true
            },
            {
                id: 'post-005',
                title: 'Field Research Activities',
                date: '2024-11-01',
                author: 'AgTech Lab',
                category: 'research',
                thumbnail: 'images/gallery/chamdo_lo.JPG',
                images: ['images/gallery/chamdo_lo.JPG'],
                description: 'Conducting field experiments and data collection',
                content: 'Field research campaign focusing on crop growth analysis and environmental monitoring. Our team collected extensive data on plant health indicators, soil conditions, and microclimate variations to validate our predictive models.',
                tags: ['field-research', 'data-collection', 'experiments'],
                published: true
            }
        ];

        filteredPosts = [...allPosts];
        sortPosts();
        renderGallery();
    }

    // Sort posts based on selected criteria
    function sortPosts() {
        filteredPosts.sort((a, b) => {
            switch (currentSort) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });
    }

    // Filter posts
    function filterPosts() {
        filteredPosts = allPosts.filter(post => {
            // Category filter
            const categoryMatch = currentFilter === 'all' || post.category === currentFilter;

            // Search filter
            const searchTerm = searchInput.value.toLowerCase();
            const searchMatch = !searchTerm ||
                post.title.toLowerCase().includes(searchTerm) ||
                post.description.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm));

            return categoryMatch && searchMatch && post.published;
        });

        sortPosts();
        currentPage = 1;
        renderGallery();
    }

    // Render gallery based on current view
    function renderGallery() {
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        if (currentView === 'list') {
            renderListView(postsToShow);
        } else {
            renderGridView(postsToShow);
        }

        renderPagination();
    }

    // Render list view
    function renderListView(posts) {
        galleryContainer.className = 'gallery-items gallery-list';
        galleryContainer.innerHTML = posts.map(post => `
            <div class="gallery-list-item" data-post-id="${post.id}">
                <div class="list-thumbnail">
                    <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
                </div>
                <div class="list-content">
                    <div class="list-header">
                        <span class="category-badge">${getCategoryName(post.category)}</span>
                        <h3>${post.title}</h3>
                        <div class="list-meta">
                            <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                            <span><i class="fas fa-user"></i> ${post.author}</span>
                        </div>
                    </div>
                    <p class="list-description">${post.description}</p>
                    <div class="list-footer">
                        ${post.tags.map(tag => `<span class="list-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        attachListItemClickHandlers();
    }

    // Render grid view
    function renderGridView(posts) {
        galleryContainer.className = 'gallery-items';
        galleryContainer.innerHTML = posts.map(post => `
            <div class="gallery-item" data-category="${post.category}" data-post-id="${post.id}">
                <div class="gallery-image">
                    <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
                    <div class="gallery-overlay">
                        <h3>${post.title}</h3>
                        <p>${post.description}</p>
                    </div>
                </div>
            </div>
        `).join('');

        attachListItemClickHandlers();
    }

    // Attach click handlers to items
    function attachListItemClickHandlers() {
        const items = document.querySelectorAll('.gallery-list-item, .gallery-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const postId = item.dataset.postId;
                const post = allPosts.find(p => p.id === postId);
                if (post) {
                    showPostModal(post);
                }
            });
        });
    }

    // Show post detail modal
    function showPostModal(post) {
        const modal = document.getElementById('postModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDate = document.getElementById('modalDate');
        const modalAuthor = document.getElementById('modalAuthor');
        const modalCategory = document.getElementById('modalCategory');
        const modalImages = document.getElementById('modalImages');
        const modalContent = document.getElementById('modalContent');

        modalTitle.textContent = post.title;
        modalDate.textContent = formatDate(post.date);
        modalAuthor.textContent = post.author;
        modalCategory.textContent = getCategoryName(post.category);

        modalImages.innerHTML = post.images.map(img => `
            <img src="${img}" alt="${post.title}" onclick="openLightbox('${img}', '${post.title}')">
        `).join('');

        modalContent.innerHTML = post.content;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close post modal
    function closePostModal() {
        const modal = document.getElementById('postModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

        // Update prev/next buttons
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

        // Render page numbers
        pageNumbersContainer.innerHTML = '';

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    renderGallery();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                pageNumbersContainer.appendChild(pageBtn);
            } else if (
                i === currentPage - 2 ||
                i === currentPage + 2
            ) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '0.5rem';
                pageNumbersContainer.appendChild(ellipsis);
            }
        }
    }

    // Helper functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function getCategoryName(category) {
        const categories = {
            'lab': 'Laboratory',
            'event': 'Events',
            'research': 'Research Activities'
        };
        return categories[category] || category;
    }

    // Event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            filterPosts();
        });
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentView = button.dataset.view;
            renderGallery();
        });
    });

    searchInput.addEventListener('input', debounce(filterPosts, 300));

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        sortPosts();
        renderGallery();
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderGallery();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderGallery();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Post modal close handlers
    const postModalClose = document.querySelector('.post-modal-close');
    const postModal = document.getElementById('postModal');

    if (postModalClose) {
        postModalClose.addEventListener('click', closePostModal);
    }

    if (postModal) {
        postModal.addEventListener('click', (e) => {
            if (e.target === postModal) {
                closePostModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && postModal.classList.contains('active')) {
            closePostModal();
        }
    });

    // Lightbox functionality
    window.openLightbox = function(imageSrc, caption) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');

        if (lightbox && lightboxImg) {
            lightboxImg.src = imageSrc;
            lightboxCaption.textContent = caption;
            lightbox.classList.add('active');
        }
    };

    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize
    await loadPosts();
});
