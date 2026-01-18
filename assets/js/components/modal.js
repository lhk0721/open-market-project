import { getRootPrefix } from "../utils/path.js";

const rootPrefix = getRootPrefix();
export const NOT_IMPLEMENTED_MSG = "해당 영역은 현재 목표 범위에 포함되어<br>있지 않아 구현되지 않았습니다.<br>메인 페이지로 이동하시겠습니까?";

// window에도 등록 (다른 파일에서 접근 가능하도록)
window.NOT_IMPLEMENTED_MSG = NOT_IMPLEMENTED_MSG;

export const getModalHTML = () => `
    <div id="global-modal" class="modal-overlay" style="display: none;">
        <article class="modal-content">
            <button type="button" id="btn-modal-close" class="btn-close-x">
                <img src="${rootPrefix}assets/images/icon-delete.svg" class="btn-close-x-icon" alt="닫기">
            </button>
            <p class="modal-text"></p>
            <div class="modal-btns">
                <button type="button" id="btn-modal-cancel" class="btn-no">아니오</button>
                <button type="button" id="btn-modal-confirm" class="btn-yes">예</button>
            </div>
        </article>
    </div>
`;

// 메인으로 이동하는 공통 함수
window.goToMain = () => {
    location.href = `${rootPrefix}index.html`;
};

// 전역 모달 실행 함수
// @param {string} message - 모달에 표시할 문구
// @param {function} onConfirm - '예' 클릭 시 실행할 함수
window.showGlobalModal = (message, onConfirm) => {
    const modal = document.getElementById('global-modal');
    const modalText = modal?.querySelector('.modal-text');
    const confirmBtn = document.getElementById('btn-modal-confirm');

    if (!modal || !modalText || !confirmBtn) {
        console.error('모달 요소를 찾을 수 없습니다:', { modal, modalText, confirmBtn });
        return;
    }

    modalText.innerHTML = message;

    // 이벤트 중복 방지를 위해 버튼 복제
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', () => {
        window.closeModal();
        if (onConfirm) onConfirm();
    });

    modal.style.display = 'flex';
};

// 기존 로그인 유도 모달 유지
window.openModal = () => {
    window.showGlobalModal("로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?", () => {
        location.href = `${rootPrefix}html/login/index.html`;
    });
};

window.closeModal = () => {
    const modal = document.getElementById('global-modal');
    if (modal) modal.style.display = 'none';
};

document.addEventListener('click', (e) => {
    // '아니오' 버튼 또는 'X' 아이콘 클릭 시
    if (e.target.closest('#btn-modal-cancel') || e.target.closest('#btn-modal-close')) {
        window.closeModal();
    }
    
    // 모달 배경(어두운 영역) 클릭 시
    const modalOverlay = document.getElementById('global-modal');
    if (e.target === modalOverlay) {
        window.closeModal();
    }
});

// 페이지 로드 시 모달 HTML을 DOM에 삽입
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('global-modal')) {
        document.body.insertAdjacentHTML('beforeend', getModalHTML());
        console.log('모달 HTML이 DOM에 추가되었습니다.');
    }
});