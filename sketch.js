// 宣告全域變數，分別存放待機（stop）、行走（walk）與施法（magic）的精靈圖集與裁切影格陣列
let stopSheet, walkSheet, magicSheet;
let stopFrames = [];
let walkFrames = [];
let magicFrames = [];

// 設定待機精靈圖集（stop.png）的原始規格參數
const STOP_TOTAL_FRAMES = 18;   // 總影格數量為 18 張
const STOP_SHEET_WIDTH = 1597;  // 整張待機精靈圖集的總寬度
const STOP_SHEET_HEIGHT = 191;  // 整張待機精靈圖集的高度
const STOP_FRAME_WIDTH = STOP_SHEET_WIDTH / STOP_TOTAL_FRAMES; // 單一影格寬度
const STOP_FRAME_HEIGHT = STOP_SHEET_HEIGHT;                   // 單一影格高度

// 設定行走精靈圖集（walk.png）的原始規格參數
const WALK_TOTAL_FRAMES = 8;    // 總影格數量為 8 張
const WALK_SHEET_WIDTH = 1019;  // 整張行走精靈圖集的總寬度
const WALK_SHEET_HEIGHT = 195;  // 整張行走精靈圖集的高度
const WALK_FRAME_WIDTH = WALK_SHEET_WIDTH / WALK_TOTAL_FRAMES; // 單一影格寬度
const WALK_FRAME_HEIGHT = WALK_SHEET_HEIGHT;                   // 單一影格高度

// 設定施法精靈圖集（magic.png）的原始規格參數
const MAGIC_TOTAL_FRAMES = 18;  // 總影格數量為 18 張
const MAGIC_SHEET_WIDTH = 4477; // 整張施法精靈圖集的總寬度
const MAGIC_SHEET_HEIGHT = 214; // 整張施法精靈圖集的高度
const MAGIC_FRAME_WIDTH = MAGIC_SHEET_WIDTH / MAGIC_TOTAL_FRAMES; // 單一影格寬度
const MAGIC_FRAME_HEIGHT = MAGIC_SHEET_HEIGHT;                    // 單一影格高度

// 宣告角色狀態與動畫控制變數
let isWalking = false;    // 記錄角色目前是否處於行走狀態（false 為待機，true 為行走）
let isMagicking = false;  // 記錄角色目前是否正在執行施法動作（播放完一次後自動結束）
let facingRight = true;   // 記錄角色面向的方向（true 為朝右，false 為朝左）
let currentFrame = 0;     // 當前播放的影格索引
let charX;                // 角色中心的 X 座標位置
let moveSpeed = 12;       // 角色每次畫面更新時的水平移動速度

// preload 函式會在 setup 之前執行，確保所有外部圖片資源完全載入後才啟動程式
function preload() {
  // 載入待機圖片精靈檔案
  stopSheet = loadImage('1/stop/stop.png');
  // 載入行走圖片精靈檔案
  walkSheet = loadImage('1/walk/walk.png');
  // 載入施法圖片精靈檔案
  magicSheet = loadImage('1/magic/magic.png');
}

// setup 函式在程式啟動時執行一次，用來初始化畫布與裁切所有影格
function setup() {
  // 建立一個與瀏覽器視窗等寬、等高的全螢幕畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化角色在畫布水平中央的位置
  charX = width / 2;

  // 透過迴圈將待機精靈圖集依序裁切成 18 個獨立的影格圖片
  for (let i = 0; i < STOP_TOTAL_FRAMES; i++) {
    let x = i * STOP_FRAME_WIDTH;
    let frame = stopSheet.get(x, 0, STOP_FRAME_WIDTH, STOP_FRAME_HEIGHT);
    stopFrames.push(frame);
  }

  // 透過迴圈將行走精靈圖集依序裁切成 8 個獨立的影格圖片
  for (let i = 0; i < WALK_TOTAL_FRAMES; i++) {
    let x = i * WALK_FRAME_WIDTH;
    let frame = walkSheet.get(x, 0, WALK_FRAME_WIDTH, WALK_FRAME_HEIGHT);
    walkFrames.push(frame);
  }

  // 透過迴圈將施法精靈圖集依序裁切成 18 個獨立的影格圖片
  for (let i = 0; i < MAGIC_TOTAL_FRAMES; i++) {
    let x = i * MAGIC_FRAME_WIDTH;
    let frame = magicSheet.get(x, 0, MAGIC_FRAME_WIDTH, MAGIC_FRAME_HEIGHT);
    magicFrames.push(frame);
  }

  // 設定動畫播放的幀率（每秒 12 格）
  frameRate(12);
}

// keyPressed 函式會在鍵盤按鍵「被按下的瞬間」觸發一次
function keyPressed() {
  // 偵測是否按下空白鍵（key === ' ' 或 keyCode === 32），且目前尚未處於施法狀態
  if ((key === ' ' || keyCode === 32) && !isMagicking) {
    isMagicking = true;   // 啟動施法狀態
    isWalking = false;    // 暫停行走狀態
    currentFrame = 0;     // 將影格索引歸零，確保從施法動畫第 1 張開始播放
  }
}

// draw 函式會不斷重複執行，負責處理狀態切換、位置更新與畫面繪製
function draw() {
  // 設定畫布背景顏色為天空藍色 (RGB 數值：紅 135, 綠 206, 藍 235)
  background(135, 206, 235);

  // 只有在「非施法狀態」下，才允許透過左右方向鍵移動與切換行走/待機狀態
  if (!isMagicking) {
    if (keyIsDown(RIGHT_ARROW)) {
      if (!isWalking) {
        isWalking = true;
        currentFrame = 0;
      }
      facingRight = true;   // 設定角色面向右邊
      charX += moveSpeed;   // 角色 X 座標往右移動
    } else if (keyIsDown(LEFT_ARROW)) {
      if (!isWalking) {
        isWalking = true;
        currentFrame = 0;
      }
      facingRight = false;  // 設定角色面向左邊（需進行水平翻轉）
      charX -= moveSpeed;   // 角色 X 座標往左移動
    } else {
      // 當使用者沒有按下左右鍵時，回復到待機狀態
      if (isWalking) {
        isWalking = false;
        currentFrame = 0;
      }
    }
  }

  // 根據目前狀態（優先順序：施法 > 行走 > 待機），決定要使用的影格陣列與尺寸規格
  let activeFrames, totalFrames, frameW, frameH;

  if (isMagicking) {
    activeFrames = magicFrames;
    totalFrames = MAGIC_TOTAL_FRAMES;
    frameW = MAGIC_FRAME_WIDTH;
    frameH = MAGIC_FRAME_HEIGHT;
  } else if (isWalking) {
    activeFrames = walkFrames;
    totalFrames = WALK_TOTAL_FRAMES;
    frameW = WALK_FRAME_WIDTH;
    frameH = WALK_FRAME_HEIGHT;
  } else {
    activeFrames = stopFrames;
    totalFrames = STOP_TOTAL_FRAMES;
    frameW = STOP_FRAME_WIDTH;
    frameH = STOP_FRAME_HEIGHT;
  }

  // 確保影格陣列已成功載入後再進行計算與繪製
  if (activeFrames.length > 0) {
    // 設定角色 1 在畫面上顯示的高度為目前畫布總高度的 1/3
    let displayHeight = height / 3;

    // 計算高度的縮放比例（顯示高度 ÷ 當前動畫的原始影格高度）
    let scaleRatio = displayHeight / frameH;

    // 依照等比例縮放原則，計算出角色 1 對應的顯示寬度
    let displayWidth = frameW * scaleRatio;

    // 限制角色 X 座標不能超出畫布的左右邊界
    charX = constrain(charX, displayWidth / 2, width - displayWidth / 2);

    // 計算角色 1 的 Y 座標，使其最底端剛好貼齊畫布的最底端 (height)
    let posY = height - displayHeight;

    // 安全防護：確保 currentFrame 不會超出當前動畫的總影格數
    currentFrame = currentFrame % totalFrames;

    // 使用 push() 與 pop() 隔離座標系變換，避免翻轉效果影響到其他繪圖
    push();
    // 將繪圖原點移動到角色的水平中心 (charX) 與頂端 (posY)
    translate(charX, posY);

    // 如果角色面向左邊（facingRight 為 false），利用 scale(-1, 1) 將 X 軸水平鏡像翻轉
    if (!facingRight) {
      scale(-1, 1);
    }

    // 設定圖片繪製模式為中心點對齊
    imageMode(CENTER);
    // 繪製當前影格圖片（Y 軸向下偏移 displayHeight / 2 配合 imageMode CENTER）
    image(activeFrames[currentFrame], 0, displayHeight / 2, displayWidth, displayHeight);
    pop();

    // 處理下一幀的影格索引更新邏輯
    if (isMagicking) {
      // 施法動畫只執行一次：遞增影格索引
      currentFrame++;
      // 當 18 張施法影格全部播放完畢後，關閉施法狀態並將影格歸零，自動回復為待機（stop）狀態
      if (currentFrame >= totalFrames) {
        isMagicking = false;
        currentFrame = 0;
      }
    } else {
      // 待機與行走動畫則使用餘數運算子 (%) 持續循環播放
      currentFrame = (currentFrame + 1) % totalFrames;
    }
  }
}

// windowResized 函式會在瀏覽器視窗大小改變時自動觸發
function windowResized() {
  // 記錄調整前的畫布寬度比例，讓視窗縮放後角色能維持在相對位置
  let ratioX = charX / width;
  // 重新調整畫布尺寸以符合最新的視窗大小
  resizeCanvas(windowWidth, windowHeight);
  // 依據新畫布寬度還原角色的相對 X 座標
  charX = width * ratioX;
}