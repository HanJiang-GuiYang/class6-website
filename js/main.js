// ===== Supabase 配置 =====
const SUPABASE_URL = 'https://iusepieskhzhfagtygdp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qRTucAl_kmyRJFIgg3EiuA_SPK-xeMd';
let supabase;

// ===== 成员列表 =====
const members = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '小明', '小红', '小刚', '小丽', '小强', '小芳', '小伟', '小敏'];

// ===== 每日名言 =====
const quotes = [
    { text: '青春是一场大雨，即使感冒了，还盼望回头再淋它一次。', author: '九把刀' },
    { text: '青春是一本太仓促的书，我们含着泪，一读再读。', author: '席慕容' },
    { text: '星光不问赶路人，时光不负有心人。', author: '未知' },
    { text: '你若盛开，清风自来。', author: '未知' },
    { text: '越努力，越幸运。', author: '未知' },
    { text: '青春无悔，梦想无畏。', author: '未知' },
    { text: '生活不止眼前的苟且，还有诗和远方。', author: '高晓松' },
    { text: '愿你出走半生，归来仍是少年。', author: '未知' },
    { text: '每一个不曾起舞的日子，都是对生命的辜负。', author: '尼采' },
    { text: '追风赶月莫停留，平芜尽处是春山。', author: '未知' },
    { text: '乾坤未定，你我皆是黑马。', author: '未知' },
    { text: '将来的你，一定会感谢现在拼命的自己。', author: '未知' }
];

// ===== 倒计时名言 =====
const countdownMottos = [
    '"星光不问赶路人，时光不负有心人"',
    '"乾坤未定，你我皆是黑马"',
    '"追风赶月莫停留，平芜尽处是春山"',
    '"每一个不曾起舞的日子，都是对生命的辜负"',
    '"将来的你，一定会感谢现在拼命的自己"',
    '"青春无悔，梦想无畏"',
    '"越努力，越幸运"'
];

// ===== 用户系统 =====
let currentUser = null;
let isPlaying = false; // 修复：只声明一次

// 从 Supabase 验证用户
async function checkLoginStatus() {
    const saved = localStorage.getItem('class6_user');
    if (saved) {
        const userData = JSON.parse(saved);
        // 从数据库验证
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', userData.username)
            .single();
        
        if (data && !error) {
            currentUser = {
                username: data.username,
                role: data.role,
                name: data.name
            };
            updateUI();
            return;
        }
    }
    currentUser = null;
    updateUI();
}

function showLogin() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
    setTimeout(() => document.getElementById('loginUsername').focus(), 100);
}

function hideLogin() {
    document.getElementById('loginModal').classList.remove('active');
}

// 登录 - 从 Supabase 验证
async function doLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        document.getElementById('loginError').textContent = '请输入用户名和密码';
        document.getElementById('loginError').style.display = 'block';
        return;
    }

    // 从数据库查询用户
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

    if (data && !error) {
        currentUser = {
            username: data.username,
            role: data.role,
            name: data.name
        };
        localStorage.setItem('class6_user', JSON.stringify({ username }));
        hideLogin();
        updateUI();
    } else {
        document.getElementById('loginError').textContent = '用户名或密码错误，请重试';
        document.getElementById('loginError').style.display = 'block';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('class6_user');
    updateUI();
}

function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

function isUser() {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'user');
}

function updateUI() {
    const badge = document.getElementById('userBadge');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!currentUser) {
        badge.className = 'user-badge visitor';
        badge.innerHTML = '👤 游客';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    } else if (currentUser.role === 'admin') {
        badge.className = 'user-badge admin';
        badge.innerHTML = '👑 ' + currentUser.name;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    } else {
        badge.className = 'user-badge user';
        badge.innerHTML = '🎓 ' + currentUser.name;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    }

    // 管理员操作区
    const galleryAdmin = document.getElementById('galleryAdmin');
    const memberAdmin = document.getElementById('memberAdmin');
    if (galleryAdmin) {
        galleryAdmin.className = isAdmin() ? 'admin-only show' : 'admin-only';
    }
    if (memberAdmin) {
        memberAdmin.className = isAdmin() ? 'admin-only show' : 'admin-only';
    }

    // 重新渲染以更新删除按钮
    renderGallery();
    renderMembers();
}

// ===== 初始化粒子 =====
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const colors = ['rgba(37, 99, 235, 0.15)', 'rgba(6, 182, 212, 0.15)', 'rgba(245, 158, 11, 0.1)', 'rgba(236, 72, 153, 0.1)'];
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 15 + 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ===== 高考倒计时 =====
function updateCountdown() {
    // 2028届高考日期：2028年6月7日
    const targetDate = new Date('2028-06-07T09:00:00');
    const now = new Date();
    const diff = targetDate - now;
    
    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minutesEl = document.getElementById('countMinutes');
    const secondsEl = document.getElementById('countSeconds');
    const titleEl = document.querySelector('.countdown-title');
    
    // 添加空值检查
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        console.warn('倒计时元素未找到');
        return;
    }
    
    if (diff <= 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minutesEl.textContent = '0';
        secondsEl.textContent = '0';
        if (titleEl) {
            titleEl.textContent = '🎉 高考已开始，加油！';
        }
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    daysEl.textContent = days;
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
}

// ===== 每日名言 =====
function updateDailyQuote() {
    const today = new Date();
    const dayIndex = today.getDate() % quotes.length;
    const quote = quotes[dayIndex];
    
    const quoteEl = document.getElementById('dailyQuote');
    const authorEl = document.getElementById('quoteAuthor');
    const mottoEl = document.getElementById('countdownMotto');
    
    if (quoteEl) quoteEl.textContent = quote.text;
    if (authorEl) authorEl.textContent = '—— ' + quote.author;

    // 更新倒计时名言
    const mottoIndex = today.getDate() % countdownMottos.length;
    if (mottoEl) mottoEl.textContent = countdownMottos[mottoIndex];
}

// ===== 标签切换（修复版）=====
function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');
    
    if (!tabs.length || !sections.length) {
        console.warn('标签或内容区域未找到');
        return;
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有 active 状态
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // 设置当前 active
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            
            // 添加错误处理
            const targetSection = document.getElementById(`${tabId}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            } else {
                console.error(`未找到 ID 为 ${tabId}-section 的内容区域`);
            }
        });
    });
}

// ===== 留言板 (Supabase 云存储) =====
async function addMessage() {
    const message = document.getElementById('messageInput').value.trim();
    const author = document.getElementById('authorInput').value.trim() || '匿名同学';
    
    if (!message) {
        alert('请输入留言内容');
        return;
    }
    
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // 保存到 Supabase
    const { error } = await supabase
        .from('messages')
        .insert([{
            content: message,
            author: author,
            role: currentUser ? currentUser.role : 'visitor',
            is_pinned: false,
            created_at: now.toISOString()
        }]);
    
    if (error) {
        alert('留言失败：' + error.message);
        return;
    }
    
    document.getElementById('messageInput').value = '';
    loadMessages(); // 重新加载
}

async function loadMessages() {
    const messageList = document.getElementById('messageList');
    if (!messageList) return;
    
    messageList.innerHTML = '';
    
    // 从 Supabase 加载，置顶的在前
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('加载留言失败:', error);
        return;
    }
    
    if (!data || data.length === 0) {
        messageList.innerHTML = '<div style="text-align: center; color: var(--text-light); padding: 40px;">暂无留言，快来留下你的祝福吧！</div>';
        return;
    }
    
    data.forEach(msg => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.style.position = 'relative';
        
        const pinnedBadge = msg.is_pinned ? '<span style="position: absolute; top: 8px; right: 8px; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem;">置顶</span>' : '';
        
        const adminBtns = isAdmin() ? `
            <div style="position: absolute; bottom: 8px; right: 8px; display: flex; gap: 5px;">
                <button onclick="togglePin(${msg.id}, ${msg.is_pinned})" style="padding: 3px 8px; border: 1px solid var(--border); border-radius: 5px; background: white; cursor: pointer; font-size: 0.75rem;">
                    ${msg.is_pinned ? '取消置顶' : '置顶'}
                </button>
                <button onclick="deleteMessage(${msg.id})" style="padding: 3px 8px; border: 1px solid #fecaca; border-radius: 5px; background: #fee2e2; color: #dc2626; cursor: pointer; font-size: 0.75rem;">
                    删除
                </button>
            </div>
        ` : '';
        
        messageItem.innerHTML = `
            ${pinnedBadge}
            <div class="message-author">${escapeHtml(msg.author)} ${msg.role === 'admin' ? '<span style="color: #f59e0b;">👑</span>' : ''}</div>
            <div>${escapeHtml(msg.content)}</div>
            <div class="message-time">${new Date(msg.created_at).toLocaleString('zh-CN')}</div>
            ${adminBtns}
        `;
        messageList.appendChild(messageItem);
    });
}

// 管理员：置顶/取消置顶
async function togglePin(id, currentPinned) {
    const { error } = await supabase
        .from('messages')
        .update({ is_pinned: !currentPinned })
        .eq('id', id);
    
    if (error) {
        alert('操作失败：' + error.message);
        return;
    }
    loadMessages();
}

// 管理员：删除留言
async function deleteMessage(id) {
    if (!confirm('确定要删除这条留言吗？')) return;
    
    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
    
    if (error) {
        alert('删除失败：' + error.message);
        return;
    }
    loadMessages();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== 趣味工具 =====
function randomPick() {
    const result = members[Math.floor(Math.random() * members.length)];
    showModal('🎲 随机点名', result);
}

function randomGroup() {
    const shuffled = [...members].sort(() => Math.random() - 0.5);
    const groupSize = 4;
    const groups = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
        groups.push(shuffled.slice(i, i + groupSize));
    }
    
    let result = '';
    groups.forEach((group, index) => {
        result += `第${index + 1}组: ${group.join('、')}`;
        if (index < groups.length - 1) result += '\n\n';
    });
    
    showModal('👥 随机分组', result);
}

function luckyDraw() {
    const prizes = ['🎁 精美笔记本', '📚 课外读物', '🖊️ 限量版笔', '🎫 免作业券', '⭐ 班级之星', '🎉 神秘大奖'];
    const result = prizes[Math.floor(Math.random() * prizes.length)];
    showModal('🎁 幸运抽奖', result);
}

function showQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteEl = document.getElementById('dailyQuote');
    const authorEl = document.getElementById('quoteAuthor');
    const toolResult = document.getElementById('toolResult');
    
    if (quoteEl) quoteEl.textContent = quote.text;
    if (authorEl) authorEl.textContent = '—— ' + quote.author;
    if (toolResult) toolResult.textContent = '💡 ' + quote.text;
}

function showModal(title, result) {
    const modal = document.getElementById('resultModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalResult = document.getElementById('modalResult');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalResult) modalResult.textContent = result;
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('resultModal');
    if (modal) modal.classList.remove('active');
}

// ===== 音乐播放器 =====
function toggleMusic() {
    isPlaying = !isPlaying;
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.textContent = isPlaying ? '⏸️' : '▶️';
    }
    
    if (isPlaying) {
        simulateProgress();
    }
}

function simulateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
        if (!isPlaying || progress >= 100) {
            clearInterval(interval);
            if (progress >= 100) {
                isPlaying = false;
                const playBtn = document.getElementById('playBtn');
                if (playBtn) playBtn.textContent = '▶️';
            }
            return;
        }
        progress += 0.5;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) progressBar.style.width = progress + '%';
    }, 100);
}

// ===== 照片上传 (Supabase Storage) =====
async function handlePhotoUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    let successCount = 0;
    
    for (let file of files) {
        const fileName = `gallery/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('class6-photos')
            .upload(fileName, file);
        
        if (error) {
            console.error('上传失败:', error);
            continue;
        }
        
        const { data: urlData } = supabase.storage
            .from('class6-photos')
            .getPublicUrl(fileName);
        
        const { error: dbError } = await supabase
            .from('photos')
            .insert([{
                url: urlData.publicUrl,
                name: file.name,
                type: 'gallery',
                uploader: currentUser ? currentUser.username : 'anonymous'
            }]);
        
        if (!dbError) successCount++;
    }
    
    alert(`上传成功 ${successCount}/${files.length} 张照片`);
    event.target.value = '';
    renderGallery();
}

async function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('type', 'gallery')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('加载照片失败:', error);
        galleryGrid.innerHTML = '<div style="text-align: center; color: var(--text-light); padding: 40px;">加载失败，请刷新重试</div>';
        return;
    }
    
    if (!data || data.length === 0) {
        galleryGrid.innerHTML = `
            <div class="gallery-item">
                <div class="gallery-placeholder">🏫<span>班级合影</span></div>
            </div>
            <div class="gallery-item">
                <div class="gallery-placeholder">🎉<span>运动会</span></div>
            </div>
            <div class="gallery-item">
                <div class="gallery-placeholder">📚<span>学习时光</span></div>
            </div>
            <div class="gallery-item">
                <div class="gallery-placeholder">🎭<span>文艺汇演</span></div>
            </div>
            <div class="gallery-item">
                <div class="gallery-placeholder">🏕️<span>春游活动</span></div>
            </div>
            <div class="gallery-item">
                <div class="gallery-placeholder">🎓<span>毕业季</span></div>
            </div>
        `;
        return;
    }
    
    data.forEach(photo => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${photo.url}" alt="${photo.name}" loading="lazy">
            ${isAdmin() ? `<button class="gallery-delete" onclick="deletePhoto(${photo.id}, '${photo.url}')">×</button>` : ''}
            <div class="gallery-info">${photo.name}</div>
        `;
        galleryGrid.appendChild(galleryItem);
    });
}

async function deletePhoto(id, url) {
    if (!confirm('确定要删除这张照片吗？')) return;
    
    if (url) {
        const fileName = url.split('/').pop();
        await supabase.storage.from('class6-photos').remove([`gallery/${fileName}`]);
    }
    
    await supabase.from('photos').delete().eq('id', id);
    renderGallery();
}

// ===== 成员管理 =====
async function renderMembers() {
    const membersGrid = document.getElementById('membersGrid');
    if (!membersGrid) return;
    
    membersGrid.innerHTML = '';
    
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });
    
    if (error) {
        console.error('加载成员失败:', error);
        return;
    }
    
    if (!data || data.length === 0) {
        membersGrid.innerHTML = `
            <div class="member-card">
                <div class="member-avatar">👨‍🏫</div>
                <div class="member-name">班主任</div>
                <div class="member-role">班主任</div>
            </div>
            <div class="member-card">
                <div class="member-avatar">👨‍🎓</div>
                <div class="member-name">班长</div>
                <div class="member-role">班长</div>
            </div>
            <div class="member-card">
                <div class="member-avatar">👩‍🎓</div>
                <div class="member-name">学习委员</div>
                <div class="member-role">学习委员</div>
            </div>
            <div class="member-card">
                <div class="member-avatar">👨‍🎓</div>
                <div class="member-name">体育委员</div>
                <div class="member-role">体育委员</div>
            </div>
            <div class="member-card">
                <div class="member-avatar">👩‍🎓</div>
                <div class="member-name">文艺委员</div>
                <div class="member-role">文艺委员</div>
            </div>
            <div class="member-card">
                <div class="member-avatar">👩‍🎓</div>
                <div class="member-name">生活委员</div>
                <div class="member-role">生活委员</div>
            </div>
        `;
        return;
    }
    
    data.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        memberCard.innerHTML = `
            <img src="${member.photo_url}" alt="${member.name}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; margin: 0 auto 12px; display: block;">
            <div class="member-name">${escapeHtml(member.name)}</div>
            <div class="member-role">${escapeHtml(member.role)}</div>
            ${isAdmin() ? `<button class="member-delete" onclick="deleteMember(${member.id}, '${member.photo_url}')">×</button>` : ''}
        `;
        membersGrid.appendChild(memberCard);
    });
}

async function deleteMember(id, photoUrl) {
    if (!confirm('确定要删除这位成员吗？')) return;
    
    if (photoUrl) {
        const fileName = photoUrl.split('/').pop();
        await supabase.storage.from('class6-photos').remove([`members/${fileName}`]);
    }
    
    await supabase.from('members').delete().eq('id', id);
    renderMembers();
}

async function handleMemberPhotoUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    for (let file of files) {
        const fileName = `members/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('class6-photos')
            .upload(fileName, file);
        
        if (error) {
            console.error('上传失败:', error);
            continue;
        }
        
        const { data: urlData } = supabase.storage
            .from('class6-photos')
            .getPublicUrl(fileName);
        
        const name = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        
        await supabase.from('members').insert([{
            name: name,
            role: '同学',
            photo_url: urlData.publicUrl,
            uploader: currentUser ? currentUser.username : 'anonymous'
        }]);
    }
    
    alert('上传完成');
    event.target.value = '';
    renderMembers();
}

async function loadPhotosFromFolder() {
    const { data, error } = await supabase.storage
        .from('class6-photos')
        .list('gallery');
    
    if (error) {
        alert('加载失败：' + error.message);
        return;
    }
    
    if (!data || data.length === 0) {
        alert('文件夹中没有照片');
        return;
    }
    
    alert(`找到 ${data.length} 张照片，正在加载...`);
    renderGallery();
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Supabase 客户端
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
        console.error('Supabase SDK 未加载');
    }
    
    initParticles();
    updateCountdown();
    updateDailyQuote();
    initTabs();
    loadMessages();
    checkLoginStatus();
    renderGallery();
    renderMembers();
    
    // 每秒更新倒计时
    setInterval(updateCountdown, 1000);
});