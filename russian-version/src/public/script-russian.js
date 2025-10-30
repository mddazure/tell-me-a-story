class RussianStoryGenerator {
    constructor() {
        this.currentStory = '';
        this.currentTitle = '';
        this.isLoading = false;
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
        
        questions.forEach((question, index) => {
            html += `
                <div class="question-item">
                    <div class="question-number">Вопрос ${index + 1}:</div>
                    <div>${question}</div>
                </div>
            `;
        });
        
        questionsDisplay.innerHTML = html;
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