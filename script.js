// 이지성 엔지니어 포트폴리오 로직 엔진 (v4.0 - Firebase Firestore Integrated)
// Firebase 라이브러리 임포트
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// [중요] Firebase 설정 - fire.txt의 실제 계정 정보로 연동되었습니다.
const firebaseConfig = {
  apiKey: "AIzaSyD7VrWQR8iQindxyp1ZTKTsOhHigu-a7-w",
  authDomain: "myportfolio-d9ab0.firebaseapp.com",
  projectId: "myportfolio-d9ab0",
  storageBucket: "myportfolio-d9ab0.firebasestorage.app",
  messagingSenderId: "702016022897",
  appId: "1:702016022897:web:08c0788110c51499412ed0",
  measurementId: "G-YMHJPRRPPS"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsCol = collection(db, "posts");

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w, h;
let scanLine = 0;
let patterns = [];
let ripples = [];

function initCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

window.addEventListener('resize', initCanvas);
initCanvas();

class Pattern {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.active = 0;
        this.color = `rgba(255, 92, 0, ${Math.random() * 0.3})`;
    }
    draw() {
        if (this.active > 0) {
            ctx.strokeStyle = `rgba(255, 92, 0, ${this.active})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y, this.size, this.size);
            this.active -= 0.01;
        }
    }
}

function createPatterns() {
    patterns = [];
    for (let i = 0; i < w; i += 40) {
        for (let j = 0; j < h; j += 40) {
            patterns.push(new Pattern(i, j));
        }
    }
}
createPatterns();

function animate() {
    // Semi-transparent clear to create trail effect
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.fillStyle = isLight ? 'rgba(245, 245, 247, 0.1)' : 'rgba(3, 3, 3, 0.1)';
    ctx.fillRect(0, 0, w, h);

    // 1. Draw Subtle Wafer Grid
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < w; i += 80) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let i = 0; i < h; i += 80) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // 2. Scanning Photolithography Laser
    scanLine += 3;
    if (scanLine > w) scanLine = -200;

    const grad = ctx.createLinearGradient(scanLine, 0, scanLine + 150, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, 'rgba(255, 92, 0, 0.2)');
    grad.addColorStop(1, 'transparent');
    
    ctx.fillStyle = grad;
    ctx.fillRect(scanLine, 0, 200, h);

    // 3. Pattern Activation on Scan
    patterns.forEach(p => {
        if (Math.abs(p.x - scanLine) < 50) {
            if (Math.random() > 0.95) p.active = 1;
        }
        p.draw();
    });

    // 4. Random Circuit "Growth" 
    if (Math.random() > 0.9) {
        ripples.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0,
            maxR: Math.random() * 150 + 50,
            opacity: 0.5
        });
    }

    ripples.forEach((r, i) => {
        ctx.strokeStyle = `rgba(0, 255, 135, ${r.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add "Circuit" lines branching from ripple
        ctx.beginPath();
        ctx.moveTo(r.x + r.r, r.y);
        ctx.lineTo(r.x + r.r + 20, r.y + 20);
        ctx.stroke();

        r.r += 2;
        r.opacity -= 0.01;
        if (r.opacity <= 0) ripples.splice(i, 1);
    });

    requestAnimationFrame(animate);
}
animate();

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

// Chatbot Logic Optimized for 이지성 (동양미래대 로봇소프트웨어과 컨텍스트 포함)
function toggleChat() {
    const panel = document.getElementById('chat-panel');
    panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
}

function handleChat(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (text) {
            addMessage('user', text);
            input.value = '';
            setTimeout(() => {
                respondTo(text);
            }, 800);
        }
    }
}

function addMessage(sender, text) {
    const box = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.style.marginBottom = '25px'; div.style.padding = '25px'; div.style.borderRadius = '25px';
    div.style.maxWidth = '85%'; div.style.fontSize = '1rem'; div.style.lineHeight = '1.6';
    
    if (sender === 'user') {
        div.style.alignSelf = 'flex-end'; div.style.background = 'var(--orange)';
        div.style.color = 'white'; div.style.borderBottomRightRadius = '4px'; div.style.fontWeight = '700';
    } else {
        div.style.alignSelf = 'flex-start'; div.style.background = 'var(--glass)';
        div.style.color = 'var(--white)'; div.style.borderBottomLeftRadius = '4px';
        div.style.border = '1px solid var(--glass-border)'; div.style.borderLeft = '4px solid var(--orange)';
    }

    div.innerHTML = text.replace(/\n/g, '<br>');
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function respondTo(text) {
    let res = "**이지성 엔지니어** 데이터 분석 결과: 동양미래대학교 로봇소프트웨어과 교육과정(Academic Blueprint)과 강점-직무 연결 챕터를 통해 직무 적합성을 확인하실 수 있습니다.";
    const q = text.toLowerCase();

    if (q.includes('학교') || q.includes('교육') || q.includes('전공') || q.includes('커리큘럼')) {
        res = "**[동양미래대학교 로봇소프트웨어과 교육과정의 가치]**\n\n- **PLC/로보틱스:** SK하이닉스의 EFEM 및 OHT 자동화 이송 로봇 정밀 제어의 근간입니다.\n- **AI/데이터:** 공정 내 미세 결함을 판정하고 수율을 예측하는 지능형 유지보수의 핵심입니다.\n- **임베디드/IoT:** 팹 환경의 파티클, 온습도 등 실시간 센서 데이터를 수집하고 관리하는 역량입니다.";
    } else if (q.includes('강점') || q.includes('장점') || q.includes('역량')) {
        res = "**[이지성 엔지니어의 3대 강점]**\n\n1. **끈기:** 0.1ms의 지연도 찾아내는 집념\n2. **도전:** AI 기술을 실제 공정에 이식하는 혁신\n3. **논리:** HW와 SW를 융합하는 설계 지능\n\n이 강점들은 고가용성 설비 운영과 제로 다운타임 실현의 원동력입니다.";
    } else if (q.includes('plc') || q.includes('로봇') || q.includes('시퀀스')) {
        res = "**[이지성: PLC 로봇 제어 성과]**\n\n- **장비:** LS Electric XGT / Siemens TIA Portal\n- **성과:** 0.1ms 간헐적 지연 원인 규명 및 로직 수정, OEE 18% 향상 달성\n- **학과연계:** 로봇오퍼레이션 및 PC기반제어 수업 내용을 실제 팹 시뮬레이션에 적용했습니다.";
    } else if (q.includes('ai') || q.includes('검사') || q.includes('불량')) {
        res = "**[이지성: AI 결함 판정 역량]**\n\n- **기술:** ResNet-50 v2 / YOLO v8\n- **정확도:** 98.4% 성공률\n- **학과연계:** 인공지능응용 및 파이썬프로그래밍 과정에서 습득한 딥러닝 역량을 수율 데이터 분석에 활용했습니다.";
    } else if (q.includes('연락처') || q.includes('번호') || q.includes('메일')) {
        res = "**[이지성 엔지니어 연락처]**\n\n- **전화:** 010-2162-6018\n- **메일:** jisung6018@gmail.com\n\n동양미래대학교 로봇소프트웨어과를 졸업한 준비된 엔지니어 이지성입니다.";
    }

    addMessage('ai', res);
}

// Global Nav Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Free Board Logic (Firebase Version) ---
async function toggleBoardForm() {
    const container = document.getElementById('board-form-container');
    const isHidden = container.style.display === 'none';
    container.style.display = isHidden ? 'block' : 'none';
    
    if (!isHidden) {
        document.getElementById('board-form').reset();
        document.getElementById('board-id').value = '';
        document.getElementById('form-title').innerText = '소중한 의견을 남겨주세요';
        document.getElementById('submit-btn').innerText = '게시글 등록하기';
    }
}

async function handleBoardSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('board-id').value;
    const name = document.getElementById('board-name').value;
    const email = document.getElementById('board-email').value;
    const title = document.getElementById('board-title').value;
    const content = document.getElementById('board-content').value;
    const password = document.getElementById('board-pw').value;

    try {
        if (id) {
            const postRef = doc(db, "posts", id);
            await updateDoc(postRef, { name, email, title, content, password });
            alert('게시글이 수정되었습니다.');
        } else {
            await addDoc(postsCol, {
                name, email, title, content, password,
                timestamp: serverTimestamp(),
                likes: 0,
                comments: []
            });
            alert('게시글이 성공적으로 등록되었습니다.');
        }
        toggleBoardForm();
        document.getElementById('board-pw').value = ''; // 비밀번호 필드 초기화
    } catch (e) {
        console.error("오류 발생: ", e);
        alert("처리에 실패했습니다.");
    }
}

async function deletePost(postId) {
    // 관리자이거나 비밀번호가 일치하면 삭제 허용
    if (!isAdmin) {
        const password = prompt('작성 시 설정한 비밀번호를 입력하세요:');
        if (!password) return;
        
        const { getDoc } = await import("https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js");
        const docSnap = await getDoc(doc(db, "posts", postId));
        if (docSnap.exists() && docSnap.data().password !== password) {
            return alert('비밀번호가 일치하지 않습니다.');
        }
    }

    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        try {
            await deleteDoc(doc(db, "posts", postId));
            alert('게시글이 삭제되었습니다.');
        } catch (e) {
            console.error("삭제 실패: ", e);
        }
    }
}

async function editPost(postId) {
    if (!isAdmin) {
        const password = prompt('작성 시 설정한 비밀번호를 입력하세요:');
        if (!password) return;

        const { getDoc } = await import("https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js");
        const docSnap = await getDoc(doc(db, "posts", postId));
        if (docSnap.exists() && docSnap.data().password !== password) {
            return alert('비밀번호가 일치하지 않습니다.');
        }
        
        const post = docSnap.data();
        document.getElementById('board-name').value = post.name;
        document.getElementById('board-email').value = post.email;
        document.getElementById('board-title').value = post.title;
        document.getElementById('board-content').value = post.content;
    }

    toggleBoardForm();
    document.getElementById('board-id').value = postId;
    document.getElementById('form-title').innerText = '게시글 수정하기';
    document.getElementById('submit-btn').innerText = '수정 완료';
    document.getElementById('board').scrollIntoView({ behavior: 'smooth' });
}

// 실시간 게시글 리스너
const urlParams = new URLSearchParams(window.location.search);
const passwordFromUrl = urlParams.get('admin');

// [중요] 관리자 비밀번호 설정 (원하시는 비밀번호로 여기서 바꾸세요)
const ADMIN_PASSWORD = "1234"; 

let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

if (passwordFromUrl === 'true' && !isAdmin) {
    const inputPassword = prompt('관리자 비밀번호를 입력하세요:');
    if (inputPassword === ADMIN_PASSWORD) {
        isAdmin = true;
        sessionStorage.setItem('isAdmin', 'true');
        alert('관리자 모드로 접속되었습니다.');
    } else {
        alert('비밀번호가 일치하지 않습니다.');
        window.location.href = window.location.pathname; // 주소창에서 admin=true 제거
    }
}

const boardQuery = query(postsCol, orderBy("timestamp", "desc"));
onSnapshot(boardQuery, (snapshot) => {
    const list = document.getElementById('post-list');
    if (!list) return;
    list.innerHTML = '';

    if (snapshot.empty) {
        list.style.display = 'block';
        list.innerHTML = '<div style="text-align: center; padding: 100px; color: var(--text-dim); background: var(--glass); border-radius: 40px; border: 1px dotted var(--glass-border);">등록된 게시글이 없습니다. 첫 번째 의견을 남겨보세요!</div>';
        return;
    }

    list.style.display = 'grid';
    snapshot.forEach((snapDoc) => {
        const post = snapDoc.data();
        const docId = snapDoc.id;
        const postCard = document.createElement('div');
        postCard.className = 'post-card scroll-reveal visible';
        postCard.style.background = 'var(--glass)';
        postCard.style.padding = '35px';
        postCard.style.borderRadius = '35px';
        postCard.style.border = '1px solid var(--glass-border)';
        postCard.style.display = 'flex';
        postCard.style.flexDirection = 'column';
        postCard.style.position = 'relative';

        // 1. 게시글 추천/수정/삭제 버튼
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        const isPostLiked = likedPosts.includes(docId);
        
        const postButtons = `
            <div style="display: flex; gap: 10px; align-items: center;">
                <button onclick="likePost('${docId}')" style="background: ${isPostLiked ? 'var(--orange)' : 'rgba(255, 92, 0, 0.1)'}; border: 1px solid var(--orange); color: ${isPostLiked ? 'white' : 'var(--orange)'}; padding: 8px 15px; border-radius: 12px; cursor: pointer; font-size: 0.85rem; font-weight: 800; display: flex; align-items: center; gap: 6px; transition: 0.3s;">
                    👍 ${post.likes || 0}
                </button>
                <button onclick="editPost('${docId}')" style="background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: var(--white); padding: 8px 15px; border-radius: 12px; cursor: pointer; font-size: 0.8rem;">수정</button>
                <button onclick="deletePost('${docId}')" style="background: rgba(255,0,61,0.1); border: 1px solid rgba(255,0,61,0.2); color: var(--red); padding: 8px 15px; border-radius: 12px; cursor: pointer; font-size: 0.8rem;">삭제</button>
            </div>
        `;

        // 2. 댓글 목록 렌더링
        const likedComments = JSON.parse(localStorage.getItem('liked_comments') || '[]');
        let commentsHtml = (post.comments || []).map((comment, idx) => {
            const isCommentLiked = likedComments.includes(`${docId}_${idx}`);
            return `
                <div style="margin-top: 15px; padding: 20px; background: rgba(255,255,255,0.02); border-radius: 18px; border: 1px solid var(--glass-border);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <div>
                            <span style="color: var(--orange); font-weight: 800; font-size: 0.85rem;">${comment.author}</span>
                            <span style="color: var(--text-dim); font-size: 0.75rem; margin-left: 10px;">${comment.date}</span>
                        </div>
                        <div style="display: flex; gap: 12px; align-items: center;">
                             <button onclick="likeComment('${docId}', ${idx})" style="background: none; border: none; color: ${isCommentLiked ? 'var(--orange)' : 'var(--text-dim)'}; cursor: pointer; font-size: 0.8rem; font-weight: ${isCommentLiked ? '800' : '400'};">👍 ${comment.likes || 0}</button>
                             <button onclick="deleteComment('${docId}', ${idx})" style="background: none; border: none; color: var(--red); cursor: pointer; font-size: 0.75rem; opacity: 0.6;">삭제</button>
                        </div>
                    </div>
                    <div style="color: var(--white); font-size: 0.9rem; line-height: 1.5;">${comment.content}</div>
                </div>
            `;
        }).join('');

        postCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 25px;">
                <div style="flex: 1;">
                    <h4 style="font-size: 1.4rem; color: var(--white); margin-bottom: 10px; letter-spacing: -0.8px; font-weight: 800;">${post.title}</h4>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <span style="font-size: 0.9rem; color: var(--orange); font-weight: 700;">${post.name}</span>
                        <div style="width: 3px; height: 3px; background: var(--glass-border); border-radius: 50%;"></div>
                        <span style="font-size: 0.8rem; color: var(--text-dim);">${dateStr}</span>
                    </div>
                </div>
                ${postButtons}
            </div>
            <p style="color: var(--text-dim); font-size: 1rem; line-height: 1.8; white-space: pre-wrap; margin-bottom: 30px; border-bottom: 1px solid var(--glass-border); padding-bottom: 30px;">${post.content}</p>
            
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h5 style="color: var(--white); font-size: 1rem; display: flex; align-items: center; gap: 8px;">
                         댓글 <span style="color: var(--orange); font-weight: 800;">${(post.comments || []).length}</span>
                    </h5>
                    <button onclick="toggleCommentForm('${docId}')" style="background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: var(--white); padding: 6px 12px; border-radius: 10px; cursor: pointer; font-size: 0.75rem;">댓글 쓰기</button>
                </div>
                <div id="comments-${docId}">${commentsHtml}</div>
            </div>

            <!-- 댓글 작성 폼 (기본 숨김) -->
            <div id="comment-form-${docId}" style="display: none; background: rgba(255,255,255,0.03); padding: 20px; border-radius: 20px; border: 1px solid var(--glass-border); margin-top: 15px; animation: slideDown 0.3s ease-out;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <input type="text" id="comment-name-${docId}" placeholder="이름" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 10px; color: white; font-size: 0.8rem; outline: none;">
                    <input type="password" id="comment-pw-${docId}" placeholder="비밀번호" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 10px; color: white; font-size: 0.8rem; outline: none;">
                </div>
                <div style="display: flex; gap: 10px;">
                    <textarea id="comment-content-${docId}" placeholder="댓글을 입력하세요..." style="flex: 1; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 10px; color: white; font-size: 0.85rem; outline: none; min-height: 44px; height: 44px; resize: none;"></textarea>
                    <button onclick="addComment('${docId}')" style="background: var(--orange); color: white; border: none; padding: 0 15px; border-radius: 10px; font-weight: 800; cursor: pointer; height: 44px;">등록</button>
                </div>
            </div>
        `;
        list.appendChild(postCard);
    });
});

function toggleCommentForm(postId) {
    const form = document.getElementById(`comment-form-${postId}`);
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        if (form.style.display === 'block') {
            form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// 추천 토글 기능 함수 추가
async function likePost(postId) {
    const { getDoc } = await import("https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js");
    const postRef = doc(db, "posts", postId);
    const snap = await getDoc(postRef);
    if (!snap.exists()) return;

    let likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
    let currentLikes = snap.data().likes || 0;
    
    if (likedPosts.includes(postId)) {
        // 이미 추천함 -> 추천 취소
        await updateDoc(postRef, { likes: Math.max(0, currentLikes - 1) });
        likedPosts = likedPosts.filter(id => id !== postId);
    } else {
        // 새로 추천
        await updateDoc(postRef, { likes: currentLikes + 1 });
        likedPosts.push(postId);
    }
    localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
}

async function addComment(postId) {
    const name = document.getElementById(`comment-name-${postId}`).value;
    const pw = document.getElementById(`comment-pw-${postId}`).value;
    const content = document.getElementById(`comment-content-${postId}`).value;

    if (!name || !pw || !content) return alert('모든 항목을 입력해 주세요.');

    const { getDoc } = await import("https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js");
    const postRef = doc(db, "posts", postId);
    const snap = await getDoc(postRef);
    
    if (snap.exists()) {
        const comments = snap.data().comments || [];
        comments.push({
            author: name,
            password: pw,
            content: content,
            likes: 0,
            date: new Date().toLocaleDateString('ko-KR') + " " + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        });
        await updateDoc(postRef, { comments });
        alert('댓글이 등록되었습니다.');
    }
}

async function likeComment(postId, commentIdx) {
    const { getDoc } = await import("https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js");
    const postRef = doc(db, "posts", postId);
    const snap = await getDoc(postRef);
    if (!snap.exists()) return;

    let likedComments = JSON.parse(localStorage.getItem('liked_comments') || '[]');
    const commentKey = `${postId}_${commentIdx}`;
    const comments = snap.data().comments;

    if (likedComments.includes(commentKey)) {
        // 추천 취소
        comments[commentIdx].likes = Math.max(0, (comments[commentIdx].likes || 0) - 1);
        likedComments = likedComments.filter(key => key !== commentKey);
    } else {
        // 새로 추천
        comments[commentIdx].likes = (comments[commentIdx].likes || 0) + 1;
        likedComments.push(commentKey);
    }
    
    await updateDoc(postRef, { comments });
    localStorage.setItem('liked_comments', JSON.stringify(likedComments));
}

async function deleteComment(postId, commentIdx) {
    const { getDoc } = await import("https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js");
    const postRef = doc(db, "posts", postId);
    const snap = await getDoc(postRef);
    
    if (snap.exists()) {
        const comments = snap.data().comments;
        
        // 관리자가 아니고 작성자 비번도 틀리면 불가
        if (!isAdmin) {
            const pw = prompt('댓글 작성 시 설정한 비밀번호를 입력하세요:');
            if (pw !== comments[commentIdx].password) return alert('비밀번호가 일치하지 않습니다.');
        }

        if (confirm('댓글을 삭제하시겠습니까?')) {
            comments.splice(commentIdx, 1);
            await updateDoc(postRef, { comments });
            alert('댓글이 삭제되었습니다.');
        }
    }
}

// 전역 공개 (HTML onclick용)
window.toggleBoardForm = toggleBoardForm;
window.handleBoardSubmit = handleBoardSubmit;
window.deletePost = deletePost;
window.editPost = editPost;
window.likePost = likePost;
window.addComment = addComment;
window.toggleCommentForm = toggleCommentForm;
window.likeComment = likeComment;
window.deleteComment = deleteComment;
window.toggleChat = toggleChat;
window.handleChat = handleChat;
window.toggleTheme = toggleTheme;
window.navigateTo = navigateTo;
window.closeModal = closeModal;


// --- Background Theme & Animation Logic 이하 생략 ---

// --- Theme Switcher Logic ---
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (theme === 'light') {
        // Sun icon
        icon.innerHTML = `<circle cx="12" cy="12" r="5"></circle>
                          <line x1="12" y1="1" x2="12" y2="3"></line>
                          <line x1="12" y1="21" x2="12" y2="23"></line>
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                          <line x1="1" y1="12" x2="3" y2="12"></line>
                          <line x1="21" y1="12" x2="23" y2="12"></line>
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    } else {
        // Moon icon
        icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }
}

// --- Background Video Rotation Logic ---
const bgVideos = [
    "https://cdn.pixabay.com/video/2021/09/11/88223-606079076_large.mp4", // 정밀 제조 로봇 팔
    "https://cdn.pixabay.com/video/2017/12/14/13370-247710847_large.mp4",  // 회로 기판 기술 라인
    "https://cdn.pixabay.com/video/2016/07/24/3985-176061609_medium.mp4"  // 반도체 OHT 이송
];
let currentVideoIndex = 0;
const videoEl = document.getElementById('bg-video');

function rotateBgVideo() {
    if (!videoEl) return;
    
    // 다음 영상 인덱스 계산
    currentVideoIndex = (currentVideoIndex + 1) % bgVideos.length;
    
    // 페이드 아웃 효과
    videoEl.classList.add('fade-out');
    
    setTimeout(() => {
        videoEl.src = bgVideos[currentVideoIndex];
        videoEl.load();
        
        // 재생 시도
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                videoEl.classList.remove('fade-out');
            }).catch(error => {
                console.error("비디오 재생 실패:", error);
                // 재생 실패 시 다음 영상으로 시도
                rotateBgVideo();
            });
        }
    }, 1500); // index.css의 transition 시간과 일치
}

if (videoEl) {
    videoEl.addEventListener('ended', rotateBgVideo);
}

// --- Welcome Modal Logic ---
function closeModal() {
    const modal = document.getElementById('welcome-modal');
    const dontShow = document.getElementById('dont-show-again').checked;
    
    if (dontShow) {
        const expiry = Date.now() + 10 * 60 * 1000; // 10분 후 만료
        localStorage.setItem('hideWelcomeUntil', expiry);
    }
    
    modal.classList.remove('visible');
    setTimeout(() => { modal.style.display = 'none'; }, 500);
}

function checkWelcomeModal() {
    const expiry = localStorage.getItem('hideWelcomeUntil');
    if (expiry && Date.now() < parseInt(expiry)) {
        return; // 아직 유효한 차단 시간임
    }
    
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => { modal.classList.add('visible'); }, 100);
    }
}

// --- SPA Navigation Logic ---
function navigateTo(sectionId) {
    // 모든 섹션 숨기기
    const sections = document.querySelectorAll('section');
    sections.forEach(s => s.classList.remove('active'));
    
    // 대상 섹션 보이기
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
        
        // 해당 섹션 내의 애니메이션 요소들 활성화
        const reveals = target.querySelectorAll('.scroll-reveal');
        reveals.forEach(r => r.classList.add('visible'));
    }
    
    // 네비게이션 활성 상태 업데이트
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// 브라우저 해시 변경 대응
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'hero';
    navigateTo(hash);
});

// Initial Load
window.addEventListener('load', () => {
    // Firebase onSnapshot이 게시글을 실시간으로 렌더링하므로 기존 호출은 삭제합니다.
    
    // 현재 해시값에 따라 섹션 표시 (기본값 hero)
    const initialHash = window.location.hash.substring(1) || 'hero';
    navigateTo(initialHash);
    
    checkWelcomeModal();
    
    // 모바일: autoplay 차단 여부 감지 (로드 직후 .play() 호출 금지 - 네이티브 플레이어 방지)
    checkAutoplayBlocked();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
});
