const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { OpenAIClient } = require('@azure/openai');
const { DefaultAzureCredential, ManagedIdentityCredential } = require('@azure/identity');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Azure OpenAI client setup
let openAIClient;

function initializeOpenAIClient() {
  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    
    if (!endpoint) {
      throw new Error('AZURE_OPENAI_ENDPOINT environment variable is required');
    }

    if (apiKey) {
      // Use API Key authentication
      const { AzureKeyCredential } = require('@azure/core-auth');
      openAIClient = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
      console.log('Azure OpenAI client initialized successfully with API key');
    } else {
      // Fall back to Managed Identity in production (Azure App Service)
      const credential = process.env.AZURE_CLIENT_ID ? 
        new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID) : 
        new DefaultAzureCredential();
      
      openAIClient = new OpenAIClient(endpoint, credential);
      console.log('Azure OpenAI client initialized successfully with managed identity');
    }

    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
    console.log(`Using deployment: ${deploymentName}`);

  } catch (error) {
    console.error('Failed to initialize Azure OpenAI client:', error.message);
  }
}

// Initialize the OpenAI client
initializeOpenAIClient();

// Enhanced Russian language instructions with explicit character requirements
const russianInstructions = `
ВАЖНО: Используйте ТОЛЬКО печатные буквы кириллицы (А, Б, В, Г, Д, Е, Ё, Ж, З, И, Й, К, Л, М, Н, О, П, Р, С, Т, У, Ф, Х, Ц, Ч, Ш, Щ, Ъ, Ы, Ь, Э, Ю, Я), НЕ используйте рукописные/прописные символы.

Создайте естественный русский текст с правильной грамматикой и лексикой, подходящей для изучающих русский язык.
`;

// Story generation endpoint
app.post('/api/generate-story', async (req, res) => {
  try {
    if (!openAIClient) {
      return res.status(500).json({ error: 'OpenAI client not initialized' });
    }

    const { proficiency, theme, wordCount } = req.body;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';

    // Create Russian-specific prompts
    const userPrompt = `Напишите увлекательный рассказ на русском языке:

Уровень: ${proficiency}
Тема: ${theme}
Длина: примерно ${wordCount} слов

${russianInstructions}

Создайте интересную историю с диалогами и описаниями, подходящую для уровня ${proficiency}.`;

    const titleSystemMessage = `Вы профессиональный преподаватель русского языка. Создайте КОРОТКИЙ заголовок (2-4 слова) для рассказа на русском языке.

КРИТИЧЕСКИ ВАЖНО для русского языка: 
- Используйте ТОЛЬКО печатные буквы кириллицы: А, Б, В, Г, Д, Е, Ё, Ж, З, И, Й, К, Л, М, Н, О, П, Р, С, Т, У, Ф, Х, Ц, Ч, Ш, Щ, Ъ, Ы, Ь, Э, Ю, Я
- НЕ используйте рукописные/прописные/курсивные символы
- Заголовок должен быть на русском языке`;

    // Generate story
    const storyResponse = await openAIClient.getChatCompletions(deploymentName, {
      messages: [
        { role: 'system', content: `Вы профессиональный преподаватель русского языка, создающий учебные материалы. ${russianInstructions}` },
        { role: 'user', content: userPrompt }
      ],
      maxTokens: Math.max(800, Math.floor(wordCount * 1.5)),
      temperature: 0.8
    });

    const story = storyResponse.choices[0].message.content;

    // Generate title
    const titlePrompt = `Создайте короткий заголовок для этого рассказа (2-4 слова на русском языке):

${story}

${russianInstructions}`;

    const titleResponse = await openAIClient.getChatCompletions(deploymentName, {
      messages: [
        { role: 'system', content: titleSystemMessage },
        { role: 'user', content: titlePrompt }
      ],
      maxTokens: 20,
      temperature: 0.7
    });

    const title = titleResponse.choices[0].message.content.replace(/[""«»]/g, '').trim();

    res.json({ 
      story: story.trim(),
      title: title
    });

  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

// Questions generation endpoint
app.post('/api/generate-questions', async (req, res) => {
  try {
    if (!openAIClient) {
      return res.status(500).json({ error: 'OpenAI client not initialized' });
    }

    const { story, type } = req.body;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';

    let systemMessage = '';
    let userPrompt = '';

    if (type === 'comprehension') {
      systemMessage = `Вы преподаватель русского языка. Создайте 5 вопросов на понимание прочитанного текста на русском языке. ${russianInstructions}`;
      userPrompt = `На основе этого рассказа создайте 5 вопросов на понимание содержания. Вопросы должны быть на русском языке и проверять понимание сюжета, персонажей и деталей:

${story}

${russianInstructions}

Формат: просто пронумерованные вопросы без дополнительных инструкций.`;
    } else {
      systemMessage = `Вы преподаватель русской грамматики. Создайте 5 грамматических вопросов на основе текста на русском языке. ${russianInstructions}`;
      userPrompt = `На основе этого рассказа создайте 5 грамматических упражнений. Сосредоточьтесь на падежах, временах глаголов, согласовании и других аспектах русской грамматики:

${story}

${russianInstructions}

Формат: просто пронумерованные вопросы без дополнительных инструкций.`;
    }

    const response = await openAIClient.getChatCompletions(deploymentName, {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userPrompt }
      ],
      maxTokens: 600,
      temperature: 0.7
    });

    const questionsText = response.choices[0].message.content;
    const questions = questionsText
      .split(/\d+\./)
      .slice(1)
      .map(q => q.trim())
      .filter(q => q.length > 0);

    res.json({ questions });

  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Скажи мне рассказ - Russian Story Generator'
  });
});

// Serve the Russian-only app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`🇷🇺 Скажи мне рассказ server running at http://localhost:${port}`);
  console.log(`Russian language learning stories with Azure OpenAI integration`);
});