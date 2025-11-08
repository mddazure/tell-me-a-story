class RussianStoryGenerator {
    constructor() {
        this.currentStory = '';
        this.currentTitle = '';
        this.currentQuestions = null;
        this.currentQuestionType = null;
        this.isLoading = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Check answers button
        document.getElementById('checkAnswersBtn').addEventListener('click', () => {
            this.checkAnswers();
        });

        // New quiz button
        document.getElementById('newQuizBtn').addEventListener('click', () => {
            this.showNewQuizOptions();
        });
    }

    async generateStory() {
        if (this.isLoading) return;

        const proficiency = document.getElementById('proficiency').value;
        const theme = document.getElementById('theme').value;
        const wordCount = document.getElementById('wordCount').value;

        const button = document.querySelector('.generate-btn');
        const storySection = document.getElementById('storySection');
        const storyTitle = document.getElementById('storyTitle');
        const storyContent = document.getElementById('storyContent');
        const questionsDisplay = document.getElementById('questionsDisplay');

        try {
            this.isLoading = true;
            button.disabled = true;
            button.textContent = 'Создаём рассказ...';
            
            // Hide previous content
            storySection.classList.remove('show');
            questionsDisplay.classList.remove('show');

            const response = await fetch('/api/generate-story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    proficiency,
                    theme,
                    wordCount: parseInt(wordCount)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            this.currentStory = data.story;
            this.currentTitle = data.title || 'Рассказ';
            
            storyTitle.textContent = this.currentTitle;
            storyContent.textContent = this.currentStory;
            storySection.classList.add('show');

        } catch (error) {
            console.error('Error generating story:', error);
            this.showError('Произошла ошибка при создании рассказа. Пожалуйста, попробуйте ещё раз.');
        } finally {
            this.isLoading = false;
            button.disabled = false;
            button.textContent = 'Создать рассказ';
        }
    }

    async generateQuestions(type) {
        if (!this.currentStory || this.isLoading) return;

        const questionsDisplay = document.getElementById('questionsDisplay');
        const button = event.target;
        const originalText = button.textContent;

        try {
            this.isLoading = true;
            button.disabled = true;
            button.textContent = 'Загружаем...';
            
            questionsDisplay.innerHTML = '<div class="loading">Создаём вопросы...</div>';
            questionsDisplay.classList.add('show');

            const response = await fetch('/api/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    story: this.currentStory,
                    type
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.currentQuestions = data.questions;
            this.currentQuestionType = type;
            this.displayQuestions(data.questions, type);

        } catch (error) {
            console.error('Error generating questions:', error);
            questionsDisplay.innerHTML = '<div class="error">Произошла ошибка при создании вопросов. Пожалуйста, попробуйте ещё раз.</div>';
        } finally {
            this.isLoading = false;
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    displayQuestions(questions, type) {
        const questionsDisplay = document.getElementById('questionsDisplay');
        const typeTitle = type === 'comprehension' ? 'Вопросы на понимание' : 'Грамматические вопросы';
        
        let html = `<h4 style="color: #495057; margin-bottom: 15px;">${typeTitle}</h4>`;
        
        questions.forEach((questionObj, index) => {
            if (questionObj.options && typeof questionObj.options === 'object') {
                // New JSON format with options object
                html += `
                    <div class="question">
                        <h3>${index + 1}. ${questionObj.question}</h3>
                        <div class="options">
                `;
                
                Object.entries(questionObj.options).forEach(([key, value]) => {
                    html += `
                        <label class="option">
                            <input type="radio" name="question${index}" value="${key}">
                            <span><strong>${key}:</strong> ${value}</span>
                        </label>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            } else if (typeof questionObj === 'string') {
                // Old format - simple question
                html += `
                    <div class="question-item">
                        <div class="question-number">Вопрос ${index + 1}:</div>
                        <div>${questionObj}</div>
                    </div>
                `;
            } else if (questionObj.type === 'multiple-choice' && Array.isArray(questionObj.options)) {
                // Old text format with array options
                html += `
                    <div class="question-item multiple-choice">
                        <div class="question-number">Вопрос ${index + 1}:</div>
                        <div class="question-text">${questionObj.question}</div>
                        <div class="options">
                `;
                
                questionObj.options.forEach(option => {
                    html += `<div class="option">${option}</div>`;
                });
                
                html += `
                        </div>
                    </div>
                `;
            } else {
                // Fallback for other formats
                html += `
                    <div class="question-item">
                        <div class="question-number">Вопрос ${index + 1}:</div>
                        <div>${questionObj.question || questionObj}</div>
                    </div>
                `;
            }
        });
        
        questionsDisplay.innerHTML = html;
        
        // Show/hide control buttons
        document.getElementById('checkAnswersBtn').style.display = 'inline-block';
        document.getElementById('newQuizBtn').style.display = 'none';
        document.getElementById('resultsDisplay').style.display = 'none';
    }

    checkAnswers() {
        if (!this.currentQuestions) return;
        
        let correctCount = 0;
        const questions = document.querySelectorAll('.question');
        
        questions.forEach((questionDiv, index) => {
            const selectedOption = questionDiv.querySelector('input[type="radio"]:checked');
            const correctAnswer = this.currentQuestions[index].correct;
            const options = questionDiv.querySelectorAll('.option');
            
            // Reset option styles
            options.forEach(option => {
                option.classList.remove('correct', 'incorrect', 'correct-answer');
            });
            
            if (selectedOption) {
                const selectedValue = selectedOption.value;
                const selectedOptionElement = selectedOption.closest('.option');
                
                if (selectedValue === correctAnswer) {
                    selectedOptionElement.classList.add('correct');
                    correctCount++;
                } else {
                    selectedOptionElement.classList.add('incorrect');
                    // Highlight the correct answer
                    options.forEach(option => {
                        const input = option.querySelector('input[type="radio"]');
                        if (input && input.value === correctAnswer) {
                            option.classList.add('correct-answer');
                        }
                    });
                }
            } else {
                // No answer selected, just highlight the correct answer
                options.forEach(option => {
                    const input = option.querySelector('input[type="radio"]');
                    if (input && input.value === correctAnswer) {
                        option.classList.add('correct-answer');
                    }
                });
            }
        });
        
        this.displayResults(correctCount, this.currentQuestions.length);
    }

    displayResults(correctCount, totalCount) {
        const resultsDisplay = document.getElementById('resultsDisplay');
        const percentage = Math.round((correctCount / totalCount) * 100);
        
        let scoreClass = 'poor';
        let message = 'Продолжайте изучение!';
        
        if (percentage >= 90) {
            scoreClass = 'excellent';
            message = 'Отличная работа! 🎉';
        } else if (percentage >= 70) {
            scoreClass = 'good';
            message = 'Хорошо сделано! 👏';
        } else if (percentage >= 50) {
            scoreClass = 'fair';
            message = 'Неплохая попытка! 👍';
        }
        
        resultsDisplay.innerHTML = `
            <div class="score ${scoreClass}">
                ${correctCount}/${totalCount} (${percentage}%)
            </div>
            <p>${message}</p>
        `;
        
        resultsDisplay.style.display = 'block';
        document.getElementById('checkAnswersBtn').style.display = 'none';
        document.getElementById('newQuizBtn').style.display = 'inline-block';
    }

    showNewQuizOptions() {
        // Reset questions display
        document.getElementById('questionsDisplay').innerHTML = '';
        document.getElementById('resultsDisplay').style.display = 'none';
        document.getElementById('checkAnswersBtn').style.display = 'none';
        document.getElementById('newQuizBtn').style.display = 'none';
        
        // Reset current questions
        this.currentQuestions = null;
        this.currentQuestionType = null;
    }

    showError(message) {
        const storySection = document.getElementById('storySection');
        const storyContent = document.getElementById('storyContent');
        
        storyContent.innerHTML = `<div class="error">${message}</div>`;
        storySection.classList.add('show');
    }
}

// Initialize the story generator
const storyGenerator = new RussianStoryGenerator();

// Global function for the button onclick
function generateStory() {
    storyGenerator.generateStory();
}

function generateQuestions(type) {
    storyGenerator.generateQuestions(type);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        generateStory();
    }
});

// Add form validation feedback and event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for buttons
    const generateBtn = document.getElementById('generateBtn');
    const comprehensionBtn = document.getElementById('comprehensionBtn');
    const grammarBtn = document.getElementById('grammarBtn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateStory);
    }
    
    if (comprehensionBtn) {
        comprehensionBtn.addEventListener('click', () => generateQuestions('comprehension'));
    }
    
    if (grammarBtn) {
        grammarBtn.addEventListener('click', () => generateQuestions('grammar'));
    }
    
    // Form validation feedback
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            this.style.borderColor = '#28a745';
            setTimeout(() => {
                this.style.borderColor = '#e9ecef';
            }, 1000);
        });
    });
});