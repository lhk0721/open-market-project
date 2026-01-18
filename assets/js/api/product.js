const BASE_URL = 'https://api.wenivops.co.kr/services/open-market'; // [cite: 53, 55]-확인

const productAPI = {
    // 전체 상품 목록 가져오기
    async getAllProducts() {
        try {
            const response = await fetch(`${BASE_URL}/products/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('상품 목록을 불러오지 못했습니다.');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async getBannerData(limit = 5) {
        try {
            // 전체 상품을 가져와서
            const data = await this.getAllProducts(); 
            // 상위 limit개(기본 5개)만 잘라서 반환합니다.
            return data.results.slice(0, limit); 
        } catch (error) {
            console.error('getBannerData 에러:', error);
            return []; // 에러 시 빈 배열을 반환해 main.js가 멈추지 않게 합니다.
        }
    },

    // 상품 상세 정보 불러오기 (GET)
    async getProductDetail(productId) {
        try {
            const response = await fetch(`${BASE_URL}/products/${productId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('상품 정보를 가져오는데 실패했습니다.'); // [cite: 244]
            }

            return await response.json(); // [cite: 243]
        } catch (error) {
            console.error('API Error (getProductDetail):', error);
            throw error;
        }
    },

    // 장바구니에 상품 넣기 (POST)
    // 구매자(BUYER) 계정만 가능하며 로그인 토큰이 필요합니다. [cite: 272, 284]
    async addToCart(productId, quantity, token) {
        try {
            const response = await fetch(`${BASE_URL}/cart/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId, // 
                    quantity: quantity,    // 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // 토큰 만료나 권한 부족 등의 에러 처리 [cite: 76, 300]
                throw new Error(data.detail || '장바구니 담기에 실패했습니다.');
            }

            return data; // [cite: 288]
        } catch (error) {
            console.error('API Error (addToCart):', error);
            throw error;
        }
    },

    // 바로 주문하기 생성 (POST)
    // 상세페이지에서 '바로구매' 시 사용되는 direct_order 방식입니다. [cite: 335, 338]
    async createDirectOrder(orderData, token) {
        try {
            const response = await fetch(`${BASE_URL}/order/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_kind: 'direct_order', // 
                    ...orderData 
                    /* orderData 포함 필수 필드: 
                    product (Int), quantity (Int), total_price (Int), 
                    receiver (String), receiver_phone_number (String), 
                    address (String), address_message (String), 
                    payment_method (card/deposit/phone/naverpay/kakaopay)
                    */
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // 총 금액 불일치 등 유효성 검사 실패 시 에러 메시지 반환 [cite: 361]
                throw new Error(data.non_field_errors || '주문 생성에 실패했습니다.');
            }

            return data; // [cite: 355]
        } catch (error) {
            console.error('API Error (createDirectOrder):', error);
            throw error;
        }
    },

    async getBannerProducts(limit = 5) {
        try {
            // 전체 상품 불러오기 API 활용
            const data = await this.getAllProducts(); 
            // 최신순으로 등록된 상품 중 limit(기본 5개)만큼만 잘라서 반환
            return data.results.slice(0, limit);
        } catch (error) {
            console.error('API Error (getBannerProducts):', error);
            return []; // 에러 발생 시 빈 배열 반환 (자연스러운 흐름)
        }
    }
};

export default productAPI;