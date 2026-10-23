(() => {
  const board = document.getElementById('gameBoard');
  if (!board) return;
  const symbols = ['🍓','🚀','🌈','🐼','🎧','🍀','⚽','🪐'];
  let first = null, lock = false, matched = 0, moves = 0, seconds = 0, tick = null, started = false;
  const movesEl = document.getElementById('moves');
  const timerEl = document.getElementById('timer');
  const pairsEl = document.getElementById('pairs');
  const messageEl = document.getElementById('gameMessage');
  function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function timeText(n) {
    return String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0');
  }
  function startTimer() {
    if (started) return;
    started = true;
    tick = setInterval(() => { seconds++; timerEl.textContent = timeText(seconds); }, 1000);
  }
  function updateStats() {
    movesEl.textContent = moves;
    pairsEl.textContent = `${matched} / ${symbols.length}`;
  }
  function finish() {
    clearInterval(tick);
    messageEl.textContent = `शानदार! तुमने ${moves} moves और ${timeText(seconds)} में गेम पूरा किया।`;
  }
  function flipBack(a, b) {
    setTimeout(() => {
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      a.querySelector('.card-face').textContent = '？';
      b.querySelector('.card-face').textContent = '？';
      lock = false;
    }, 750);
  }
  function choose(card) {
    if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    startTimer();
    card.classList.add('flipped');
    card.querySelector('.card-face').textContent = card.dataset.symbol;
    if (!first) { first = card; return; }
    moves++;
    updateStats();
    const second = card;
    if (first.dataset.symbol === second.dataset.symbol) {
      first.classList.add('matched'); second.classList.add('matched');
      first = null; matched++; updateStats();
      if (matched === symbols.length) finish();
    } else {
      lock = true;
      const oldFirst = first;
      first = null;
      flipBack(oldFirst, second);
    }
  }
  function newGame() {
    clearInterval(tick); tick = null; first = null; lock = false; matched = 0; moves = 0; seconds = 0; started = false;
    timerEl.textContent = '00:00'; messageEl.textContent = 'शुरू करने के लिए कोई भी कार्ड चुनो।';
    updateStats(); board.innerHTML = '';
    shuffle([...symbols, ...symbols]).forEach((symbol, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'memory-card';
      button.setAttribute('aria-label', `Card ${index + 1}`);
      button.dataset.symbol = symbol;
      const face = document.createElement('span'); face.className = 'card-face'; face.textContent = '？';
      button.appendChild(face); button.addEventListener('click', () => choose(button)); board.appendChild(button);
    });
  }
  document.getElementById('restart').addEventListener('click', newGame);
  newGame();
})();