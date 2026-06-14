document.addEventListener('DOMContentLoaded', () => {

    /* 공통 로그인 상태 처리 */
    const authStatusArea = document.getElementById('auth-status-area');
    
    function updateNavbarAuth() {
        if (!authStatusArea) return;

        const loggedInId = localStorage.getItem('loginUser');

        if (loggedInId) {
            authStatusArea.innerHTML = `
                <li style="color: #673ab7; font-weight: bold;"><span>${loggedInId}</span>님 환영합니다</li>
                <li><a href="#" id="btn-logout" style="color: #d32f2f;">로그아웃</a></li>
            `;

            document.getElementById('btn-logout').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('loginUser');
                alert('로그아웃 되었습니다.');
                location.reload();
            });
        } else {
            authStatusArea.innerHTML = `
                <li><a href="LogIn.html">회원가입</a></li>
                <li style="margin-left: 0;"><a href="LogIn_Page.html">로그인</a></li>
            `;
        }
    }

    updateNavbarAuth();


    /* 메인 페이지 index.html */
    
    // 간편 로그인 유효성 검사
    const easyLoginForm = document.getElementById('easy-login-form');
    if (easyLoginForm) {
        easyLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('easy-id').value.trim();
            const pw = document.getElementById('easy-pw').value.trim();

            if (id.length < 4 || id.length > 12 || !/^[A-Za-z0-9]+$/.test(id)) {
                alert('아이디는 영문, 숫자 조합으로 4~12자 사이여야 합니다.');
                return;
            }
            if (pw.length < 8 || !/^[A-Za-z0-9]+$/.test(pw)) {
                alert('비밀번호는 영문, 숫자 조합으로 8자 이상이어야 합니다.');
                return;
            }
            
            localStorage.setItem('loginUser', id);
            alert(`${id}님, 환영합니다! (간편 로그인 성공)`);
            location.reload();
        });
    }

    // 광고 배너 롤링
    const rollingBanner = document.getElementById('rolling-banner');
    if (rollingBanner) {
        const ads = [
            "5월 1달동안 문학 도서 10% 할인!",
            "지금 가입하면 선착순 팝업북 증정!",
            "오늘의 추천 도서 리뷰 쓰고 적립금 받자!"
        ];
        let currentAdIdx = 0;
        setInterval(() => {
            currentAdIdx = (currentAdIdx + 1) % ads.length;
            rollingBanner.innerText = ads[currentAdIdx];
        }, 4000);
    }

    // 다크모드 토글
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentBg = document.body.style.backgroundColor;
            if (currentBg === 'rgb(42, 38, 51)') {
                document.body.style.backgroundColor = '#faf9ff';
                document.body.style.color = '#444';
            } else {
                document.body.style.backgroundColor = '#2a2633';
                document.body.style.color = '#eee';
            }
        });
    }

    // 검색창 제어
    const searchBtn = document.getElementById('search-btn');
    const mainSearch = document.getElementById('main-search');
    if (searchBtn && mainSearch) {
        searchBtn.addEventListener('click', () => {
            const query = mainSearch.value;
            if (!query.trim()) alert('검색어를 입력해 주세요!');
            else alert(`'${query}'에 대한 검색 기능은 준비 중입니다.`);
        });
    }


    /* 회원가입 페이지 */
    // 이메일 입력 방식 전환
    const emailDomain = document.getElementById('email-domain');
    const emailDirect = document.getElementById('email-direct');
    if (emailDomain && emailDirect) {
        emailDomain.addEventListener('change', function() {
            if (this.value === '직접입력') emailDirect.style.display = 'block';
            else emailDirect.style.display = 'none';
        });
    }

    // 약관 전체 동의
    const checkAll = document.getElementById('check-all');
    const subChecks = document.querySelectorAll('.sub-check');
    if (checkAll) {
        checkAll.addEventListener('change', function() {
            subChecks.forEach(cb => cb.checked = checkAll.checked);
        });
    }

    // 아이디 중복 체크
    let isIdChecked = false;
    const btnCheckId = document.getElementById('btn-check-id');
    const joinId = document.getElementById('join-id');
    if (btnCheckId && joinId) {
        btnCheckId.addEventListener('click', () => {
            const id = joinId.value;
            if (!/^[A-Za-z0-9]{4,12}$/.test(id)) {
                alert('아이디 양식을 확인해주세요.');
                return;
            }
            alert('사용 가능한 아이디입니다.');
            isIdChecked = true;
        });
        
        joinId.addEventListener('input', () => {
            isIdChecked = false;
        });
    }

    // 가입 폼 유효성 검사
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            document.querySelectorAll('.error-msg').forEach(el => el.innerText = '');

            // 아이디 검사
            const id = document.getElementById('join-id').value;
            if (!/^[A-Za-z0-9]{4,12}$/.test(id)) {
                document.getElementById('err-id').innerText = '아이디는 영문/숫자 조합 4~12자여야 합니다.';
                isValid = false;
            } else if (!isIdChecked) {
                document.getElementById('err-id').innerText = '아이디 중복확인을 진행해 주세요.';
                isValid = false;
            }

            // 비밀번호 검사
            const pw = document.getElementById('join-pw').value;
            const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!pwRegex.test(pw)) {
                document.getElementById('err-pw').innerText = '비밀번호는 영문과 숫자를 포함하여 8자 이상이어야 합니다.';
                isValid = false;
            }

            // 비밀번호 일치 확인
            const pwConfirm = document.getElementById('join-pw-confirm').value;
            if (pw !== pwConfirm) {
                document.getElementById('err-pw-confirm').innerText = '비밀번호가 일치하지 않습니다.';
                isValid = false;
            }

            // 이름 검사
            const name = document.getElementById('join-name').value.trim();
            if (!name) {
                document.getElementById('err-name').innerText = '이름을 입력해 주세요.';
                isValid = false;
            }

            // 이메일 검사
            const emailUser = document.getElementById('email-user').value.trim();
            const emailDomainVal = document.getElementById('email-domain').value;
            if (!emailUser || !emailDomainVal) {
                document.getElementById('err-email').innerText = '이메일 주소를 완성해 주세요.';
                isValid = false;
            }

            // 휴대폰 번호 검사
            const phone = document.getElementById('join-phone').value;
            if (!/^\d{10,11}$/.test(phone)) {
                document.getElementById('err-phone').innerText = '올바른 휴대폰 번호(숫자 10~11자리)를 입력하세요.';
                isValid = false;
            }

            // 필수 약관 검사
            const vitals = document.querySelectorAll('.vital');
            let allVitalChecked = true;
            vitals.forEach(v => { if (!v.checked) allVitalChecked = false; });
            if (!allVitalChecked) {
                document.getElementById('err-agree').innerText = '필수 이용약관에 모두 동의하셔야 합니다.';
                isValid = false;
            }

            if (isValid) {
                alert('회원가입이 정상적으로 완료되었습니다!');
                window.location.href = "LogIn_Page.html";
            }
        });
    }


    /* 상세 로그인 페이지 */
    const detailedLoginForm = document.getElementById('detailed-login-form');
    if (detailedLoginForm) {
        detailedLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            document.getElementById('err-login-id').innerText = '';
            document.getElementById('err-login-pw').innerText = '';
            document.getElementById('err-captcha').innerText = '';

            const id = document.getElementById('user-id').value.trim();
            const pw = document.getElementById('user-pw').value.trim();
            const isHuman = document.getElementById('robot-check').checked;
            let isValid = true;

            if (id.length < 4) {
                document.getElementById('err-login-id').innerText = '아이디 유효 형식이 아닙니다.';
                isValid = false;
            }
            if (pw.length < 6) {
                document.getElementById('err-login-pw').innerText = '비밀번호는 최소 6자 이상입니다.';
                isValid = false;
            }
            if (!isHuman) {
                document.getElementById('err-captcha').innerText = '로봇이 아님을 인증해 주세요.';
                isValid = false;
            }

            if (isValid) {
                localStorage.setItem('loginUser', id);
                alert('성공적으로 로그인되었습니다!');
                window.location.href = "index.html";
            }
        });
    }


    /* 리뷰 게시판 페이지 */
    const reviewAddForm = document.getElementById('review-add-form');
    if (reviewAddForm) {
        let currentPostNo = 2;

        reviewAddForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const bookTitle = document.getElementById('review-book').value.trim();
            const writer = document.getElementById('review-author').value.trim();
            
            if (!bookTitle || !writer) {
                alert('내용을 모두 입력해 주세요!');
                return;
            }

            currentPostNo++;
            
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            const tbody = document.getElementById('board-content');
            if (tbody) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${currentPostNo}</td>
                    <td>${bookTitle}</td>
                    <td>${writer}</td>
                    <td>${dateStr}</td>
                `;
                tbody.appendChild(newRow);
            }

            document.getElementById('review-book').value = '';
            document.getElementById('review-author').value = '';

            alert('리뷰가 성공적으로 등록되었습니다!');
        });
    }

    /* 사이트 소개 페이지 */
    const aboutForm = document.getElementById('about-form');
    if (aboutForm) {
        aboutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const visitorName = document.getElementById('about-visitor-name').value.trim();
            const message = document.getElementById('about-message').value.trim();
            
            if (!visitorName || !message) {
                alert('내용을 모두 입력해 주세요!');
                return;
            }
            
            alert(`감사합니다, ${visitorName}님! 소중한 의견이 정상적으로 접수되었습니다.`);
            
            // 입력 필드 초기화
            document.getElementById('about-visitor-name').value = '';
            document.getElementById('about-message').value = '';
        });
    }
});