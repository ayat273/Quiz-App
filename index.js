// Select Elements
let count = document.querySelector(".count span");
let spans = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submit = document.querySelector(".submit");
let bulletsElement = document.querySelector(".bullets");
let results = document.querySelector(".results");
let countDown = document.querySelector(".countdown");
// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function theQuestions() {
  let myRequst = new XMLHttpRequest();
  myRequst.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let quObject = JSON.parse(this.responseText);
      let qucount = quObject.length;
      // Create Bullets + Set Questions Count
      creatBullets(qucount);
      // Add Question Data
      addQuestionData(quObject[currentIndex], qucount);
      // Start CountDown
      countdown(3, qucount);
      // Click On Submi
      submit.onclick = () => {
        // Get Right Answer
        let rightAnswer = quObject[currentIndex].right_answer;
        // Increase Index
        currentIndex++;
        // Check The Answer
        checkAnswer(rightAnswer, qucount);
        // Remove Previous Question
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        // Add Question Data
        addQuestionData(quObject[currentIndex], qucount);
        // Handle Bullets Class
        handleBullets();
        // Start CountDown
        clearInterval(countdownInterval)
        countdown(3, qucount);
        //Show Results
        showResults(qucount);
      };
    }
  };
  myRequst.open("GET", "index.json", true);
  myRequst.send();
}
theQuestions();
function creatBullets(num) {
  count.innerHTML = num;
  // Create Spans
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    // Check If Its First Span
    if (i === 0) {
      theBullet.className = "on";
    }
    // Append Bullets To Main Bullet Container
    spans.appendChild(theBullet);
  }
}
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let quizTitle = document.createElement("h2");
    // Create Question Text
    let quizText = document.createTextNode(obj["title"]);
    // Append Text To H2
    quizTitle.appendChild(quizText);
    // Append The H2 To The Quiz Area
    quizArea.appendChild(quizTitle);
    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");
      // Create Main Answer Div
      mainDiv.className = "answer";
      // Create Radio Input
      let radioInput = document.createElement("input");
      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }
      // Create Label
      let label = document.createElement("label");
      // Add For Attribute
      label.htmlFor = `answer_${i}`;
      // Create Label Text
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      // Add The Text To Label
      label.appendChild(labelText);
      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);
      // Append All Divs To Answers Area
      answerArea.appendChild(mainDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === choosenAnswer) {
    rightAnswers++;
    console.log("The Good Answer");
  }
}
function handleBullets() {
  let bulletSpans = document.querySelectorAll(".bullets .spans span");
  let arrayBullets = Array.from(bulletSpans);
  arrayBullets.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submit.remove();
    bulletsElement.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class="good"> Good </span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class="perfect"> Perfect </span>, All Answer is Good`;
    } else {
      theResult = `<span class="bad"> Bad </span>, ${rightAnswers} From ${count}`;
    }
    results.innerHTML = theResult;
    results.style.padding = "10px";
    results.style.marginTop = "10px";
    results.style.backgroundColor = "white";
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDown.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submit.click()
      }
    }, 1000);
  }
}
