const fs = require('fs');
const path = require('path');

const files = ['split_bill.html', 'history.html', 'index.html'];

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');

    // Define rules for replacing specific informal expressions
    const replacements = [
        { regex: /\/\/ 🌟 這裡加入：自動從舊資料中「學習」聯絡人 UID 🌟/g, replacement: '// 更新：解析歷史紀錄並自動建檔聯絡人 UID' },
        { regex: /\/\/ 🌟 成功後，把今天的匯率存進手機快取裡/g, replacement: '// 匯率拉取成功，將資料寫入本地快取 (LocalStorage)' },
        { regex: /\/\/ 🌟 這裡加上 uid，房主建立時就直接綁定，不會再出現在認領名單中/g, replacement: '// 綁定建立者 UID，防止發起人列入預覽認領清單' },
        { regex: /\/\/ 🌟 從雲端通訊錄抓取 UID \(如果有的話\)/g, replacement: '// 自雲端通訊錄讀取對應之 UID (若存在)' },
        { regex: /\/\/ 🌟【無縫連動】：收集這次名單中「已知好友」的 UID，直接放行！/g, replacement: '// 無縫連動：收集名單中已驗證協作者之 UID 並預先授權' },
        { regex: /\/\/ 2\. 🌟 關鍵優化：直接將狀態切換為「已建立 \(編輯模式\)」，不要清空畫面/g, replacement: '// 效能最佳化：直接將狀態切換為編輯模式，保留當前渲染狀態' },
        { regex: /\/\/ 💡 邏輯簡化：如果兩邊都被清空，就代表顯示「全部」/g, replacement: '// 邏輯精簡：當所有篩選條件均為止，預設顯示全域清單' },
        { regex: /\/\/ IF ALL FAILS -> MODAL!/g, replacement: '// 防護機制：例外狀況發生時，強制彈出例外捕捉視窗 (Modal)' }
    ];

    replacements.forEach(rule => {
        content = content.replace(rule.regex, rule.replacement);
    });

    // General cleanup for other emojis or colloquialisms in comments
    content = content.replace(/\/\/(.*)/g, (match, p1) => {
        let cleaned = p1
            .replace(/🌟/g, '')
            .replace(/👉/g, '')
            .replace(/📍/g, '')
            .replace(/🔒/g, '')
            .replace(/✨/g, '')
            .replace(/⚠️/g, '警告：')
            .replace(/💡/g, '')
            .replace(/偷偷把/g, '於背景將')
            .replace(/偷偷/g, '於背景')
            .replace(/其實/g, '')
            .replace(/基本上/g, '')
            .replace(/打 API/g, '請求 API')
            .replace(/防呆/g, '防護防呆');
        return '//' + cleaned;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Processed', file);
}
