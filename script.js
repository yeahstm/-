let target = '';
let attempts = 0;
let maxAttempts = 10;
let isCheatMode = false;

function startGame(limit) {
    target = Array(4).fill().map(() => Math.floor(Math.random() * 10)).join('');
    attempts = 0;
    maxAttempts = limit;
    isCheatMode = (limit === -1);

    // 切换界面
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('history').innerHTML = '';
    document.getElementById('guessInput').value = '';
    document.getElementById('cheatBtn').innerHTML = '';

    if (isCheatMode) {
        document.getElementById('cheatBtn').innerHTML = `
            <button onclick="revealAnswer()" 
                    style="background:#ff4757; color:white; padding:12px 24px; 
                           border:none; border-radius:50px; cursor:pointer; font-size:1.1em; font-weight:bold;">
                我认输了，告诉我答案
            </button>
        `;
        document.getElementById('remainText').textContent = '无限次机会，慢慢猜！';
    } else {
        document.getElementById('remain').textContent = maxAttempts;
        document.getElementById('remainText').innerHTML = `你还有 <span id="remain">${maxAttempts}</span> 次机会`;
    }
    
    document.getElementById('guessInput').focus();
}

function revealAnswer() {
    if (confirm(`真的要看答案吗？\n答案是：${target}\n\n看完就没意思啦～`)) {
        document.getElementById('cheatBtn').innerHTML = 
            `<div style="color:#ffd700; font-size:2em; font-weight:bold; margin:20px; animation: bounce 0.8s;">
                答案就是：${target}
            </div>`;
    }
}

function evaluate(guess) {
    if (guess === target) return "猜中了";

    const guessNum = parseInt(guess);
    const targetNum = parseInt(target);

    const bulls = [];
    for (let i = 0; i < 4; i++) {
        if (guess[i] === target[i]) bulls.push(i);
    }

    const targetRem = [], guessRem = [];
    for (let i = 0; i < 4; i++) {
        if (!bulls.includes(i)) {
            targetRem.push(target[i]);
            guessRem.push(guess[i]);
        }
    }

    const targetCount = {};
    targetRem.forEach(d => targetCount[d] = (targetCount[d] || 0) + 1);
    const guessCount = {};
    guessRem.forEach(d => guessCount[d] = (guessCount[d] || 0) + 1);

    let cows = 0;
    for (let d in targetCount) {
        cows += Math.min(targetCount[d], guessCount[d] || 0);
    }

    const highlow = guessNum > targetNum ? "高了" : "低了";
    return cows > 0 ? `位对码错，${highlow}` : highlow;
}

function submitGuess() {
    const input = document.getElementById('guessInput');
    let guess = input.value.trim();

    if (!/^\d{4}$/.test(guess)) {
        alert("请输入4位数字！例如：1234 或 0078");
        return;
    }

    attempts++;
    if (!isCheatMode) {
        document.getElementById('remain').textContent = maxAttempts - attempts + 1;
    }

    const result = evaluate(guess);
    const div = document.createElement('div');
    div.innerHTML = `<strong>第${attempts}次：</strong> ${guess} → ${result}`;
    if (result === "猜中了") div.classList.add('win');
    document.getElementById('history').prepend(div);

    if (result === "猜中了") {
        setTimeout(() => {
            alert(`恭喜！你用 ${attempts} 次就猜中了！\n答案：${target}`);
            backToMenu();
        }, 300);
    } else if (!isCheatMode && attempts >= maxAttempts) {
        setTimeout(() => {
            alert(`机会用完！答案是：${target}`);
            backToMenu();
        }, 300);
    } else {
        input.value = '';
        input.focus();
    }
}

function backToMenu() {
    document.getElementById('game').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
}

// 回车提交
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('guessInput').addEventListener('keyup', e => {
        if (e.key === 'Enter') submitGuess();
    });
});