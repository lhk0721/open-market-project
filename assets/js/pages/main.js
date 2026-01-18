import productAPI from '../api/product.js';

// 배너 및 슬라이더 설정
function setupBanners() {
    const sliderList = document.querySelector('.slider-list');
    const paginationItems = document.querySelectorAll('.pagination li');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const slides = document.querySelectorAll('.main-visual');
    
    if (!sliderList || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let slideInterval;

    // UI 업데이트 함수 (슬라이드 이동 및 페이지네이션 활성화)
    const updateUI = () => {
        // 슬라이드 이동
        sliderList.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // 페이지네이션 클래스 업데이트
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

    const startAuto = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 3000); // 3초마다 전환
    };

    // 버튼 이벤트 리스너
    nextBtn?.addEventListener('click', () => { nextSlide(); startAuto(); });
    prevBtn?.addEventListener('click', () => { prevSlide(); startAuto(); });

    // 페이지네이션 클릭 시 해당 슬라이드로 이동
    paginationItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateUI();
            startAuto();
        });
    });

    // 마우스 올리면 일시정지
    sliderList.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderList.addEventListener('mouseleave', startAuto);

    // 초기 실행
    startAuto();
}

// 상품 목록 렌더링
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

// 상품 카드 생성
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

document.addEventListener('DOMContentLoaded', () => {
    setupBanners();      // 정적 HTML 기반 슬라이더 작동
    renderMainProducts(); // 상품 목록 API 로드
});