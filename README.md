# 分帳小幫手 (SplitBill Web App)

「分帳小幫手」是一款採用先進雲端無伺服器架構 (Serverless) 所打造的輕量化、專業級 Web 應用。它專為了解決海外旅遊、朋友聚餐時複雜的代墊與分攤問題所設計。透過強大的「極簡演算法引擎」與 Firebase 即時資料庫，讓結算變得前所未有的簡單與透明。

---

## 🔗 在線預覽 (Live Demo)

👉 **線上訪問**：[https://splitbill-75975.web.app](https://splitbill-75975.web.app)

---

## 🌟 核心特色 (Core Features)

1. **多重幣別與即時換算 (Multi-Currency)**
   支援以台幣 (TWD) 作為基礎結算單位。使用者可自定義各國外幣匯率（如 JPY、USD、THB 等），並在輸入花費時自動疊加換算，省去切換計算機的繁瑣。

2. **精算級殘額切割系統 (Fractional Splits)**
   打破傳統分帳工具只能「強制均勻平分」的痛點。系統搭載自動殘額切割邏輯：您可針對單一明細中特定幾個人指派固定的負擔金額，系統會自動扣除該額度後，再將剩餘的零頭無縫均分給其他同行夥伴。

3. **視覺化與分析圖表 (Data Visualization)**
   整合 Chart.js 動態渲染組件。系統不僅提供清晰的流水帳目錄，更能一鍵切換為高質感的環狀圖 (Doughnut Chart)，讓活動開支分佈一目了然。

4. **金融級結算收據生成 (Receipt Generation)**
   搭載 html2canvas 繪製引擎。結算路徑計算完畢後，用戶能一鍵將枯燥的數字轉化為帶有專屬防偽網點、暗黑玻璃質感的極致 `.png` 圖片，並支援一鍵複製到手機系統剪貼簿，直接在 LINE 貼上即可傳給朋友。

5. **即時連動與變更軌跡 (Real-time Sync & Audit Logs)**
   搭載 Firestore 的 `onSnapshot` 即時訂閱機制，支援多人同時編輯同一單據。當同行夥伴新增花費或點擊結清時，所有人的畫面（包含跨域歷史總帳）皆會自動觸發閃爍特效並無縫同步。系統更內建「📍 變更軌跡」抽屜，精準還原每一筆款項的異動歷程，徹底消弭人為記憶死角。

6. **封閉式白名單門禁 (Private Whitelist System)**
   系統採用嚴密的封閉測試授權機制。所有嘗試存取的 Google 帳號皆必須經過 `whitelist` 資料庫比對。未獲授權的人員無論是從首頁登入，或點選分享連結，皆會遭到全域防線自動登出阻斷。系統並內建專屬最高管理員的「🛡️ 白名單後台」，可隨時授權或踢除協作者，建立真正的私領域商務環境。

7. **訪客預覽與身分認領 (Guest View & Identity Claim)**
   當白名單內的夥伴透過分享連結初次查閱帳單時，系統將預設為「🔒 唯讀預覽模式」。訪客能在頂部橫幅安全地查閱整個消費，直到其自主於選單中點擊認領「這是我！」的對應花費名義後，才會正式核發協作編輯權，並將單據歸檔至他的帳務總覽裡，確保未經確認的活動不會污染個人的歷史總帳。

8. **漸進式網頁應用 (PWA Support)**
   本專案提供符合標準的 `manifest.json` 與 Service Worker (`sw.js`)，支援無縫安裝至 iOS/Android 桌面成為原生應用程式 (APP)，並具備離線快取基本框架。

---

## 🛠️ 技術棧 (Tech Stack)

*   **前端框架**：Vue.js 3 (CDN 版本，實現無編譯的極簡掛載)
*   **介面樣式**：Tailwind CSS (CDN 工具庫)
*   **字體引擎**：Google Fonts - Inter
*   **視窗組件**：客製化 Toast、Modal，取代傳統瀏覽器阻斷式彈窗
*   **第三方套件**：Chart.js (繪圖引擎)、html2canvas (圖片擷取)
*   **後端與資料庫**：Google Firebase (Authentication, Cloud Firestore)

---

## 📂 專案架構 (Project Structure)

```text
/splitBill
├── index.html           # 應用程式入口點、Google 登入閘道與邀請碼解析
├── split_bill.html      # 核心活動編輯器、運算引擎與圖表/收據模組
├── history.html         # 歷史存檔總覽、封存系統與協同權限管理
├── app.js               # (如需抽離通用邏輯用)
├── firebase-config.js   # Firebase 核心配置與初始化檔案
├── sw.js                # Service Worker 腳本 (供 PWA 使用)
├── manifest.json        # PWA 應用程式清單定義
└── icon-192x192.png     # PWA 使用之系統圖示
```

---

## 🚀 部署與設定指引 (Setup Guide)

1. **設定 Firebase 環境**
   如果您要自行部署，請進到 Firebase Console 取得隸屬於您的 Web API Key 與參數，並於 `firebase-config.js` 中進行替換。

2. **安裝 Firebase CLI 與部署（使用 Volta）**
   本專案建議使用工具鏈管理器 [Volta](https://volta.sh/) 鎖定環境版本並執行部署：
   ```bash
   # 1. 透過 Volta 全域安裝 firebase-tools
   volta install firebase-tools

   # 2. 登入 Firebase 帳號
   firebase login

   # 3. 初始化並指定 public directory 為當前目錄
   firebase init hosting

   # 4. 部署至 Firebase Hosting
   firebase deploy --only hosting
   ```
   *註：若未使用 Volta，亦可直接以 `npx firebase deploy --only hosting` 進行免安裝部署。*

3. **Firestore 安全規則 (Security Rules)**
   為了配合最新的「唯讀模式」與建立者防護，請確保部署的 Firebase Firestore 已掛載以下規則以防止強制寫入：
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       
       function isWhitelisted() {
         return request.auth.token.email in ['olga59.wu@gmail.com', 'chipang59@gmail.com'] || exists(/databases/$(database)/documents/whitelist/$(request.auth.token.email));
       }
       
       function isAdmin() {
         return request.auth.token.email in ['olga59.wu@gmail.com', 'chipang59@gmail.com'];
       }

       match /whitelist/{email} {
         // 白名單區塊：白名單內的人都能看見清單，但只有最高管理員能修改
         allow read: if isWhitelisted();
         allow write: if isAdmin();
       }

       match /events/{document=**} {
         // 單據區塊：所有存取都必須通過白名單驗證
         allow read: if request.auth != null && isWhitelisted(); 
         allow write: if request.auth != null && isWhitelisted() && (
            resource.data.ownerUid == request.auth.uid || 
            request.auth.uid in request.resource.data.collaboratorUids
         );
       }
     }
   }
   ```

4. **啟用 Google 登入 (Authentication)**
   專案倚賴使用者的唯一身分識別 (UID)。請務必在 Firebase 的 Authentication (登入方式) 區塊內，開通 **Google 提供者 (Google Provider)** 授權。

5. **HTTPS 部署硬性建議**
   由於涉及 `navigator.clipboard` 剪貼簿 API、PWA 的 Service Worker 註冊，以及 Firebase 認證安全鎖定，本專案**強烈建議**掛載於 HTTPS 網域下（推薦直接使用 Firebase Hosting 免費輕量部署）。
