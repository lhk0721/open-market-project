import productAPI from '../api/product.js';

// 배너 설정 및 렌더링
async function setupBanners() {
    const bannerList = document.querySelector('.slider-list');
    const pagination = document.querySelector('.pagination');
    if (!bannerList || !pagination) return;

    const banners = await productAPI.getBannerData(5);
    if (banners.length === 0) return;

    // 배너 HTML 동적 생성
    bannerList.innerHTML = banners.map((item, idx) => `
        <article class="main-visual">
            <h3 class="ir">${idx + 1}번째 배너</h3>
            <a href="./html/products/detail.html?id=${item.id}">
                <img src="${item.image}" alt="${item.name} 이벤트 배너">
            </a>
        </article>
    `).join('');

    // 페이지네이션 점(dot) 동적 생성
    pagination.innerHTML = banners.map((_, idx) => `
        <li class="${idx === 0 ? 'on' : ''}"><span class="ir">${idx + 1}번 배너</span></li>
    `).join('');

    // 배너 DOM 생성 후 슬라이더 기능 실행
    initSlider();
}

// 메인 슬라이더 초기화
function initSlider() {
    const sliderList = document.querySelector('.slider-list');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const paginationItems = document.querySelectorAll('.pagination li');

    if (!sliderList) return;

    let currentIndex = 0;
    const totalSlides = document.querySelectorAll('.main-visual').length;
    let slideInterval;

    const updateUI = () => {
        sliderList.style.transform = `translateX(-${currentIndex * 100}%)`;
        paginationItems.forEach((item, index) => {
            item.classList.toggle('on', index === currentIndex);
        });
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateUI();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateUI();
    };

    // 자동 슬라이드 시작 및 초기화 함수
    const startAuto = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 3000);
    };

    // 버튼 클릭 시 타이머 리셋 (사용자가 넘길 땐 자동 전환 일시 멈춤 효과)
    nextBtn?.addEventListener('click', () => { nextSlide(); startAuto(); });
    prevBtn?.addEventListener('click', () => { prevSlide(); startAuto(); });
    
    // 마우스 호버 시 일시 정지 기능
    sliderList.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderList.addEventListener('mouseleave', startAuto);

    startAuto();
}

// 상품 목록 렌더링 및 초기 실행
function createProductCard(product) {
    const productItem = document.createElement('li');
    productItem.className = 'product-item';
    
    productItem.innerHTML = `
        <article class="product-card" data-id="${product.id}">
            <figure class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </figure>
            <section class="product-info">
                <span class="seller">${product.seller.store_name}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="price-box"><strong class="price">${product.price.toLocaleString()}</strong>원</p>
            </section>
        </article>
    `;

    productItem.addEventListener('click', () => {
        location.href = `./html/products/detail.html?id=${product.id}`;
    });

    return productItem;
}

async function renderMainProducts() {
    const productList = document.querySelector('.product-list');
    if (!productList) return;
    
    try {
        const data = await productAPI.getAllProducts();
        const fragment = document.createDocumentFragment();
        productList.innerHTML = ''; 

        data.results.forEach(product => {
            const card = createProductCard(product);
            fragment.appendChild(card);
        });

        productList.appendChild(fragment);
    } catch (error) {
        console.error("상품 렌더링 에러:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupBanners();
    renderMainProducts();
});