let API_URL = '';

document.addEventListener('DOMContentLoaded', () => {
    const ngrokInput = document.getElementById('ngrok-url');
    const connectBtn = document.getElementById('connect-btn');
    const statusDot = document.getElementById('status-dot');
    const statusPing = document.getElementById('status-ping');
    const statusText = document.getElementById('status-text');
    
    const recommendBtn = document.getElementById('recommend-btn');
    const userInput = document.getElementById('user-input');
    const algoSelect = document.getElementById('algo-select');
    const resultsGrid = document.getElementById('results-grid');

    // Kết nối ngrok API
    connectBtn.addEventListener('click', async () => {
        let url = ngrokInput.value.trim().replace(/\/$/, '');
        if (!url) {
            alert("Vui lòng nhập đường dẫn ngrok!");
            ngrokInput.focus();
            return;
        }
        
        connectBtn.textContent = 'Đang kết nối...';
        connectBtn.disabled = true;

        try {
            const res = await fetch(`${url}/api/health`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await res.json();
            
            if (data.status === 'ok') {
                API_URL = url;
                
                // Đổi UI sang thành công
                statusDot.classList.replace('bg-clay', 'bg-sage');
                statusPing.classList.replace('bg-clay', 'bg-sage');
                statusText.textContent = 'Đã kết nối luồng dữ liệu thành công.';
                statusText.classList.add('text-sage');
                
                connectBtn.textContent = 'Đã Kết Nối';
                connectBtn.classList.replace('bg-sage', 'bg-sage-hover');
                
                // Kích hoạt nút chạy
                recommendBtn.disabled = false;
            } else {
                throw new Error("Không đúng format API");
            }
        } catch (e) {
            console.error(e);
            connectBtn.textContent = 'Thất bại - Thử lại';
            connectBtn.classList.add('bg-clay');
            setTimeout(() => {
                connectBtn.textContent = 'Kết nối ngay';
                connectBtn.disabled = false;
                connectBtn.classList.remove('bg-clay');
            }, 3000);
        }
    });

    // Lấy gợi ý
    recommendBtn.addEventListener('click', async () => {
        if (!API_URL) return;

        const userId = parseInt(userInput.value) || 1;
        const algorithm = algoSelect.value;
        const topN = 10; // Giữ cố định top 10 cho nhẹ nhàng

        recommendBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-lg">sync</span> Đang tính toán...';
        recommendBtn.disabled = true;
        
        resultsGrid.innerHTML = `
            <div class="col-span-full h-full flex flex-col items-center justify-center text-ink-light py-10">
                <span class="material-symbols-outlined animate-spin text-3xl mb-3 text-sage">progress_activity</span>
                <p class="text-sm">Đang tải biểu đồ và gợi ý...</p>
            </div>
        `;

        try {
            const res = await fetch(`${API_URL}/api/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ user_id: userId, algorithm: algorithm, top_n: topN })
            });

            const data = await res.json();
            
            if (data.recommendations && data.recommendations.length > 0) {
                resultsGrid.innerHTML = data.recommendations.map((m, i) => {
                    const score = m.score ? parseFloat(m.score).toFixed(2) : "?";
                    return `
                    <div class="bg-white p-4 rounded-xl border border-sand hover:border-sage hover:shadow-md transition-all text-left flex flex-col gap-3 shadow-sm">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-paper-dark flex items-center justify-center text-xs font-bold text-sage border border-sand shrink-0">
                                #${i + 1}
                            </div>
                            <h5 class="text-ink font-semibold text-sm leading-snug flex-1" title="${m.title}">${m.title}</h5>
                        </div>
                        <div class="flex justify-between items-center bg-paper-dark/50 px-3 py-2 rounded-lg border border-sand/50">
                            <span class="text-xs font-medium text-ink-light">Điểm dự đoán AI:</span>
                            <span class="text-sm font-bold text-sage bg-sage/10 px-2 py-0.5 rounded flex items-center gap-1">
                                <span class="material-symbols-outlined text-[14px]">psychology</span>
                                ${score}
                            </span>
                        </div>
                    </div>
                `}).join('');
            } else {
                resultsGrid.innerHTML = `
                    <div class="col-span-full h-full flex flex-col items-center justify-center text-clay py-10 text-center">
                        <span class="material-symbols-outlined text-4xl mb-2 opacity-80">error_outline</span>
                        <p class="text-sm">Không tìm thấy thông tin hoặc<br>người dùng chưa đủ dữ kiện.</p>
                    </div>
                `;
            }
        } catch (e) {
            console.error(e);
            resultsGrid.innerHTML = `
                <div class="col-span-full h-full flex flex-col items-center justify-center text-clay py-10 text-center bg-clay/5 rounded-lg border border-clay/20">
                    <span class="material-symbols-outlined text-4xl mb-2">cloud_off</span>
                    <p class="text-sm font-medium">Bị đứt kết nối mạng!</p>
                    <p class="text-xs mt-1">Hãy kiểm tra ngrok hoặc thử mở lại Colab.</p>
                </div>
            `;
        } finally {
            recommendBtn.innerHTML = '<span class="material-symbols-outlined text-lg">search</span> Phân Tích & Gợi Ý';
            recommendBtn.disabled = false;
        }
    });

    // Enter submit
    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && !recommendBtn.disabled) {
            event.preventDefault();
            recommendBtn.click();
        }
    });
});
