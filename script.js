// Global Variables
let currentTheme = localStorage.getItem("theme") || "light"
let currentQuizQuestion = 0
let quizAnswers = []
let quizStartTime = null
let quizTimer = null
let currentPracticeTask = Number.parseInt(localStorage.getItem("currentPracticeTask")) || 1
const practiceTasks = [] // Declare practiceTasks variable
const studentsData = [] // Declare studentsData variable
const quizQuestions = [] // Declare quizQuestions variable

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme()
  initializeNavigation()
  initializePage()
  requireAuthIfProtected()
  setupNavbarAuthToggle()
  interceptProtectedLinksWhenLoggedOut()
  setupAuthForms()
})

// Theme Management
function initializeTheme() {
  // Apply saved theme
  document.documentElement.setAttribute("data-theme", currentTheme)

  // Update theme toggle button
  const themeToggle = document.getElementById("theme-toggle")
  if (themeToggle) {
    themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙"
    themeToggle.addEventListener("click", toggleTheme)
  }
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light"
  document.documentElement.setAttribute("data-theme", currentTheme)
  localStorage.setItem("theme", currentTheme)

  // Update button icon
  const themeToggle = document.getElementById("theme-toggle")
  if (themeToggle) {
    themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙"
  }
}

// Navigation Management
function initializeNavigation() {
  // Set active navigation link based on current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active")
    }
  })
}

// Page-specific initialization
function initializePage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  switch (currentPage) {
    case "practice.html":
      initializePracticePage()
      break
    case "quiz.html":
      initializeQuizPage()
      break
    case "leaderboard.html":
      initializeLeaderboardPage()
      break
    case "cheatsheet.html":
      initializeCheatsheetPage()
      break
  }
}

// Practice Page Functions
function initializePracticePage() {
  loadCurrentTask()
  setupPracticeEventListeners()
  updateProgress()
}

function setupPracticeEventListeners() {
  const runQueryBtn = document.getElementById("run-query")
  const clearEditorBtn = document.getElementById("clear-editor")
  const showHintBtn = document.getElementById("show-hint")
  const nextTaskBtn = document.getElementById("next-task")
  const prevTaskBtn = document.getElementById("prev-task")
  const resetProgressBtn = document.getElementById("reset-progress")

  if (runQueryBtn) runQueryBtn.addEventListener("click", runQuery)
  if (clearEditorBtn) clearEditorBtn.addEventListener("click", clearEditor)
  if (showHintBtn) showHintBtn.addEventListener("click", showHint)
  if (nextTaskBtn) nextTaskBtn.addEventListener("click", nextTask)
  if (prevTaskBtn) prevTaskBtn.addEventListener("click", prevTask)
  if (resetProgressBtn) resetProgressBtn.addEventListener("click", resetProgress)
}

function loadCurrentTask() {
  const task = practiceTasks.find((t) => t.id === currentPracticeTask)
  if (!task) return

  // Update task information
  document.getElementById("task-title").textContent = `Task ${task.id}: ${task.title}`
  document.getElementById("task-difficulty").textContent = task.difficulty
  document.getElementById("task-description").innerHTML =
    `<p>${task.description}</p><p><strong>Hint:</strong> ${task.hint}</p>`

  // Update navigation buttons
  const prevBtn = document.getElementById("prev-task")
  const nextBtn = document.getElementById("next-task")

  if (prevBtn) prevBtn.disabled = currentPracticeTask === 1
  if (nextBtn) nextBtn.disabled = currentPracticeTask === practiceTasks.length
}

function updateProgress() {
  const progressFill = document.getElementById("progress-fill")
  const currentTaskSpan = document.getElementById("current-task")
  const totalTasksSpan = document.getElementById("total-tasks")

  if (progressFill) {
    const progress = (currentPracticeTask / practiceTasks.length) * 100
    progressFill.style.width = `${progress}%`
  }

  if (currentTaskSpan) currentTaskSpan.textContent = currentPracticeTask
  if (totalTasksSpan) totalTasksSpan.textContent = practiceTasks.length
}

function runQuery() {
  const editor = document.getElementById("sql-editor")
  const query = editor.value.trim().toLowerCase()
  const task = practiceTasks.find((t) => t.id === currentPracticeTask)

  if (!query) {
    showFeedback("Please enter a SQL query.", "error")
    return
  }

  // Simple query validation and execution
  try {
    const result = executeQuery(query)
    displayResults(result)

    // Check if query matches expected result
    if (isQueryCorrect(query, task)) {
      showFeedback(`Correct! ${task.explanation}`, "success")
      enableNextTask()
    } else {
      showFeedback("Query executed but doesn't match the expected result. Try again!", "error")
    }
  } catch (error) {
    showFeedback(`Error: ${error.message}`, "error")
    displayResults([])
  }
}

function executeQuery(query) {
  // Simple SQL parser for basic queries
  query = query.replace(/;$/, "") // Remove trailing semicolon

  if (query.startsWith("select")) {
    return executeSelectQuery(query)
  } else if (query.startsWith("insert")) {
    return executeInsertQuery(query)
  } else if (query.startsWith("update")) {
    return executeUpdateQuery(query)
  } else if (query.startsWith("delete")) {
    return executeDeleteQuery(query)
  } else {
    throw new Error("Unsupported query type. Only SELECT, INSERT, UPDATE, and DELETE are supported.")
  }
}

function executeSelectQuery(query) {
  let result = [...studentsData]

  // Parse SELECT clause
  const selectMatch = query.match(/select\s+(.*?)\s+from/i)
  if (!selectMatch) throw new Error("Invalid SELECT syntax")

  const columns = selectMatch[1].trim()

  // Parse WHERE clause
  const whereMatch = query.match(/where\s+(.+?)(?:\s+order\s+by|$)/i)
  if (whereMatch) {
    const condition = whereMatch[1].trim()
    result = result.filter((row) => evaluateCondition(row, condition))
  }

  // Parse ORDER BY clause
  const orderMatch = query.match(/order\s+by\s+(\w+)(?:\s+(asc|desc))?/i)
  if (orderMatch) {
    const column = orderMatch[1]
    const direction = orderMatch[2] || "asc"
    result.sort((a, b) => {
      if (direction.toLowerCase() === "desc") {
        return b[column] > a[column] ? 1 : -1
      } else {
        return a[column] > b[column] ? 1 : -1
      }
    })
  }

  // Handle COUNT function
  if (columns.includes("count(*)")) {
    return [{ "COUNT(*)": result.length }]
  }

  // Select specific columns
  if (columns !== "*") {
    const columnList = columns.split(",").map((col) => col.trim())
    result = result.map((row) => {
      const newRow = {}
      columnList.forEach((col) => {
        if (row.hasOwnProperty(col)) {
          newRow[col] = row[col]
        }
      })
      return newRow
    })
  }

  return result
}

function executeInsertQuery(query) {
  // Simplified INSERT implementation
  throw new Error("INSERT queries are not fully implemented in this demo.")
}

function executeUpdateQuery(query) {
  // Simplified UPDATE implementation
  throw new Error("UPDATE queries are not fully implemented in this demo.")
}

function executeDeleteQuery(query) {
  // Simplified DELETE implementation
  throw new Error("DELETE queries are not fully implemented in this demo.")
}

function evaluateCondition(row, condition) {
  // Simple condition evaluation for demo purposes
  // This is a very basic implementation

  if (condition.includes(" and ")) {
    const parts = condition.split(" and ")
    return parts.every((part) => evaluateSimpleCondition(row, part.trim()))
  } else if (condition.includes(" or ")) {
    const parts = condition.split(" or ")
    return parts.some((part) => evaluateSimpleCondition(row, part.trim()))
  } else {
    return evaluateSimpleCondition(row, condition)
  }
}

function evaluateSimpleCondition(row, condition) {
  // Handle LIKE operator
  if (condition.includes(" like ")) {
    const [column, pattern] = condition.split(" like ").map((s) => s.trim().replace(/'/g, ""))
    const value = row[column]
    if (pattern.endsWith("%")) {
      return value.startsWith(pattern.slice(0, -1))
    } else if (pattern.startsWith("%")) {
      return value.endsWith(pattern.slice(1))
    } else {
      return value.includes(pattern)
    }
  }

  // Handle other operators
  const operators = [">=", "<=", "!=", "<>", "=", ">", "<"]
  for (const op of operators) {
    if (condition.includes(` ${op} `)) {
      const [column, value] = condition.split(` ${op} `).map((s) => s.trim().replace(/'/g, ""))
      const rowValue = row[column]
      const compareValue = isNaN(value) ? value : Number(value)

      switch (op) {
        case "=":
          return rowValue == compareValue
        case "!=":
        case "<>":
          return rowValue != compareValue
        case ">":
          return rowValue > compareValue
        case "<":
          return rowValue < compareValue
        case ">=":
          return rowValue >= compareValue
        case "<=":
          return rowValue <= compareValue
      }
    }
  }

  return false
}

function isQueryCorrect(query, task) {
  // Normalize queries for comparison
  const normalizeQuery = (q) => q.toLowerCase().replace(/\s+/g, " ").trim().replace(/;$/, "")
  return normalizeQuery(query) === normalizeQuery(task.expectedQuery)
}

function displayResults(results) {
  const container = document.getElementById("results-container")
  if (!container) return

  if (results.length === 0) {
    container.innerHTML = '<p class="no-results">No results found.</p>'
    return
  }

  // Create table
  const table = document.createElement("table")
  table.className = "data-table"

  // Create header
  const thead = document.createElement("thead")
  const headerRow = document.createElement("tr")
  const columns = Object.keys(results[0])

  columns.forEach((column) => {
    const th = document.createElement("th")
    th.textContent = column
    headerRow.appendChild(th)
  })

  thead.appendChild(headerRow)
  table.appendChild(thead)

  // Create body
  const tbody = document.createElement("tbody")
  results.forEach((row) => {
    const tr = document.createElement("tr")
    columns.forEach((column) => {
      const td = document.createElement("td")
      td.textContent = row[column]
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })

  table.appendChild(tbody)
  container.innerHTML = ""
  container.appendChild(table)
}

function showFeedback(message, type) {
  const feedbackSection = document.getElementById("feedback-section")
  const feedbackContent = document.getElementById("feedback-content")

  if (!feedbackSection || !feedbackContent) return

  feedbackContent.innerHTML = `<p>${message}</p>`
  feedbackContent.className = `feedback-content feedback-${type}`
  feedbackSection.style.display = "block"

  // Auto-hide after 5 seconds
  setTimeout(() => {
    feedbackSection.style.display = "none"
  }, 5000)
}

function clearEditor() {
  const editor = document.getElementById("sql-editor")
  if (editor) editor.value = ""
}

function showHint() {
  const task = practiceTasks.find((t) => t.id === currentPracticeTask)
  if (task) {
    showFeedback(task.hint, "info")
  }
}

function enableNextTask() {
  const nextBtn = document.getElementById("next-task")
  if (nextBtn && currentPracticeTask < practiceTasks.length) {
    nextBtn.disabled = false
  }
}

function nextTask() {
  if (currentPracticeTask < practiceTasks.length) {
    currentPracticeTask++
    localStorage.setItem("currentPracticeTask", currentPracticeTask)
    loadCurrentTask()
    updateProgress()
    clearEditor()
    document.getElementById("results-container").innerHTML =
      '<p class="no-results">Run a query to see results here.</p>'
    document.getElementById("feedback-section").style.display = "none"
  }
}

function prevTask() {
  if (currentPracticeTask > 1) {
    currentPracticeTask--
    localStorage.setItem("currentPracticeTask", currentPracticeTask)
    loadCurrentTask()
    updateProgress()
    clearEditor()
    document.getElementById("results-container").innerHTML =
      '<p class="no-results">Run a query to see results here.</p>'
    document.getElementById("feedback-section").style.display = "none"
  }
}

function resetProgress() {
  if (confirm("Are you sure you want to reset your progress? This will start you back at Task 1.")) {
    currentPracticeTask = 1
    localStorage.setItem("currentPracticeTask", currentPracticeTask)
    loadCurrentTask()
    updateProgress()
    clearEditor()
    document.getElementById("results-container").innerHTML =
      '<p class="no-results">Run a query to see results here.</p>'
    document.getElementById("feedback-section").style.display = "none"
  }
}

// Quiz Page Functions
function initializeQuizPage() {
  setupQuizEventListeners()
  loadQuizState()
}

function setupQuizEventListeners() {
  const startQuizBtn = document.getElementById("start-quiz")
  const nextQuestionBtn = document.getElementById("next-question")
  const prevQuestionBtn = document.getElementById("prev-question")
  const submitQuizBtn = document.getElementById("submit-quiz")
  const retakeQuizBtn = document.getElementById("retake-quiz")

  if (startQuizBtn) startQuizBtn.addEventListener("click", startQuiz)
  if (nextQuestionBtn) nextQuestionBtn.addEventListener("click", nextQuestion)
  if (prevQuestionBtn) prevQuestionBtn.addEventListener("click", prevQuestion)
  if (submitQuizBtn) submitQuizBtn.addEventListener("click", submitQuiz)
  if (retakeQuizBtn) retakeQuizBtn.addEventListener("click", retakeQuiz)
}

function loadQuizState() {
  // Check if there's an ongoing quiz
  const savedQuizState = localStorage.getItem("currentQuiz")
  if (savedQuizState) {
    const quizState = JSON.parse(savedQuizState)
    currentQuizQuestion = quizState.currentQuestion
    quizAnswers = quizState.answers
    quizStartTime = new Date(quizState.startTime)

    // Resume quiz
    showQuizQuestions()
    loadQuestion(currentQuizQuestion)
    startTimer()
  }
}

function startQuiz() {
  currentQuizQuestion = 0
  quizAnswers = new Array(quizQuestions.length).fill(null)
  quizStartTime = new Date()

  // Save quiz state
  saveQuizState()

  // Hide start screen and show questions
  document.getElementById("quiz-start").style.display = "none"
  showQuizQuestions()

  // Load first question
  loadQuestion(0)

  // Start timer
  startTimer()
}

function showQuizQuestions() {
  document.getElementById("quiz-questions").style.display = "block"
  document.getElementById("quiz-results").style.display = "none"
}

function loadQuestion(questionIndex) {
  const question = quizQuestions[questionIndex]
  const container = document.getElementById("question-container")

  if (!container || !question) return

  // Update progress
  document.getElementById("current-question").textContent = questionIndex + 1
  document.getElementById("total-questions").textContent = quizQuestions.length

  const progressFill = document.getElementById("quiz-progress-fill")
  if (progressFill) {
    const progress = ((questionIndex + 1) / quizQuestions.length) * 100
    progressFill.style.width = `${progress}%`
  }

  // Create question HTML
  container.innerHTML = `
        <div class="question">
            <h3>Question ${questionIndex + 1}: ${question.question}</h3>
            <ul class="options">
                ${question.options
                  .map(
                    (option, index) => `
                    <li class="option">
                        <label ${quizAnswers[questionIndex] === index ? 'class="selected"' : ""}>
                            <input type="radio" name="question${questionIndex}" value="${index}" 
                                   ${quizAnswers[questionIndex] === index ? "checked" : ""}>
                            ${option}
                        </label>
                    </li>
                `,
                  )
                  .join("")}
            </ul>
        </div>
    `

  // Add event listeners to options
  const radioButtons = container.querySelectorAll('input[type="radio"]')
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      quizAnswers[questionIndex] = Number.parseInt(this.value)
      saveQuizState()

      // Update visual selection
      const labels = container.querySelectorAll("label")
      labels.forEach((label) => label.classList.remove("selected"))
      this.parentElement.classList.add("selected")
    })
  })

  // Update navigation buttons
  updateQuizNavigation()
}

function updateQuizNavigation() {
  const prevBtn = document.getElementById("prev-question")
  const nextBtn = document.getElementById("next-question")
  const submitBtn = document.getElementById("submit-quiz")

  if (prevBtn) prevBtn.disabled = currentQuizQuestion === 0

  if (currentQuizQuestion === quizQuestions.length - 1) {
    if (nextBtn) nextBtn.style.display = "none"
    if (submitBtn) submitBtn.style.display = "inline-block"
  } else {
    if (nextBtn) nextBtn.style.display = "inline-block"
    if (submitBtn) submitBtn.style.display = "none"
  }
}

function nextQuestion() {
  if (currentQuizQuestion < quizQuestions.length - 1) {
    currentQuizQuestion++
    loadQuestion(currentQuizQuestion)
    saveQuizState()
  }
}

function prevQuestion() {
  if (currentQuizQuestion > 0) {
    currentQuizQuestion--
    loadQuestion(currentQuizQuestion)
    saveQuizState()
  }
}

function startTimer() {
  const timeLimit = 15 * 60 // 15 minutes in seconds
  let timeRemaining = timeLimit

  quizTimer = setInterval(() => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60

    const timeDisplay = document.getElementById("time-remaining")
    if (timeDisplay) {
      timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    timeRemaining--

    if (timeRemaining < 0) {
      clearInterval(quizTimer)
      submitQuiz()
    }
  }, 1000)
}

function saveQuizState() {
  const quizState = {
    currentQuestion: currentQuizQuestion,
    answers: quizAnswers,
    startTime: quizStartTime.toISOString(),
  }
  localStorage.setItem("currentQuiz", JSON.stringify(quizState))
}

function submitQuiz() {
  clearInterval(quizTimer)

  // Calculate results
  const correctAnswers = quizAnswers.filter((answer, index) => answer === quizQuestions[index].correctAnswer).length

  const score = Math.round((correctAnswers / quizQuestions.length) * 100)
  const endTime = new Date()
  const timeTaken = Math.floor((endTime - quizStartTime) / 1000)
  const minutes = Math.floor(timeTaken / 60)
  const seconds = timeTaken % 60
  const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`

  // Save to leaderboard
  saveQuizResult({
    name: prompt("Enter your name for the leaderboard:") || "Anonymous",
    score: score,
    correctAnswers: correctAnswers,
    totalQuestions: quizQuestions.length,
    timeTaken: timeString,
    date: new Date().toISOString().split("T")[0],
    badge: getBadge(score, timeTaken),
  })

  // Show results
  showQuizResults(score, correctAnswers, timeString)

  // Clear saved quiz state
  localStorage.removeItem("currentQuiz")
}

function getBadge(score, timeTaken) {
  if (score === 100) return "🎯"
  if (score >= 90) return "🥇"
  if (score >= 70) return "🥈"
  if (score >= 50) return "🥉"
  if (timeTaken < 300) return "⚡" // Under 5 minutes
  return ""
}

function showQuizResults(score, correctAnswers, timeString) {
  document.getElementById("quiz-questions").style.display = "none"
  document.getElementById("quiz-results").style.display = "block"

  // Update score display
  document.getElementById("score-percentage").textContent = `${score}%`
  document.getElementById("correct-answers").textContent = correctAnswers
  document.getElementById("total-answered").textContent = quizQuestions.length
  document.getElementById("time-taken").textContent = timeString

  // Update pass status
  const passStatus = document.getElementById("pass-status")
  if (passStatus) {
    passStatus.textContent = score >= 70 ? "PASSED" : "FAILED"
    passStatus.style.color = score >= 70 ? "var(--success-color)" : "var(--danger-color)"
  }

  // Update score circle
  const scoreCircle = document.querySelector(".score-circle")
  if (scoreCircle) {
    const angle = (score / 100) * 360
    scoreCircle.style.background = `conic-gradient(var(--primary-color) ${angle}deg, var(--bg-tertiary) ${angle}deg)`
  }

  // Show message
  const messageContainer = document.getElementById("results-message")
  if (messageContainer) {
    let message = ""
    if (score === 100) {
      message = "🎉 Perfect score! You're a SQL master!"
    } else if (score >= 90) {
      message = "🌟 Excellent work! You have a strong understanding of SQL."
    } else if (score >= 70) {
      message = "👍 Good job! You passed the quiz."
    } else if (score >= 50) {
      message = "📚 Not bad, but there's room for improvement. Review the lessons and try again."
    } else {
      message = "💪 Keep studying! Review the lessons and practice more."
    }
    messageContainer.innerHTML = `<p>${message}</p>`
  }
}

function retakeQuiz() {
  // Reset quiz state
  currentQuizQuestion = 0
  quizAnswers = []
  quizStartTime = null

  // Show start screen
  document.getElementById("quiz-start").style.display = "block"
  document.getElementById("quiz-questions").style.display = "none"
  document.getElementById("quiz-results").style.display = "none"

  // Clear any saved state
  localStorage.removeItem("currentQuiz")
}

function saveQuizResult(result) {
  const results = JSON.parse(localStorage.getItem("quizResults") || "[]")
  result.id = Date.now() // Simple ID generation
  results.push(result)
  localStorage.setItem("quizResults", JSON.stringify(results))
}

// Leaderboard Page Functions
function initializeLeaderboardPage() {
  loadLeaderboard()
  setupLeaderboardEventListeners()
}

function setupLeaderboardEventListeners() {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const refreshBtn = document.getElementById("refresh-leaderboard")
  const clearScoresBtn = document.getElementById("clear-scores")
  const exportScoresBtn = document.getElementById("export-scores")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      filterLeaderboard(this.dataset.filter)
    })
  })

  if (refreshBtn) refreshBtn.addEventListener("click", loadLeaderboard)
  if (clearScoresBtn) clearScoresBtn.addEventListener("click", clearAllScores)
  if (exportScoresBtn) exportScoresBtn.addEventListener("click", exportScores)
}

function loadLeaderboard() {
  const results = JSON.parse(localStorage.getItem("quizResults") || "[]")

  if (results.length === 0) {
    showEmptyLeaderboard()
    return
  }

  // Sort by score (descending) and then by time (ascending)
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return parseTime(a.timeTaken) - parseTime(b.timeTaken)
  })

  displayLeaderboard(results)
  updateLeaderboardStats(results)
  showPersonalBest(results)
}

function parseTime(timeString) {
  const [minutes, seconds] = timeString.split(":").map(Number)
  return minutes * 60 + seconds
}

function displayLeaderboard(results) {
  const tbody = document.getElementById("leaderboard-tbody")
  const emptyState = document.getElementById("empty-leaderboard")

  if (!tbody) return

  if (results.length === 0) {
    tbody.innerHTML = ""
    if (emptyState) emptyState.style.display = "block"
    return
  }

  if (emptyState) emptyState.style.display = "none"

  tbody.innerHTML = results
    .map((result, index) => {
      const rankClass = index < 3 ? `rank-${index + 1}` : ""
      return `
            <tr class="${rankClass}">
                <td>#${index + 1}</td>
                <td>${result.name}</td>
                <td>${result.score}%</td>
                <td>${result.correctAnswers}/${result.totalQuestions}</td>
                <td>${result.timeTaken}</td>
                <td>${result.date}</td>
                <td>${result.badge}</td>
            </tr>
        `
    })
    .join("")
}

function updateLeaderboardStats(results) {
  const totalParticipants = document.getElementById("total-participants")
  const highestScore = document.getElementById("highest-score")
  const averageScore = document.getElementById("average-score")
  const yourRank = document.getElementById("your-rank")

  if (totalParticipants) totalParticipants.textContent = results.length

  if (results.length > 0) {
    if (highestScore) highestScore.textContent = `${Math.max(...results.map((r) => r.score))}%`
    if (averageScore) {
      const avg = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      averageScore.textContent = `${avg}%`
    }

    // Find user's best rank (simplified - just show best score rank)
    const userResults = results.filter((r) => r.name !== "Anonymous")
    if (userResults.length > 0 && yourRank) {
      const bestUserResult = userResults[0]
      const rank = results.findIndex((r) => r === bestUserResult) + 1
      yourRank.textContent = `#${rank}`
    }
  }
}

function showPersonalBest(results) {
  const personalBestSection = document.getElementById("personal-best-section")
  if (!personalBestSection) return

  // Find user's best result (non-anonymous)
  const userResults = results.filter((r) => r.name !== "Anonymous")
  if (userResults.length === 0) {
    personalBestSection.style.display = "none"
    return
  }

  personalBestSection.style.display = "block"
  const bestResult = userResults[0]
  const rank = results.findIndex((r) => r === bestResult) + 1

  document.getElementById("personal-best-score").textContent = `${bestResult.score}%`
  document.getElementById("personal-best-rank").textContent = `#${rank}`
  document.getElementById("personal-best-date").textContent = bestResult.date
  document.getElementById("personal-best-time").textContent = bestResult.timeTaken

  // Update circle
  const circle = document.querySelector(".best-score-circle")
  if (circle) {
    const angle = (bestResult.score / 100) * 360
    circle.style.background = `conic-gradient(var(--primary-color) ${angle}deg, var(--bg-tertiary) ${angle}deg)`
  }

  // Update improvement message
  const improvementMessage = document.getElementById("improvement-message")
  if (improvementMessage) {
    if (bestResult.score === 100) {
      improvementMessage.textContent = "Perfect score! You've mastered SQL!"
    } else if (bestResult.score >= 90) {
      improvementMessage.textContent = "Excellent work! You're almost at perfection."
    } else {
      improvementMessage.textContent = "Keep practicing to improve your score!"
    }
  }
}

function filterLeaderboard(filter) {
  const results = JSON.parse(localStorage.getItem("quizResults") || "[]")
  let filteredResults = [...results]

  const today = new Date().toISOString().split("T")[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  switch (filter) {
    case "today":
      filteredResults = results.filter((r) => r.date === today)
      break
    case "week":
      filteredResults = results.filter((r) => r.date >= weekAgo)
      break
    case "personal":
      filteredResults = results.filter((r) => r.name !== "Anonymous")
      break
  }

  // Sort filtered results
  filteredResults.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return parseTime(a.timeTaken) - parseTime(b.timeTaken)
  })

  displayLeaderboard(filteredResults)
}

function showEmptyLeaderboard() {
  const emptyState = document.getElementById("empty-leaderboard")
  const tbody = document.getElementById("leaderboard-tbody")

  if (emptyState) emptyState.style.display = "block"
  if (tbody) tbody.innerHTML = ""

  // Reset stats
  document.getElementById("total-participants").textContent = "0"
  document.getElementById("highest-score").textContent = "0%"
  document.getElementById("average-score").textContent = "0%"
  document.getElementById("your-rank").textContent = "-"
}

function clearAllScores() {
  if (confirm("Are you sure you want to clear all quiz scores? This action cannot be undone.")) {
    localStorage.removeItem("quizResults")
    loadLeaderboard()
  }
}

function exportScores() {
  const results = JSON.parse(localStorage.getItem("quizResults") || "[]")
  if (results.length === 0) {
    alert("No scores to export.")
    return
  }

  const csv = [
    ["Rank", "Name", "Score", "Correct Answers", "Total Questions", "Time Taken", "Date", "Badge"],
    ...results.map((result, index) => [
      index + 1,
      result.name,
      `${result.score}%`,
      result.correctAnswers,
      result.totalQuestions,
      result.timeTaken,
      result.date,
      result.badge,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n")

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "sql-quiz-scores.csv"
  a.click()
  URL.revokeObjectURL(url)
}

// Cheatsheet Page Functions
function initializeCheatsheetPage() {
  setupCheatsheetEventListeners()
  setupCopyButtons()
}

function setupCheatsheetEventListeners() {
  const searchInput = document.getElementById("search-input")
  const searchBtn = document.getElementById("search-btn")
  const filterBtns = document.querySelectorAll(".filter-btn")

  if (searchInput) {
    searchInput.addEventListener("input", searchCommands)
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchCommands()
    })
  }

  if (searchBtn) searchBtn.addEventListener("click", searchCommands)

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      filterCommands(this.dataset.category)
    })
  })
}

function setupCopyButtons() {
  const copyBtns = document.querySelectorAll(".copy-btn")
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const command = this.dataset.command
      copyToClipboard(command)
      showCopyNotification()
    })
  })
}

function searchCommands() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase()
  const commandCards = document.querySelectorAll(".command-card")

  commandCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase()
    const description = card.querySelector(".command-description p").textContent.toLowerCase()
    const example = card.querySelector(".command-example code").textContent.toLowerCase()

    const matches = title.includes(searchTerm) || description.includes(searchTerm) || example.includes(searchTerm)

    card.style.display = matches ? "block" : "none"
  })
}

function filterCommands(category) {
  const sections = document.querySelectorAll(".command-section")

  sections.forEach((section) => {
    if (category === "all") {
      section.style.display = "block"
    } else {
      const sectionCategory = section.dataset.category
      section.style.display = sectionCategory === category ? "block" : "none"
    }
  })
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
  }
}

function showCopyNotification() {
  const notification = document.getElementById("copy-notification")
  if (notification) {
    notification.classList.add("show")
    setTimeout(() => {
      notification.classList.remove("show")
    }, 2000)
  }
}

// Authentication + route guard + navbar toggle
const PROTECTED_PAGES = new Set(["lessons.html", "practice.html", "quiz.html", "leaderboard.html"])

function isLoggedIn() {
  try {
    return localStorage.getItem("isLoggedIn") === "true"
  } catch (_) {
    return false
  }
}

function setLoggedIn(value, profile) {
  try {
    if (value) {
      localStorage.setItem("isLoggedIn", "true")
      if (profile && profile.name) localStorage.setItem("userName", profile.name)
      if (profile && profile.email) localStorage.setItem("userEmail", profile.email)
    } else {
      localStorage.clear()
    }
  } catch (_) {}
}

function requireAuthIfProtected() {
  const path = location.pathname.split("/").pop() || "index.html"
  if (PROTECTED_PAGES.has(path) && !isLoggedIn()) {
    location.replace("signin.html")
  }
}

function setupNavbarAuthToggle() {
  const authLink = document.getElementById("auth-link")
  if (!authLink) return

  // reset previous listener
  const newLink = authLink.cloneNode(true)
  authLink.parentNode.replaceChild(newLink, authLink)

  if (isLoggedIn()) {
    newLink.textContent = "Logout"
    newLink.setAttribute("href", "#")
    newLink.addEventListener("click", (e) => {
      e.preventDefault()
      setLoggedIn(false)
      location.href = "index.html"
    })
  } else {
    newLink.textContent = "Sign In"
    newLink.setAttribute("href", "signin.html")
  }
}

function interceptProtectedLinksWhenLoggedOut() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest("a")
    if (!target) return
    const url = target.getAttribute("href") || ""
    const page = url.split("?")[0].split("#")[0]
    if (!isLoggedIn() && PROTECTED_PAGES.has(page)) {
      e.preventDefault()
      location.href = "signin.html"
    }
  })
}

function setupAuthForms() {
  const signinForm = document.getElementById("signin-form")
  if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = (document.getElementById("signin-email") || {}).value || ""
      setLoggedIn(true, { email })
      location.href = "lessons.html"
    })
  }

  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const name = (document.getElementById("signup-name") || {}).value || ""
      const email = (document.getElementById("signup-email") || {}).value || ""
      // password is not validated on purpose (no backend)
      setLoggedIn(true, { name, email })
      location.href = "lessons.html"
    })
  }
}
