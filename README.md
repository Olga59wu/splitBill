# 分帳小幫手 (SplitBill Web App)

「分帳小幫手」為一款基於 Serverless 架構之單頁式 Web 應用程式 (SPA)。專為解決跨國差旅與多人聚餐之複雜分攤邏輯所設計。系統整合 Firebase 前後端分離技術，提供即時資料同步與精確的金融級結算能力。

## 一、 核心功能架構

### 1. 多幣別與即時匯率引擎
系統預設以台幣 (TWD) 進行基礎結算，並串接線上匯率 API 以即時取得各國貨幣匯率。
*   自動換算：支援輸入 JPY、USD、THB 等外幣，系統將依據當前匯率自動轉換為 TWD。
*   手動配置與鎖定：使用者可針對特定帳目鎖定當時的歷史匯率，防範日後結算時因匯率浮動產生金額誤差。使用者亦可強制手動更新全局匯率至最新。

### 2. 進階分攤演算法
跳脫市面上同類工具僅能強制均分之限制，提供三種高精度殘額分攤模式：
*   全體均攤：系統自動計算涉入人數並無縫平分。
*   按份數分配：可針對特定成員調整負擔權重。
*   指定金額扣除：輸入特定成員的固定額度後，系統將自動扣除該額度，接著將剩餘殘額由其他成員自動均分吸收。

### 3. 多重身分驗證與雲端通訊錄
系統採用 Firebase Identity Platform 與精細化之 Firestore Security Rules 建立資料防護層：
*   身分認證：強制透過 Google 帳號授權登入，建立可追溯之使用者唯一識別碼 (UID)。
*   屬地權限控制：每筆活動明細嚴格綁定 `ownerUid` 與 `collaboratorUids` 陣列。確保活動列表查詢 (List) 與更新 (Update) 權限僅授予實際參與之協作者，有效阻擋惡意資料庫探索。
*   個人通訊錄隔離：獨立設置 `/users/{userId}` 集合，確保使用者之經常聯絡人名單為絕對私有狀態，禁止跨帳號讀寫。
*   後台白名單：針對最高管理權限獨立設置 `/whitelist` 集合，防止未授權之底層變更行為。

### 4. 訪客檢視與身分核發
系統利用安全分享機制，將資料存取控制精細化：
*   唯讀預覽模式：未完成身分映射之參與者，透過分享連結存取時僅具備唯讀權限，防止意料之外的寫入。
*   自主認領：訪客於頂部橫幅點擊認領對應名義後，系統方將其 UID 寫入協作者名單並提升為編輯權限，同時將單據歸檔至個人總覽中。

### 5. 變更軌跡與即時同步
整合 Firestore 底層之 `onSnapshot` 訂閱技術：
*   多端並行處理：支援多名成員同時編輯單一活動，介面將毫秒級無縫刷新。
*   防呆稽核 (Audit Logs)：系統將詳細記錄所有金額調整與人員異動歷程，精準還原任一時間節點之變更動作。

### 6. 圖表分析與憑證生成
*   資料視覺化：整合 Chart.js 動態渲染環狀圖，解析群體開支分佈結構。
*   結算憑證輸出：透過 html2canvas 將最終結算路徑封裝為附帶防偽網點之高畫質 PNG 圖檔，並支援透過 Clipboard API 單擊複製至剪貼簿。

### 7. 漸進式網頁應用 (PWA)
配置標準化之 `manifest.json` 與 Service Worker (`sw.js`)，支援安裝至 iOS 與 Android 桌面層作為原生應用程式，預留進一步的離線體驗升級空間。

## 二、 技術堆疊

1.  前端框架：Vue.js 3 (CDN 掛載，捨棄複雜編譯器與依賴地獄)。
2.  介面樣式：Tailwind CSS (CDN 工具庫)。
3.  字體渲染：Google Fonts - Inter 字首庫。
4.  第三方套件：Chart.js (資料繪圖)、html2canvas (DOM 影像擷取)。
5.  雲端架構：Google Firebase (Authentication, Cloud Firestore, Hosting)。

## 三、 專案目錄結構

```text
/splitBill
├── index.html           # 應用程式入口點與 Google 登入閘道
├── split_bill.html      # 核心編輯引擎與帳務狀態機
├── history.html         # 歷史存檔總覽與權限管理器
├── firebase-config.js   # Firebase 連線組態配置
├── sw.js                # Service Worker 快取腳本
├── manifest.json        # PWA 應用程式清單定義
└── icon-192x192.png     # PWA 系統圖示資源
```

## 四、 部署與環境建置指南

### 1. Firebase 基礎設定
1. 前往 Firebase Console 申請新專案。
2. 啟用 Authentication (限制為 Google 提供者) 與 Cloud Firestore 組件。
3. 取得專案層級之 Web API Key 等連線參數，並替換至 `firebase-config.js`。

### 2. 環境安裝與部署
本專案建議使用 Node.js 工具鏈管理器 [Volta](https://volta.sh/) 鎖定環境，執行正式部署指令：
```bash
volta install firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting
```

### 3. Firestore 安全性規則
為配合唯讀模式防護與降低越權存取風險，請務必掛載以下存取政策：
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. 雲端通訊錄隔離 (Smart Contacts)
    // 限制：唯一授權擁有者讀寫同名 UID 節點目錄
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 2. 後台白名單機制 (Whitelist)
    match /whitelist/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.token.email == 'olga59.wu@gmail.com' || 
        request.auth.token.email == 'chipang59@gmail.com'
      );
    }
    
    // 3. 核心活動資料層 (Events)
    match /events/{eventId} {
      // 建立：允許所有已登入之授權帳戶建立新活動
      allow create: if request.auth != null;
      
      // 唯讀檢視：允許已登入之使用者透過已知 URL 取得單筆資料
      allow get: if request.auth != null;
      
      // 列表查詢：強制排除非涉入活動，僅返回包含本身 UID 之活動集合
      allow list: if request.auth != null 
                  && request.auth.uid in resource.data.collaboratorUids;
                  
      // 狀態更新與編輯權限：
      // 情境 A：本身已為協作者，開放全節點變更權限。
      // 情境 B：訪客身分初次認領，僅開放變更人員清單欄位。
      allow update: if request.auth != null && (
        (request.auth.uid in resource.data.collaboratorUids) 
        || 
        (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['collaboratorUids', 'persons']))
      );
      
      // 徹底刪除：僅限原始建立者 (Owner) 執行
      allow delete: if request.auth != null 
                    && request.auth.uid == resource.data.ownerUid;
    }
  }
}
```

### 4. 網域安全規範 (HTTPS)
本系統深度依賴 `navigator.clipboard` 剪貼簿 API 與 Service Worker 註冊機制，必須部署於 HTTPS 網域下才能順利存取各項瀏覽器硬體級權限。建議直接使用 Firebase Hosting 。

## 五、 架構風險與系統限制

### 1. 客戶端運算過載風險 (Client-side Calculation)
*   問題：結算引擎與殘額分配邏輯完全置於前端 (Vue.js) 執行。
*   原因：基於 SPA 無伺服器開發之便利性考量，避免建構複雜之後端 API。
*   風險：當未來單據數量擴張，大量交叉結算將導致低階行動裝置產生渲染卡頓 (Lag) 甚至記憶體溢出。
*   解法：中期計畫應將核心之最佳結算路徑演算法封裝為 Firebase Cloud Functions 函式，由雲端伺服器運算後再拋回結果予客戶端渲染。

### 2. 即時連線剛性依賴 (Connection Dependency)
*   問題：所有編輯行為皆依賴 `onSnapshot` 機制，缺乏本地狀態保存。
*   原因：確保多方操作時產生資料競態 (Race condition) 能第一時間同步。
*   風險：在無網路或高延遲環境（例如跨國班機或收訊不良區域）將導致操作卡死且無法儲存。
*   解法：應升級至完整 Offline First 架構。導入 IndexedDB 建立變更佇列，在離線時優先寫入本地端快取，並於重新連線後執行自動推送 (Sync)。
