class StoryGenerator {
    constructor() {
        this.currentStory = null;
        this.currentLanguage = null;
        this.currentQuestions = null;
        this.currentQuestionType = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Word count slider
        const wordCountSlider = document.getElementById('wordCount');
        const wordCountValue = document.getElementById('wordCountValue');
        
        wordCountSlider.addEventListener('input', (e) => {
            wordCountValue.textContent = e.target.value;
        });

        // Story form submission
        document.getElementById('storyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateStory();
        });

        // Question buttons
        document.getElementById('comprehensionBtn').addEventListener('click', () => {
            this.generateQuestions('comprehension');
        });

        document.getElementById('grammarBtn').addEventListener('click', () => {
            this.generateQuestions('grammar');
        });

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
        const form = document.getElementById('storyForm');
        const formData = new FormData(form);
        
        const language = formData.get('language') || document.getElementById('language').value;
        const proficiency = formData.get('proficiency') || document.getElementById('proficiency').value;
        const theme = formData.get('theme') || document.getElementById('theme').value;
        const wordCount = parseInt(document.getElementById('wordCount').value);

        if (!language || !proficiency || !theme) {
            this.showError('Please select language, proficiency level, and theme.');
            return;
        }

        this.showLoading('generateBtn');
        this.hideError();

        try {
            const response = await fetch('/api/generate-story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language,
                    proficiency,
                    theme,
                    wordCount
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate story');
            }

            const data = await response.json();
            this.currentStory = data.story;
            this.currentLanguage = language;
            this.currentTitle = data.title;
            
            this.displayStory(data.story, data.title);
            this.hideSection('questionsSection');
            
        } catch (error) {
            console.error('Error generating story:', error);
            this.showError(error.message || 'Failed to generate story. Please try again.');
        } finally {
            this.hideLoading('generateBtn');
        }
    }

    async generateQuestions(questionType) {
        if (!this.currentStory) {
            this.showError('Please generate a story first.');
            return;
        }

        const buttonId = questionType === 'comprehension' ? 'comprehensionBtn' : 'grammarBtn';
        this.showLoading(buttonId);
        this.hideError();

        try {
            const response = await fetch('/api/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    story: this.currentStory,
                    language: this.currentLanguage,
                    questionType
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate questions');
            }

            const data = await response.json();
            this.currentQuestions = data.questions;
            this.currentQuestionType = questionType;
            
            this.displayQuestions(data.questions, questionType);
            
        } catch (error) {
            console.error('Error generating questions:', error);
            this.showError(error.message || 'Failed to generate questions. Please try again.');
        } finally {
            this.hideLoading(buttonId);
        }
    }

    displayStory(story, title) {
        const storyContent = document.getElementById('storyContent');
        const storySection = document.getElementById('storySection');
        const storyTitle = document.getElementById('storyTitle');
        
        // Update the title
        if (storyTitle) {
            storyTitle.textContent = title || 'Your Story';
        }
        
        storyContent.textContent = story;
        storySection.style.display = 'block';
        storySection.classList.add('fade-in');
        
        // Scroll to story section
        storySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    displayQuestions(questions, questionType) {
        const questionsSection = document.getElementById('questionsSection');
        const questionsTitle = document.getElementById('questionsTitle');
        const questionsContent = document.getElementById('questionsContent');
        
        questionsTitle.textContent = questionType === 'comprehension' ? 
            '🧠 Comprehension Questions' : '📝 Grammar Questions';
        
        questionsContent.innerHTML = '';
        
        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.innerHTML = `
                <h3>${index + 1}. ${q.question}</h3>
                <div class="options">
                    ${Object.entries(q.options).map(([key, value]) => `
                        <label class="option">
                            <input type="radio" name="question${index}" value="${key}">
                            <span><strong>${key}:</strong> ${value}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            questionsContent.appendChild(questionDiv);
        });
        
        // Reset results and buttons
        document.getElementById('resultsContent').style.display = 'none';
        document.getElementById('checkAnswersBtn').style.display = 'block';
        document.getElementById('newQuizBtn').style.display = 'none';
        
        questionsSection.style.display = 'block';
        questionsSection.classList.add('fade-in');
        
        // Scroll to questions section
        questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                        if (input.value === correctAnswer) {
                            option.classList.add('correct-answer');
                        }
                    });
                }
            } else {
                // No answer selected, just highlight the correct answer
                options.forEach(option => {
                    const input = option.querySelector('input[type="radio"]');
                    if (input.value === correctAnswer) {
                        option.classList.add('correct-answer');
                    }
                });
            }
        });
        
        this.displayResults(correctCount, this.currentQuestions.length);
    }

    displayResults(correctCount, totalCount) {
        const resultsContent = document.getElementById('resultsContent');
        const percentage = Math.round((correctCount / totalCount) * 100);
        
        let scoreClass = 'poor';
        let message = 'Keep practicing!';
        
        if (percentage >= 90) {
            scoreClass = 'excellent';
            message = 'Excellent work! 🎉';
        } else if (percentage >= 70) {
            scoreClass = 'good';
            message = 'Well done! 👏';
        } else if (percentage >= 50) {
            scoreClass = 'fair';
            message = 'Good effort! 👍';
        }
        
        resultsContent.innerHTML = `
            <div class="score ${scoreClass}">
                ${correctCount}/${totalCount} (${percentage}%)
            </div>
            <p>${message}</p>
        `;
        
        resultsContent.style.display = 'block';
        document.getElementById('checkAnswersBtn').style.display = 'none';
        document.getElementById('newQuizBtn').style.display = 'block';
        
        // Scroll to results
        resultsContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showNewQuizOptions() {
        // Hide current questions and show story section
        document.getElementById('questionsSection').style.display = 'none';
        document.getElementById('storySection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showLoading(buttonId) {
        const button = document.getElementById(buttonId);
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner');
        
        button.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'block';
    }

    hideLoading(buttonId) {
        const button = document.getElementById(buttonId);
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner');
        
        button.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }

    hideSection(sectionId) {
        document.getElementById(sectionId).style.display = 'none';
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StoryGenerator();
});

// Add some visual feedback for form interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth focus transitions for form elements
    const formElements = document.querySelectorAll('select, input[type="range"]');
    formElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.transform = 'scale(1.02)';
            element.style.transition = 'transform 0.2s ease';
        });
        
        element.addEventListener('blur', () => {
            element.style.transform = 'scale(1)';
        });
    });
});