// Bản quyền © 2026 Duck
// Các phần tử DOM
const servicesGrid = document.getElementById('servicesGrid');
const servicesFilter = document.getElementById('servicesFilter');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');
const SUPABASE_URL = 'https://lxlcpiixeyipcytfdkjn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bGNwaWl4ZXlpcGN5dGZka2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzM5OTcsImV4cCI6MjA4NjE0OTk5N30.yQFZWHRi9tz1FVON80BLFoztxngy59aEQDi_TcwauHg';

// Khởi tạo dịch vụ khi tải trang
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    renderServices();
    setupEventListeners();
    setupReviews();
    updateActiveNavLink();
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
        window.scrollTo(0, 0);
    }
});

// Render danh sách dịch vụ
function renderServices(filter = 'all') {
    if (!servicesGrid) {
        return;
    }

    servicesGrid.innerHTML = '';

    const categories = [
        { key: 'app', label: 'App', description: 'Dịch vụ phổ biến theo App.' },
        { key: 'appstore', label: 'Appstore', description: 'Dịch vụ hỗ trợ hệ thống Appstore.' },
        { key: 'game', label: 'Game', description: 'Dịch vụ dành riêng cho Game.' },
        { key: 'source', label: 'Source', description: 'Dịch vụ theo Source cung cấp.' }
    ];

    let activeCategories = filter === 'all'
        ? categories
        : categories.filter(category => category.key === filter);

    if (filter === 'all') {
        activeCategories = [...activeCategories].sort((a, b) => {
            const countA = services.filter(service => service.tag === a.key).length;
            const countB = services.filter(service => service.tag === b.key).length;
            if (countA === 0 && countB === 0) {
                return 0;
            }
            if (countA === 0) {
                return 1;
            }
            if (countB === 0) {
                return -1;
            }
            return 0;
        });
    }

    activeCategories.forEach(category => {
        const categoryServices = services.filter(service => service.tag === category.key);

        const categorySection = document.createElement('div');
        categorySection.className = 'service-category';
        categorySection.innerHTML = `
            <div class="service-category-header">
                <h3 class="service-category-title">${category.label}</h3>
                <p class="service-category-subtitle">${category.description}</p>
            </div>
            <div class="services-grid service-category-grid"></div>
        `;

        const categoryGrid = categorySection.querySelector('.service-category-grid');

        if (categoryServices.length === 0) {
            categoryGrid.innerHTML = '<p class="service-empty">Chưa có dịch vụ</p>';
        } else {
            categoryServices.forEach(service => {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'service-card';
                serviceCard.dataset.id = service.id;

                let tagBadge = '';
                if (service.tag === 'app') {
                    tagBadge = '<span class="badge-popular service-badge">App</span>';
                } else if (service.tag === 'appstore') {
                    tagBadge = '<span class="badge-premium service-badge">Appstore</span>';
                } else if (service.tag === 'game') {
                    tagBadge = '<span class="badge-exclusive service-badge">Game</span>';
                } else if (service.tag === 'source') {
                    tagBadge = '<span class="badge-basic service-badge">Source</span>';
                }

                const featuresList = service.features.slice(0, 3).map(feature => `<li>${feature}</li>`).join('');

                serviceCard.innerHTML = `
                    <div class="service-content">
                        ${tagBadge}
                        <h3 class="service-title">${service.title}</h3>
                        <p class="service-description">${service.description}</p>

                        <div class="service-features">
                            <ul>
                                ${featuresList}
                                ${service.features.length > 3 ? '<li>...và ' + (service.features.length - 3) + ' tính năng khác</li>' : ''}
                            </ul>
                        </div>

                        <div class="service-meta">
                            <div>
                                <div class="service-price">${service.price}</div>
                                <div class="service-duration">${service.duration}</div>
                            </div>
                            <a href="service-detail.html?id=${service.id}" class="btn btn-secondary">Xem chi tiết</a>
                        </div>
                    </div>
                `;

                categoryGrid.appendChild(serviceCard);
            });
        }

        servicesGrid.appendChild(categorySection);
    });
}

// Thiết lập các sự kiện
function setupEventListeners() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            const bars = document.querySelectorAll('.bar');
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    if (navLinks.length && hamburger && navMenu) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');

                    const bars = document.querySelectorAll('.bar');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            });
        });
    }

    if (servicesFilter) {
        const filterButtons = servicesFilter.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');
                renderServices(filter);
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            Object.fromEntries(formData);

            alert('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi trong thời gian sớm nhất.');
            contactForm.reset();
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
}

// Cập nhật menu đang chọn theo vị trí cuộn
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (correspondingLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                correspondingLink.classList.add('active');
            } else {
                correspondingLink.classList.remove('active');
            }
        }
    });
}

function setupReviews() {
    const reviewForm = document.getElementById('reviewForm');
    const reviewList = document.getElementById('reviewsList');
    const reviewServiceSelect = document.getElementById('reviewService');
    const averageRating = document.getElementById('averageRating');
    const averageStars = document.getElementById('averageStars');
    const reviewsCount = document.getElementById('reviewsCount');
    const ratingRows = document.querySelectorAll('.rating-row');
    const moreButton = document.getElementById('reviewsMoreButton');

    if (!reviewForm || !reviewList || !reviewServiceSelect) {
        return;
    }

    if (moreButton && reviewList.dataset.limit) {
        moreButton.style.display = 'none';
    }

    let storedReviews = [];
    populateServiceOptions(reviewServiceSelect);
    loadReviewsFromSupabase(reviewList, averageRating, averageStars, reviewsCount, ratingRows)
        .then(reviews => {
            storedReviews = reviews;
        })
        .catch(() => {
            storedReviews = [];
        });

    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = reviewForm.querySelector('#reviewName').value.trim();
        const message = reviewForm.querySelector('#reviewMessage').value.trim();
        const ratingInput = reviewForm.querySelector('input[name="rating"]:checked');
        const serviceValue = reviewServiceSelect.value;

        if (!name || !message || !ratingInput || !serviceValue) {
            return;
        }

        const newReview = {
            name,
            message,
            rating: Number(ratingInput.value),
            service: serviceValue
        };

        createReviewInSupabase(newReview)
            .then(createdReview => {
                storedReviews = [createdReview, ...storedReviews];
                renderReviews(storedReviews, reviewList, averageRating, averageStars, reviewsCount, ratingRows);
                reviewForm.reset();
                reviewForm.querySelector('#star5').checked = true;
            })
            .catch(() => {
                alert('Không thể gửi đánh giá. Vui lòng thử lại.');
            });
    });
}

function populateServiceOptions(selectElement) {
    selectElement.innerHTML = '<option value="">Chọn dịch vụ</option>';
    const options = Array.isArray(reviewServices) && reviewServices.length
        ? reviewServices
        : Array.from(new Set(services.map(service => service.title)));
    options.forEach(title => {
        const option = document.createElement('option');
        option.value = title;
        option.textContent = title;
        selectElement.appendChild(option);
    });
}

async function loadReviewsFromSupabase(reviewList, averageRating, averageStars, reviewsCount, ratingRows) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews?select=*&order=created_at.desc`, {
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error('Supabase fetch failed');
    }

    const reviews = await response.json();
    renderReviews(reviews, reviewList, averageRating, averageStars, reviewsCount, ratingRows);
    return reviews;
}

async function createReviewInSupabase(review) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
        method: 'POST',
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
        },
        body: JSON.stringify(review)
    });

    if (!response.ok) {
        throw new Error('Supabase insert failed');
    }

    const created = await response.json();
    return created[0];
}

function renderReviews(reviews, reviewList, averageRating, averageStars, reviewsCount, ratingRows) {
    if (!reviewList || !averageRating || !averageStars || !reviewsCount) {
        return;
    }

    reviewList.innerHTML = '';
    if (!reviews.length) {
        reviewList.innerHTML = '<div class="review-empty">Chưa có đánh giá</div>';
        averageRating.textContent = '0.0';
        averageStars.innerHTML = renderStars(0);
        reviewsCount.textContent = '0 đánh giá';
        updateRatingBreakdown(ratingRows, []);
        toggleReviewsMoreButton(reviewList, 0);
        return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avg = totalRating / reviews.length;
    averageRating.textContent = avg.toFixed(1);
    averageStars.innerHTML = renderStars(avg);
    reviewsCount.textContent = `${reviews.length} đánh giá`;
    updateRatingBreakdown(ratingRows, reviews);

    const limit = Number(reviewList.dataset.limit) || 0;
    const displayReviews = limit > 0 ? reviews.slice(0, limit) : reviews;
    toggleReviewsMoreButton(reviewList, reviews.length);

    displayReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <div>
                    <div class="review-name">${review.name}</div>
                    <div class="review-service">${review.service}</div>
                </div>
                <div class="review-stars">${renderStars(review.rating)}</div>
            </div>
            <p class="review-message">${review.message}</p>
        `;
        reviewList.appendChild(reviewCard);
    });
}

function updateRatingBreakdown(ratingRows, reviews) {
    if (!ratingRows) {
        return;
    }

    const total = reviews.length;
    ratingRows.forEach(row => {
        const ratingValue = Number(row.getAttribute('data-rating'));
        const count = reviews.filter(review => review.rating === ratingValue).length;
        const percent = total ? Math.round((count / total) * 100) : 0;
        const fill = row.querySelector('.rating-fill');
        const percentLabel = row.querySelector('.rating-percent');
        if (fill) {
            fill.style.width = `${percent}%`;
        }
        if (percentLabel) {
            percentLabel.textContent = `${percent}%`;
        }
    });
}

function toggleReviewsMoreButton(reviewList, totalReviews) {
    const moreButton = document.getElementById('reviewsMoreButton');
    if (!moreButton || !reviewList) {
        return;
    }

    const limit = Number(reviewList.dataset.limit) || 0;
    if (limit > 0 && totalReviews > limit) {
        moreButton.style.display = 'inline-flex';
    } else {
        moreButton.style.display = 'none';
    }
}

function renderStars(rating) {
    const rounded = Math.round(rating);
    let stars = '';
    for (let i = 1; i <= 5; i += 1) {
        stars += `<span class="${i <= rounded ? '' : 'star-muted'}">★</span>`;
    }
    return stars;
}