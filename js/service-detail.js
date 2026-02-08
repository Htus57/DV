// DOM Elements
const serviceDetailContainer = document.getElementById('serviceDetailContainer');
const allServicesContainer = document.getElementById('allServicesContainer');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadServiceDetail();
    renderAllServices();
    setupEventListeners();
});

// Load service detail based on URL parameter
function loadServiceDetail() {
    // Get service ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    
    // Find the service
    let service;
    if (serviceId) {
        service = services.find(s => s.id == serviceId);
    }
    
    // If service not found or no ID provided, show the first service
    if (!service) {
        service = services[0];
    }
    
    // Render service detail
    renderServiceDetail(service);
}

// Render service detail
function renderServiceDetail(service) {
    serviceDetailContainer.innerHTML = `
        <div class="service-detail-card">
            <div class="service-detail-header">
                <h1>${service.title}</h1>
                <div class="price">${service.price}</div>
            </div>
            
            <div class="service-detail-content">
                <p>${service.description}</p>
                
                <div class="features-section">
                    <h2>Những gì bạn nhận được</h2>
                    <ul id="detailFeatures">
                        ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="preparations-section">
                    <h2>Chuẩn bị trước buổi làm việc</h2>
                    <ul id="detailPreparations">
                        ${service.preparations.map(preparation => `<li>${preparation}</li>`).join('')}
                    </ul>
                </div>
                
            </div>
            
            <div class="service-detail-actions">
                <a href="index.html#contact" class="btn btn-primary">Đặt lịch ngay</a>
                <a href="index.html#services" class="btn btn-secondary">Xem dịch vụ khác</a>
            </div>
        </div>
    `;
}

// Render all services (for the "other services" section)
function renderAllServices(filter = 'all') {
    allServicesContainer.innerHTML = '';
    
    let filteredServices = services;
    
    // Apply filter
    if (filter !== 'all') {
        filteredServices = services.filter(service => service.tag === filter);
    }
    
    if (filteredServices.length === 0) {
        allServicesContainer.innerHTML = '<p class="service-empty">Chưa có dịch vụ</p>';
        return;
    }

    // Render services
    filteredServices.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        
        let tagBadge = '';
        if (service.tag === 'game') {
            tagBadge = '<span class="pill pill-ghost" style="margin-bottom: 1rem; display: inline-block;"><i class="fas fa-gamepad"></i> Game</span>';
        } else if (service.tag === 'source') {
            tagBadge = '<span class="pill pill-soft" style="margin-bottom: 1rem; display: inline-block;"><i class="fas fa-code"></i> Source</span>';
        } else if (service.tag === 'appstore') {
            tagBadge = '<span class="pill" style="background: gold; color: #000; margin-bottom: 1rem; display: inline-block;"><i class="fas fa-store"></i> Appstore</span>';
        } else if (service.tag === 'app') {
            tagBadge = '<span class="pill" style="background: var(--light-gray); color: var(--dark-color); margin-bottom: 1rem; display: inline-block;"><i class="fas fa-mobile-alt"></i> App</span>';
        }
        
        serviceCard.innerHTML = `
            <div class="service-content">
                ${tagBadge}
                <h3 class="service-title">${service.title}</h3>
                <p class="service-description">${service.description.substring(0, 120)}...</p>
                <div class="service-meta">
                    <div class="service-price">${service.price}</div>
                    <a href="service-detail.html?id=${service.id}" class="btn btn-secondary">Xem chi tiết</a>
                </div>
            </div>
        `;
        
        allServicesContainer.appendChild(serviceCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Mobile navigation toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle hamburger animation
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
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Reset hamburger animation
                const bars = document.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Apply filter
            renderAllServices(filter);
        });
    });
}