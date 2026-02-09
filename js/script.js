// Bản quyền © 2026 Duck
// Các phần tử DOM
const servicesGrid = document.getElementById('servicesGrid');
const servicesFilter = document.getElementById('servicesFilter');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');

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
