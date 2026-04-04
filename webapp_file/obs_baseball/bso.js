let gameState = {
    inning: 1,
    isTop: true,
    score: { visitor: 0, home: 0 },
    balls: 0,
    strikes: 0,
    outs: 0,
    bases: { first: false, second: false, third: false }
};

// Ver 2.0で使うかも...
localStorage.setItem("initial", JSON.stringify(gameState));

// 直前の状態を保持するための変数
let previousGameState = JSON.parse(JSON.stringify(gameState));

// DOM要素の参照
const inningNum = document.getElementById('inning-num');
const inningHalf = document.getElementById('inning-half');
const scoreVisitor = document.getElementById('score-visitor');
const scoreHome = document.getElementById('score-home');
const teamVisitor = document.querySelector('.team-score.visitor');
const teamHome = document.querySelector('.team-score.home');
const ballDots = document.querySelectorAll('#balls .bso-dot');
const strikeDots = document.querySelectorAll('#strikes .bso-dot');
const outDots = document.querySelectorAll('#outs .bso-dot');
const base1 = document.getElementById('base-1');
const base2 = document.getElementById('base-2');
const base3 = document.getElementById('base-3');

// 状態をスコアボードに反映する関数
function updateScoreboard() {
    if (!inningNum) return; 

    inningNum.textContent = gameState.inning;
    inningHalf.textContent = gameState.isTop ? '表' : '裏';

    scoreVisitor.textContent = gameState.score.visitor;
    scoreHome.textContent = gameState.score.home;
    
    // 攻撃チームのハイライト
    teamVisitor.classList.toggle('active-team', gameState.isTop);
    teamHome.classList.toggle('active-team', !gameState.isTop);

    // BSO
    ballDots.forEach((dot, i) => dot.classList.toggle('active', i < gameState.balls));
    strikeDots.forEach((dot, i) => dot.classList.toggle('active', i < gameState.strikes));
    outDots.forEach((dot, i) => dot.classList.toggle('active', i < gameState.outs));

    // 塁状況
    base1.classList.toggle('on-base', gameState.bases.first);
    base2.classList.toggle('on-base', gameState.bases.second);
    base3.classList.toggle('on-base', gameState.bases.third);
}

// BSOとランナーをリセットする関数(c)
function resetCountAndBases() {
    gameState.balls = 0;
    gameState.strikes = 0;
    gameState.outs = 0;
    gameState.bases = { first: false, second: false, third: false };
}

// カウントのみをリセットする関数(x)
function resetCountOnly() {
    gameState.balls = 0;
    gameState.strikes = 0;
}

// 攻守交代の処理
function changeInning() {
    gameState.isTop = !gameState.isTop;
    if (gameState.isTop) {
        gameState.inning++; 
    }
    resetCountAndBases();
}

// ランナーの進塁処理
function advanceRunners() {
    // 3塁ランナーがいたら得点
    if (gameState.bases.third) {
        if (gameState.isTop) {
            gameState.score.visitor++; 
        } else {
            gameState.score.home++; 
        }
    }
    // 2塁ランナーを3塁へ
    gameState.bases.third = gameState.bases.second;
    // 1塁ランナーを2塁へ
    gameState.bases.second = gameState.bases.first;
    // 打者を1塁へ
    gameState.bases.first = true;
}


// 自動進行ロジック
function checkGameLogic() {
    // 4ボールで出塁
    if (gameState.balls >= 4) {
        advanceRunners(); 
        gameState.balls = 0;
        gameState.strikes = 0;
    }

    // 3ストライクで三振
    if (gameState.strikes >= 3) {
        gameState.outs++;
        gameState.strikes = 0;
        gameState.balls = 0;
    }

    // 3アウトで攻守交代
    if (gameState.outs >= 3) {
        changeInning();
    }

    updateScoreboard();
}

// 状態を保存する関数(undo用
function saveCurrentState() {
    // 現在の gameState の完全なコピーを previousGameState に保存する
    previousGameState = JSON.parse(JSON.stringify(gameState));
}

// 初期表示
updateScoreboard();

// キーボード操作
document.addEventListener('keydown', (e) => {
    // INPUT要素にフォーカスがある場合は、デフォルト動作を許可
    if (e.target.tagName === 'INPUT') {
        return;
    }
    
    // Escキー以外のデフォルト動作をキャンセル
    if (e.key !== 'Escape') {
        e.preventDefault(); 
    }
    
    const key = e.key.toLowerCase();
    
    // Zキー以外のキーが押されたら、まず現在の状態を保存する
    if (key !== 'z' && key !== 'escape') {
        saveCurrentState();
    }
    
    switch (key) {
        case 'b': // B:ボール
        case 's': // S:ストライク
            if (key === 'b' && gameState.balls < 4) {
                gameState.balls++;
            }
            else if (key === 's' && gameState.strikes < 3) {
                gameState.strikes++;
            }
            checkGameLogic();
            break;
            
        case 'o': // O: アウト、BSカウントをリセット
            gameState.outs++;
            gameState.balls = 0; 
            gameState.strikes = 0;
            checkGameLogic(); 
            break;

        case 'r': // R:攻撃側の得点をマニュアルで追加(BSカウントは維持)
            if (gameState.isTop) {
                gameState.score.visitor++;
            } else {
                gameState.score.home++;
            }
            // Rキー単独ではBSOリセットは行わない
            updateScoreboard();
            break;

        case 'i': // I:強制的に攻守交代し、イニングを進める
            changeInning();
            updateScoreboard();
            break;

        // 塁状況のトグル
        case '1': 
        case '2': 
        case '3': 
            if (key === '1') gameState.bases.first = !gameState.bases.first;
            else if (key === '2') gameState.bases.second = !gameState.bases.second;
            else if (key === '3') gameState.bases.third = !gameState.bases.third;
            
            // 塁状況変更単独ではBSOリセットは行わない
            updateScoreboard();
            break;
            
        case 'x': // X:BSカウントのみをリセットする
            resetCountOnly();
            updateScoreboard();
            break;
            
        case 'c': // C:カウント・ランナー全リセット
            resetCountAndBases();
            updateScoreboard();
            break;
            
        case 'a': // A:イニングを戻す
            if (!gameState.isTop) {
                gameState.isTop = true;
            } else if (gameState.inning > 1) {
                gameState.inning--;
                gameState.isTop = false;
            }
            resetCountAndBases();
            updateScoreboard();
            break;
            
        case 'z': // Z:直前の操作に戻す
            gameState = JSON.parse(JSON.stringify(previousGameState));
            updateScoreboard();
            break;
    }
});