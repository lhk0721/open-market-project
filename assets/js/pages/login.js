import { loginAPI } from "../api/auth.js";
import { setToken, setUserType } from "../utils/storage.js";
import { NOT_IMPLEMENTED_MSG } from "../components/modal.js";

document.addEventListener("DOMContentLoaded", () => {
    // DOM 요소 선택
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const userTypeInput = document.getElementById("userType");
    const errorLabel = document.getElementById("errorMessage");
    const tabs = document.querySelectorAll(".login-tabs button");

    // 1. [팀원 코드 통합] 탭 전환 및 유저 타입 설정 로직
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // 모든 탭 스타일 및 접근성 속성 초기화
            tabs.forEach(t => {
                t.classList.remove("on");
                t.setAttribute("aria-selected", "false");
            });
            
            // 클릭한 탭 활성화
            tab.classList.add("on");
            tab.setAttribute("aria-selected", "true");
            
            // 서버 전송용 hidden input 값 업데이트 (BUYER/SELLER)
            userTypeInput.value = tab.dataset.type;
            
            // 탭 전환 시 이전 에러 메시지 초기화 및 숨김
            resetUI();
        });
    });

    // 2. [본인 코드 통합] 로그인 제출 로직
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // 브라우저 기본 제출 동작 방지
        
        resetUI(); // 새로운 시도 전 UI 초기화

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const user_type = userTypeInput.value;

        // [UX 개선] 공란 체크 및 포커스 이동
        if (!username) {
            displayError("아이디를 입력해 주세요.", usernameInput);
            return;
        }
        if (!password) {
            displayError("비밀번호를 입력해 주세요.", passwordInput);
            return;
        }

        try {
            // 실제 API 호출 및 결과 대기
            const result = await loginAPI(username, password);
            
            // [데이터 저장] 토큰 및 사용자 정보 스토리지 저장
            setToken(result.access, result.refresh);
            setUserType(result.user.user_type);
            localStorage.setItem("isLoggedIn", "true");

            // [스마트 리다이렉션] 이전 페이지 또는 메인으로 이동
            const prevPage = document.referrer;
            if (prevPage && !prevPage.includes("login")) {
                location.href = prevPage;
            } else {
                location.href = "../../index.html";
            }
            
        } catch (error) {
            // [에러 처리] 불일치 시 메시지 노출 및 비밀번호 칸 초기화 후 포커스
            displayError("아이디 또는 비밀번호가 일치하지 않습니다.", passwordInput);
            passwordInput.value = ""; 
            passwordInput.focus();
        }
    });

    /**
     * 에러 메시지 출력 및 해당 입력창 포커스 함수
     */
    function displayError(message, targetElement) {
        errorLabel.textContent = message;
        // 웹 접근성 'ir' 클래스 제거 및 노출
        errorLabel.classList.remove("ir");
        errorLabel.style.display = "block";
        
        if (targetElement) {
            targetElement.focus();
        }
    }

    /**
     * 에러 UI 초기화 함수
     */
    function resetUI() {
        errorLabel.classList.add("ir");
        errorLabel.style.display = "none";
        errorLabel.textContent = "";
    }

    // 3. 비밀번호 찾기 미구현 모달 연결
    const findPwBtn = document.querySelector('.login-footer a:last-child');
    findPwBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.showGlobalModal === 'function') {
            window.showGlobalModal(NOT_IMPLEMENTED_MSG, window.goToMain);
        }
    });
});