const startButton = document.getElementById('start-game');
const gameContent = document.getElementById('game-content');
const gameImage = document.getElementById('game-image');
const gameText = document.getElementById('game-text');
const continueExploringButton = document.getElementById('continue-exploring');
const playerId = document.getElementById('player-id');
const playerNickname = document.getElementById('player-nickname');
const gameHistory = document.getElementById('game-history');

// 播放背景音乐
const bgMusic = new Audio('music/music.mp3');
bgMusic.loop = true;
bgMusic.play();

// 检查Web Storage中是否有玩家信息
if (localStorage.getItem('playerInfo')) {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    playerId.textContent = playerInfo.id;
    playerNickname.textContent = playerInfo.nickname;
    gameHistory.textContent = playerInfo.history;
} else {
    // 初始化玩家信息
    const playerInfo = {
        id: '123456',
        nickname: '冒险家',
        history: '尚未开始冒险'
    };
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
    playerId.textContent = playerInfo.id;
    playerNickname.textContent = playerInfo.nickname;
    gameHistory.textContent = playerInfo.history;
}

// 加载游戏元素
function loadGameData() {
    fetch('data.txt')
        .then(response => response.text())
        .then(data => {
            const elements = data.split('\n').map(item => {
                const [id, name, description] = item.split(', ');
                return { id, name, description };
            });
            displayElements(elements);
        });
}

// 显示游戏元素
function displayElements(elements) {
    elements.forEach(element => {
        const div = document.createElement('div');
        div.innerHTML = `<h2>${element.name}</h2><p>${element.description}</p>`;
        gameContent.appendChild(div);
    });
}

// 显示图片和文字
function displayImageAndText(imageSrc, text) {
    gameImage.src = imageSrc;
    gameImage.style.display = 'block';
    gameText.textContent = text;
    continueExploringButton.style.display = 'inline-block';
}

// 更新游戏历史
function updateHistory(text) {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    playerInfo.history += '\n' + text;
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
    gameHistory.textContent = playerInfo.history;
}

// 开始游戏
startButton.addEventListener('click', () => {
    loadGameData();
    displayImageAndText('images/library.png', '你在图书馆探索...');
    updateHistory('开始了新的冒险');
    continueExploringButton.style.display = 'inline-block'; // 确保按钮显示
});

// 重置游戏
function resetGame() {
    // 清除游戏图像和文本
    displayImageAndText('', '');
    gameText.textContent = '';
   
    
    // 重置游戏历史
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    playerInfo.history = '尚未开始冒险';
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
    gameHistory.textContent = playerInfo.history;
    
    // 重新显示开始游戏按钮并隐藏继续探索按钮
    startButton.style.display = 'inline-block';
    continueExploringButton.style.display = 'none';
    
    // 重新绑定继续探索按钮的点击事件
    continueExploringButton.textContent = '继续探索';
    continueExploringButton.onclick = null; // 移除之前的点击事件
}

// 显示图片和文字
function displayImageAndText(imageSrc, text) {
    if (imageSrc) {
        gameImage.src = imageSrc;
        gameImage.style.display = 'block';
    } else {
        gameImage.src = ''; // 清除图片源
        gameImage.style.display = 'none'; // 隐藏图片元素
    }
    gameText.textContent = text;
    continueExploringButton.style.display = 'inline-block';
}

// 继续探索
continueExploringButton.addEventListener('click', () => {
    continueExploringButton.style.display = 'none'; // 隐藏按钮
    if (gameImage.src.includes('images/library.png')) {
        displayImageAndText('images/clue.png', '找到线索！');
        updateHistory('在图书馆找到了线索');
        continueExploringButton.style.display = 'inline-block'; // 显示按钮
    } else if (gameImage.src.includes('images/clue.png')) {
        displayImageAndText('images/temple.png', '来到古老的神庙...');
        updateHistory('来到了古老的神庙');
        continueExploringButton.style.display = 'inline-block'; // 显示按钮
    } else if (gameImage.src.includes('images/temple.png')) {
        // 随机事件
        const randomEvent = Math.random() < 0.5 ? 'protector' : 'treasure';
        if (randomEvent === 'protector') {
            displayImageAndText('images/protector.png', '遭遇神庙守卫，你死亡了！');
            updateHistory('遭遇神庙守卫，游戏结束');
            continueExploringButton.textContent = '重新开始';
            continueExploringButton.style.display = 'inline-block';
            continueExploringButton.onclick = resetGame;
        } else {
            displayImageAndText('images/treasure.png', '找到宝箱！');
            updateHistory('找到了宝箱');
            continueExploringButton.textContent = '打开宝箱';
            continueExploringButton.style.display = 'inline-block';
            continueExploringButton.onclick = openTreasure;
        }
    }
});

// 打开宝箱
function openTreasure() {
    displayImageAndText('images/open.png', '你找到了传说中的宝藏！');
    updateHistory('打开了宝箱，找到了传说中的宝藏');
    continueExploringButton.textContent = '重新开始';
    continueExploringButton.style.display = 'inline-block';
    continueExploringButton.onclick = resetGame;
}

// 重置游戏
function resetGame() {
    // 清除游戏图像和文本
    displayImageAndText('', '');
    gameText.textContent = '';
    continueExploringButton.style.display = 'none';
    
    // 重置游戏历史
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    playerInfo.history = '尚未开始冒险';
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
    gameHistory.textContent = playerInfo.history;
    
    // 重新显示开始游戏按钮并隐藏继续探索按钮
    startButton.style.display = 'inline-block';
    continueExploringButton.style.display = 'none';
    
    // 重新绑定继续探索按钮的点击事件
    continueExploringButton.textContent = '继续探索';
    continueExploringButton.onclick = null; // 移除之前的点击事件
}
