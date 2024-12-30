// Select all necessary HTML elements to interact with game components
const storyDiv = document.getElementById("story");
const timerDiv = document.getElementById("timer");
const answerInput = document.getElementById("answer");
const guessButton = document.getElementById("guessButton");
const hintButton = document.getElementById("hintButton");
const scoreDiv = document.getElementById("score");
const messageDiv = document.getElementById("message");
const startButton = document.getElementById("startButton");
const summaryDiv = document.getElementById("summary"); 
const summaryMessage = document.getElementById("summary-message"); 
const finalScore = document.getElementById("final-score"); 
const restartButton = document.getElementById("restartButton"); 

// Game State Variables
let timeLeft;           
let score = 0;          
let timerInterval;    
let currentRiddleIndex = 0;

// Riddle Collection
const riddles = [
  {
    story: "בחדר העתיק של מכונת הזמן, מסך אנרגיה כחול חוסם את דרככם. על הקיר מרצדת כתובת עתיקה: 'יש בי 88 שערי אנרגיה, אך איני פורטל. אני מפיק צלילים קסומים, אך איני יצור חי. בעזרתי יכולים להפעיל קסם עתיק. מה אני?'",
    answer: "פסנתר",
    hint: "רמז: כלי עתיק שמנגן מנגינות קסומות על ידי הקשה על מקשים שחורים ולבנים.",
    time: 90
  },
  {
    story: "המסך השני זוהר בגוון סגול מסתורי. תבנית מספרים מופיעה באוויר, מרחפת כמו אבק כוכבים: '1, 1, 2, 3, 5, 8, ?, 21, 34'. קול עתיק לוחש: 'רצף המספרים הזה מכיל את סוד היקום. מצאו את המספר החסר כדי לשחרר את האנרגיה הבאה.'",
    answer: "13",
    hint: "רמז: כל מספר הוא סכום של שני המספרים שלפניו. זוהי תבנית עתיקה שנמצאה במקדשים קדומים.",
    time: 75
  },
  {
    story: "המסך האחרון נדלק באור זהוב. חידה אחרונה מופיעה: 'אני קטן אך מפחיד גדולים, יש לי זנב ועיניים חדות, ובמעבדות הזמן אני מסתובב בחופשיות. הסוד האחרון טמון בשמי.' רק פתרון החידה הזו יאפשר את השלמת תיקון מכונת הזמן.",
    answer: "עכבר",
    hint: "רמז: יצור קטן שמתגנב בין הצללים, לפעמים במעבדה ולפעמים במחשב.",
    time: 60
  }
];

// Timer Update Function
function updateTimer() {
  timeLeft--;
  timerDiv.textContent = "זמן נותר: " + timeLeft;
  if (timeLeft <= 0) {
    endGame("הזמן נגמר!");
  }
}

// Game Initialization Function
function startGame() {
  score = 0;
  currentRiddleIndex = 0;
  updateScore();
  loadRiddle();
  messageDiv.textContent = "";
  guessButton.disabled = false;
  hintButton.disabled = false;
}

// Riddle Loading Function
// Riddle Loading Function
function loadRiddle() {
  const riddle = riddles[currentRiddleIndex];
  storyDiv.textContent = riddle.story;
  
  if (currentRiddleIndex === 0) {
    timeLeft = riddle.time;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }
  
  timerDiv.textContent = "זמן נותר: " + timeLeft;
  answerInput.value = "";
  answerInput.disabled = false;
  hintButton.disabled = false;
}

// Answer Checking Function
function checkAnswer() {
  const userAnswer = answerInput.value.trim();

  if (userAnswer === "") {
    messageDiv.textContent = "לא הזנת תשובה!";
    return;
  }

  const correctAnswer = riddles[currentRiddleIndex].answer.toLowerCase();

  if (userAnswer.toLowerCase() === correctAnswer) {
    // Correct answer: award points based on remaining time
    const timeBonus = Math.max(0, timeLeft);
    score += 100 + timeBonus;
    updateScore();
    messageDiv.textContent = `נכון! הרווחת ${100 + timeBonus} נקודות.`;
    currentRiddleIndex++;
    if (currentRiddleIndex < riddles.length) {
      // Move to next riddle
      setTimeout(() => {
        loadRiddle();
        messageDiv.textContent = "";
      }, 2000);
    } else {
      // All riddles completed
      setTimeout(() => { 
          endGame();
      }, 1000);
    }
  } else {
    // Incorrect answer: penalize time
    timeLeft -= 5;
    
    messageDiv.textContent = ""; 

    setTimeout(() => {
      messageDiv.textContent = "תשובה לא נכונה. איבדת 5 שניות.";
    }, 50); 

    answerInput.value = "";
    if (timeLeft <= 0) {
      endGame("הזמן נגמר!");
    }
  }
}

// Game Ending Function
function endGame(message = "") {
  clearInterval(timerInterval);
  if (message === "") {
      showSummary(); 
  } else {
      messageDiv.textContent = message;
      answerInput.disabled = true;
      guessButton.disabled = true;
      hintButton.disabled = true;
  }
}

// Score Update Function
function updateScore() {
  scoreDiv.textContent = "ניקוד: " + score;
}

// Hint Display Function
function showHint() {
  messageDiv.textContent = riddles[currentRiddleIndex].hint;
  hintButton.disabled = true;
}

// Game Elements Display Function
function showGameElements() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("story").style.display = "block";
  document.getElementById("timer").style.display = "block";
  document.getElementById("answer").style.display = "block";
  document.getElementById("buttons").style.display = "flex";
  document.getElementById("message").style.display = "block";
  summaryDiv.style.display = "none"; 
}

// Game Initialization Wrapper
function initializeGame() {
  startGame();
  showGameElements();
}

// Summary Screen Function
function showSummary() {
  // Hide game elements
  document.getElementById("story").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.getElementById("answer").style.display = "none";
  document.getElementById("buttons").style.display = "none";
  document.getElementById("message").style.display = "none";
  
  // Show summary div
  summaryDiv.style.display = "block";
  
  // Determine summary message based on score
  if (score >= 300) {
    summaryMessage.textContent = "הצלחה מבריקה! בזכות החשיבה המהירה והמבריקה שלכם, הצלחתם לייצב את מכונת הזמן ולמנוע קטסטרופה! המעבדה כולה מצדיעה לכם על ההישג המרשים.";
} else if (score >= 150) {
    summaryMessage.textContent = "משימה הושלמה בהצלחה! הצלחתם לייצב את מכונת הזמן ברגע האחרון. עם קצת יותר מהירות בפעם הבאה, תוכלו להשיג תוצאות טובות אף יותר!";
} else {
    summaryMessage.textContent = "המשימה הושלמה, אך בקושי! מכונת הזמן אמנם יציבה, אך ספגה נזקים קלים. תרגול נוסף יעזור לכם להגיב מהר יותר בפעם הבאה ולמנוע נזק מיותר.";
}
  
  // Display final score
  finalScore.textContent = "הניקוד הסופי שלכם: " + score;
}

// Restart Game Function
function restartGame() {
  summaryDiv.style.display = "none";
  initializeGame();
}

// Event Listeners
startButton.addEventListener("click", initializeGame);
guessButton.addEventListener("click", checkAnswer);
hintButton.addEventListener("click", showHint);
restartButton.addEventListener("click", restartGame);
answerInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });

// Initial Page Setup
document.getElementById("story").style.display = "none";
document.getElementById("timer").style.display = "none";
document.getElementById("answer").style.display = "none";
document.getElementById("buttons").style.display = "none";
document.getElementById("message").style.display = "none";
summaryDiv.style.display = "none";