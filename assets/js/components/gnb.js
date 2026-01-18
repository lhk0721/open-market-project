import { getRootPrefix } from "../utils/path.js";
import { isAuthenticated, removeToken } from "../utils/storage.js";
import { NOT_IMPLEMENTED_MSG, getModalHTML } from "./modal.js";

const initGNB = () => {
    const header = document.querySelector('header');
    if (!header) return;

    // 현재 페이지가 html 폴더 안에 있는지 체크 (하위 폴더 깊이 확인)
    const rootPrefix = getRootPrefix();

    // 1. 헤더 HTML 구조 동적 생성 (기존 HTML 복사)
    header.innerHTML = `
        <div class="container"> 
            <div class="logo-search-group">
                <h1 class="logo">
                    <a href="${rootPrefix}index.html">
                        <img src="${rootPrefix}assets/images/Logo-hodu.svg">
                    </a>
                </h1>
                <div class="search-form">
                    <input type="text" class="search-input" placeholder="상품을 검색해보세요!">
                    <button class="btn-search"><img src="${rootPrefix}assets/images/icon-search.svg"></button>
                </div>
            </div>
            <div class="user-menu">
                <button class="seller-btn" id="seller-btn">
                    <img src="${rootPrefix}assets/images/icon-shopping-bag.svg">
                    <p class="seller-txt">판매자 센터</p>
                </button>
                <button class="cart-btn">장바구니</button> 
                <div class="dropdown-container">
                    <button class="login-btn" id="login-btn">
                        <span id="user-status-login">로그인</span>
                    </button>
                    <div id="mypage-dropdown" class="dropdown-menu">
                        <button type="button" id="mypage-btn" class="menu-item">마이페이지</button>
                        <button type="button" id="logout-btn" class="menu-item">로그아웃</button>
                    </div>
                </div>
            </div>
        </div>
        ${getModalHTML()}
    `;

    const cartBtn = document.querySelector('.cart-btn'); // 구매자용 장바구니 버튼
    const sellerBtn = document.querySelector('.seller-btn'); //판매자용 판매자 센터 버튼
    const loginBtn = document.getElementById('login-btn');
    const dropdownMenu = document.getElementById('mypage-dropdown');
    const userText = document.getElementById('user-status-login');
    const logoutBtn = document.getElementById('logout-btn');
    const mypageBtn = document.getElementById('mypage-btn');
    const searchBtn = document.querySelector('.btn-search');
    const searchInput = document.querySelector('.search-input');
    
    // storage.js의 함수를 사용하여 실제 로그인 상태 확인
    let isLoggedIn = isAuthenticated(); 
    let userType = localStorage.getItem('user_type');

    // 화면 UI 업데이트 함수
    const updateUI = () => {
        if (userText) {
            userText.textContent = isLoggedIn ? '마이페이지' : '로그인';
        }
        //로그인 상태 및 유저 타입에 따른 버튼 제어
        if (isLoggedIn) {
            if (userType === 'BUYER') {
                // 기존 CSS 레이아웃 유지
                if (cartBtn) cartBtn.style.display = 'flex'; 
                if (sellerBtn) sellerBtn.style.display = 'none';
            } else if (userType === 'SELLER') {
                if (cartBtn) cartBtn.style.display = 'none';
                if (sellerBtn) sellerBtn.style.display = 'flex'; 
            }
        } else {
            // 비로그인 시 기본값: 장바구니 버튼 노출
            if (cartBtn) cartBtn.style.display = 'flex'; 
            if (sellerBtn) sellerBtn.style.display = 'none';
            
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            if (loginBtn) loginBtn.classList.remove('active');
        }
    };

    updateUI();

    // 검색창 관련 모달창
    const handleNotImplemented = () => {
        window.showGlobalModal(NOT_IMPLEMENTED_MSG, window.goToMain);
    };

    if (searchBtn) searchBtn.addEventListener('click', handleNotImplemented);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleNotImplemented();
        });
    }

    // 장바구니 버튼 클릭 시
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (!isLoggedIn) {
                if (typeof openModal === 'function') openModal(); 
            } else {
                handleNotImplemented();
                // location.href = `${rootPrefix}cart/index.html`;
            }
        });
    }

    if (sellerBtn) {
        sellerBtn.addEventListener('click', handleNotImplemented);
        // sellerBtn.addEventListener('click', () => {
        //     location.href = `${rootPrefix}seller-center/index.html`; // 판매자 센터 경로
        // });
    }

    if (mypageBtn) {
        mypageBtn.addEventListener('click', handleNotImplemented);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.showGlobalModal("로그아웃 하시겠습니까?", () => {
                removeToken();
                localStorage.removeItem('isLoggedIn'); 
                localStorage.removeItem('user_type');
                isLoggedIn = false;
                updateUI();
                window.goToMain(); // 초기화 후 메인으로 이동
            });
        });
    }

    // 로그인/마이페이지 버튼 및 드롭다운
    if (loginBtn && dropdownMenu) {
        loginBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isLoggedIn) {
                location.href = `${rootPrefix}html/login/index.html`;
            } else {
                const isShowing = dropdownMenu.classList.toggle('show');
                loginBtn.classList.toggle('active', isShowing);
            }
        });

        dropdownMenu.addEventListener('click', (e) => e.stopPropagation());
    }

    // 바깥 영역 클릭 시 드롭다운 닫기
    window.addEventListener('click', () => {
        if (dropdownMenu && dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
            loginBtn.classList.remove('active');
        }
    });
};

document.addEventListener('DOMContentLoaded', initGNB);