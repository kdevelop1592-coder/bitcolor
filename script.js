// Bit to Color Mapping
const BIT_COLORS = {
    '00': { color: '#1a1a1a', name: '검정' },
    '01': { color: '#4169e1', name: '파랑' },
    '10': { color: '#ffd700', name: '노랑' },
    '11': { color: '#a9a9a9', name: '회색' }
};

// Canvas Configuration
const GRID_SIZE = 16;
const CELL_SIZE = 30;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

// State
let currentColor = '00';
let gridData = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('00'));
let isDrawing = false;
let showBits = false;

// Quiz State
let quizCorrect = 0;
let quizWrong = 0;
let currentQuizAnswer = null;
let quizAnswered = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initDrawingMode();
    initQuizMode();
    initModeSelector();
});

// Canvas Initialization
function initCanvas() {
    const canvas = document.getElementById('drawing-canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    drawGrid();
}

function drawGrid() {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const bitValue = gridData[row][col];
            const color = BIT_COLORS[bitValue].color;
            
            ctx.fillStyle = color;
            ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}

function updateBitOverlay() {
    const overlay = document.getElementById('bit-overlay');
    overlay.innerHTML = '';
    overlay.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    overlay.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'bit-cell';
            cell.textContent = gridData[row][col];
            overlay.appendChild(cell);
        }
    }
}

// Drawing Mode
function initDrawingMode() {
    const canvas = document.getElementById('drawing-canvas');
    
    // Palette buttons
    document.querySelectorAll('.palette-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentColor = btn.dataset.color;
        });
    });
    
    // Canvas drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    // Touch support
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Clear button
    document.getElementById('clear-canvas').addEventListener('click', clearCanvas);
    
    // Toggle bits button
    document.getElementById('toggle-bits').addEventListener('click', toggleBits);
}

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    const canvas = document.getElementById('drawing-canvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        gridData[row][col] = currentColor;
        drawGrid();
        if (showBits) updateBitOverlay();
    }
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    isDrawing = true;
    handleTouchMove(e);
}

function handleTouchMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = document.getElementById('drawing-canvas');
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        gridData[row][col] = currentColor;
        drawGrid();
        if (showBits) updateBitOverlay();
    }
}

function clearCanvas() {
    gridData = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('00'));
    drawGrid();
    if (showBits) updateBitOverlay();
}

function toggleBits() {
    showBits = !showBits;
    const overlay = document.getElementById('bit-overlay');
    
    if (showBits) {
        overlay.classList.remove('hidden');
        updateBitOverlay();
        document.getElementById('toggle-bits').textContent = '👁️ 비트 숨기기';
    } else {
        overlay.classList.add('hidden');
        document.getElementById('toggle-bits').textContent = '👁️ 비트 보기';
    }
}

// Quiz Mode
function initQuizMode() {
    document.getElementById('next-question').addEventListener('click', generateQuiz);
    generateQuiz();
}

function generateQuiz() {
    quizAnswered = false;
    document.getElementById('quiz-feedback').classList.add('hidden');
    
    // Generate random pattern
    const size = Math.floor(Math.random() * 3) + 3; // 3x3 to 5x5
    const pattern = [];
    const bits = Object.keys(BIT_COLORS);
    
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(bits[Math.floor(Math.random() * bits.length)]);
        }
        pattern.push(row);
    }
    
    // Decide question type
    const questionType = Math.random() > 0.5 ? 'color-to-bit' : 'bit-to-color';
    
    if (questionType === 'color-to-bit') {
        generateColorToBitQuiz(pattern, size);
    } else {
        generateBitToColorQuiz(pattern, size);
    }
}

function generateColorToBitQuiz(pattern, size) {
    document.getElementById('question-text').textContent = '이 색상 패턴의 비트 값은?';
    
    // Display colored pattern
    const display = document.getElementById('quiz-display');
    display.innerHTML = '';
    display.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    display.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    
    pattern.forEach(row => {
        row.forEach(bit => {
            const cell = document.createElement('div');
            cell.className = 'quiz-cell';
            cell.style.backgroundColor = BIT_COLORS[bit].color;
            display.appendChild(cell);
        });
    });
    
    // Generate answer
    const answer = pattern.map(row => row.join(' ')).join('\n');
    currentQuizAnswer = answer;
    
    // Generate options
    const options = [answer];
    while (options.length < 4) {
        const wrongPattern = pattern.map(row => 
            row.map(() => Object.keys(BIT_COLORS)[Math.floor(Math.random() * 4)])
        );
        const wrongAnswer = wrongPattern.map(row => row.join(' ')).join('\n');
        if (!options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }
    
    shuffleArray(options);
    displayQuizOptions(options);
}

function generateBitToColorQuiz(pattern, size) {
    document.getElementById('question-text').textContent = '이 비트 패턴의 색상은?';
    
    // Display bit pattern
    const display = document.getElementById('quiz-display');
    display.innerHTML = '';
    display.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    display.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    
    pattern.forEach(row => {
        row.forEach(bit => {
            const cell = document.createElement('div');
            cell.className = 'quiz-cell';
            cell.style.backgroundColor = '#2d2d44';
            cell.style.color = '#8b7fff';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.fontFamily = 'JetBrains Mono, monospace';
            cell.style.fontSize = '0.8rem';
            cell.style.fontWeight = '600';
            cell.textContent = bit;
            display.appendChild(cell);
        });
    });
    
    // Generate answer (color names)
    const answer = pattern.map(row => 
        row.map(bit => BIT_COLORS[bit].name).join(' ')
    ).join('\n');
    currentQuizAnswer = answer;
    
    // Generate options
    const options = [answer];
    while (options.length < 4) {
        const wrongPattern = pattern.map(row => 
            row.map(() => Object.keys(BIT_COLORS)[Math.floor(Math.random() * 4)])
        );
        const wrongAnswer = wrongPattern.map(row => 
            row.map(bit => BIT_COLORS[bit].name).join(' ')
        ).join('\n');
        if (!options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }
    
    shuffleArray(options);
    displayQuizOptions(options);
}

function displayQuizOptions(options) {
    const container = document.getElementById('quiz-options');
    container.innerHTML = '';
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(btn, option));
        container.appendChild(btn);
    });
}

function checkAnswer(btn, selected) {
    if (quizAnswered) return;
    
    quizAnswered = true;
    const isCorrect = selected === currentQuizAnswer;
    
    document.querySelectorAll('.quiz-option').forEach(option => {
        if (option.textContent === currentQuizAnswer) {
            option.classList.add('correct');
        } else if (option === btn && !isCorrect) {
            option.classList.add('wrong');
        }
        option.style.pointerEvents = 'none';
    });
    
    const feedback = document.getElementById('quiz-feedback');
    feedback.classList.remove('hidden');
    
    if (isCorrect) {
        quizCorrect++;
        feedback.textContent = '🎉 정답입니다!';
        feedback.className = 'quiz-feedback correct';
    } else {
        quizWrong++;
        feedback.textContent = '❌ 틀렸습니다. 정답을 확인하세요!';
        feedback.className = 'quiz-feedback wrong';
    }
    
    updateQuizStats();
}

function updateQuizStats() {
    document.getElementById('correct-count').textContent = quizCorrect;
    document.getElementById('wrong-count').textContent = quizWrong;
    
    const total = quizCorrect + quizWrong;
    const accuracy = total > 0 ? Math.round((quizCorrect / total) * 100) : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// Mode Selector
function initModeSelector() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.practice-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            if (mode === 'draw') {
                document.getElementById('draw-mode').classList.remove('hidden');
            } else {
                document.getElementById('quiz-mode').classList.remove('hidden');
                generateQuiz();
            }
        });
    });
}

// Utility
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
