// Elements
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('upload-section');
const actionBar = document.getElementById('action-bar');
const selectedFilename = document.getElementById('selected-filename');
const removeFileBtn = document.getElementById('remove-file');
const analyzeBtn = document.getElementById('analyze-btn');

const loadingSection = document.getElementById('loading-section');
const loadingText = document.getElementById('loading-text');
const loadingProgress = document.getElementById('loading-progress');

const resultsSection = document.getElementById('results-section');
const finalScoreEl = document.getElementById('final-score');
const scoreRadialMeter = document.querySelector('.radial-progress .meter');
const scoreMessage = document.getElementById('score-message');
const skillsList = document.getElementById('skills-list');
const suggestionsList = document.getElementById('suggestions-list');
const improvementsList = document.getElementById('improvements-list');
const resetBtn = document.getElementById('reset-btn');

let currentFile = null;

// --- Drag & Drop Handlers ---
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropzone.addEventListener(eventName, () => dropzone.classList.add('drag-active'), false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, () => dropzone.classList.remove('drag-active'), false);
});

dropzone.addEventListener('drop', handleDrop, false);
dropzone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length) handleFiles(files[0]);
}

function handleFileSelect(e) {
  if (this.files.length) handleFiles(this.files[0]);
}

function handleFiles(file) {
  currentFile = file;
  selectedFilename.textContent = file.name;
  dropzone.classList.add('hidden');
  actionBar.classList.remove('hidden');
}

removeFileBtn.addEventListener('click', () => {
  currentFile = null;
  fileInput.value = '';
  actionBar.classList.add('hidden');
  dropzone.classList.remove('hidden');
});

// --- Analysis Simulation ---
analyzeBtn.addEventListener('click', async () => {
  if (!currentFile) return;

  // Show loading
  uploadSection.classList.add('hidden');
  loadingSection.classList.remove('hidden');

  // Simulated Progress Steps
  const steps = [
    { text: "Extracting resume text...", duration: 800, progress: 20 },
    { text: "Analyzing semantic keywords...", duration: 1200, progress: 45 },
    { text: "Evaluating ATS compatibility...", duration: 1500, progress: 75 },
    { text: "Generating final insights...", duration: 1000, progress: 100 }
  ];

  for (let i = 0; i < steps.length; i++) {
    loadingText.textContent = steps[i].text;
    loadingProgress.style.width = steps[i].progress + '%';
    await new Promise(r => setTimeout(r, steps[i].duration));
  }

  // Mock Result Data
  const mockResult = {
    score: 88,
    message: "Excellent! Your resume is highly optimized for modern ATS systems.",
    skills: ["React.js", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "UI/UX", "System Design"],
    strengths: [
      "Strong use of action verbs in recent roles.",
      "Clear, quantifiable metrics for project impacts.",
      "Excellent formatting and whitespace distribution."
    ],
    improvements: [
      "Expand on your system design experience in the 'Experience' section.",
      "Add a link to your live portfolio or GitHub repository.",
      "Reduce the length of the 'Summary' section to make it punchier."
    ]
  };

  showResults(mockResult);
});

// --- Display Results ---
function showResults(data) {
  loadingSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');

  // Populate Skills
  skillsList.innerHTML = '';
  data.skills.forEach(skill => {
    const span = document.createElement('span');
    span.className = 'skill-tag';
    span.textContent = skill;
    skillsList.appendChild(span);
  });

  // Populate Strengths
  suggestionsList.innerHTML = '';
  data.strengths.forEach(strength => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${strength}</span>`;
    suggestionsList.appendChild(li);
  });

  // Populate Improvements
  improvementsList.innerHTML = '';
  data.improvements.forEach(improvement => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${improvement}</span>`;
    improvementsList.appendChild(li);
  });

  scoreMessage.textContent = data.message;

  // Animate Score
  animateScore(data.score);
}

function animateScore(targetScore) {
  let currentScore = 0;
  const duration = 2000; // ms
  const intervalTime = 20;
  const step = targetScore / (duration / intervalTime);

  // SVG circle length calculation (r=45)
  // Circumference = 2 * Math.PI * 45 = 282.74
  const circumference = 283;
  
  // Set final stroke dashoffset
  const offset = circumference - (targetScore / 100) * circumference;
  
  // Trigger CSS transition for meter
  setTimeout(() => {
    scoreRadialMeter.style.strokeDashoffset = offset;
  }, 100);

  // Animate number
  const timer = setInterval(() => {
    currentScore += step;
    if (currentScore >= targetScore) {
      currentScore = targetScore;
      clearInterval(timer);
    }
    finalScoreEl.textContent = Math.round(currentScore);
  }, intervalTime);
}

// --- Reset ---
resetBtn.addEventListener('click', () => {
  resultsSection.classList.add('hidden');
  loadingProgress.style.width = '0%';
  
  currentFile = null;
  fileInput.value = '';
  actionBar.classList.add('hidden');
  dropzone.classList.remove('hidden');
  
  uploadSection.classList.remove('hidden');
  
  // Reset score meter
  scoreRadialMeter.style.strokeDashoffset = 283;
});
