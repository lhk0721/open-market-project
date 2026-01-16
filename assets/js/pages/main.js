// 1. 필요한 요소 선택
const sliderList = document.querySelector('.slider-list');
const slides = document.querySelectorAll('.main-visual');
const prevBtn = document.querySelector('.btn-prev');
const nextBtn = document.querySelector('.btn-next');
const paginationItems = document.querySelectorAll('.pagination li');

let currentIndex = 0;
const totalSlides = slides.length;
const intervalTime = 3000; // 5초마다 전환
let slideInterval;

// 2. UI 업데이트 함수
function updateUI() {
    // 슬라이드 이동
    sliderList.style.transform = `translateX(-${currentIndex * 100}%)`;

    // 페이지네이션 업데이트
    paginationItems.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('on');
        } else {
            item.classList.remove('on');
        }
    });
}

// 3. 다음 슬라이드로 이동하는 함수 (공통 로직)
function moveToNextSlide() {
    if (currentIndex < totalSlides - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; // 마지막이면 처음으로
    }
    updateUI();
}

// 4. 자동 슬라이드 시작 함수
function startAutoSlide() {
    // 기존 타이머가 있다면 제거 (중복 방지)
    stopAutoSlide();
    slideInterval = setInterval(moveToNextSlide, intervalTime);
}

// 5. 자동 슬라이드 정지 함수
function stopAutoSlide() {
    clearInterval(slideInterval);
}

// 6. 이벤트 리스너: 다음 버튼
nextBtn.addEventListener('click', () => {
    moveToNextSlide();
    startAutoSlide(); // 사용자가 클릭하면 타이머를 새로 시작 (UX 향상)
});

// 7. 이벤트 리스너: 이전 버튼
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = totalSlides - 1;
    }
    updateUI();
    startAutoSlide(); // 사용자가 클릭하면 타이머를 새로 시작
});

// 8. 페이지네이션 클릭 이벤트 (추가 기능)
paginationItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentIndex = index;
        updateUI();
        startAutoSlide();
    });
});

// 9. 마우스 오버 시 일시정지 (선택 사항)
sliderList.addEventListener('mouseenter', stopAutoSlide);
sliderList.addEventListener('mouseleave', startAutoSlide);

// 초기 실행
startAutoSlide();