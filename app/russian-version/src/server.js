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
КРИТИЧЕСКИ ВАЖНО для форматирования русского текста:
- Используйте ТОЛЬКО печатные буквы кириллицы (не рукописные/курсивные)
- Используйте ПРАВИЛЬНЫЙ регистр: заглавные и строчные буквы (А, а, Б, б, В, в, Г, г, Д, д, Е, е, Ё, ё, Ж, ж, З, з, И, и, Й, й, К, к, Л, л, М, м, Н, н, О, о, П, п, Р, р, С, с, Т, т, У, у, Ф, ф, Х, х, Ц, ц, Ч, ч, Ш, ш, Щ, щ, Ъ, ъ, Ы, ы, Ь, ь, Э, э, Ю, ю, Я, я)
- НЕ ПИШИТЕ ВЕСЬ ТЕКСТ ЗАГЛАВНЫМИ БУКВАМИ
- Используйте заглавные буквы только в начале предложений, для имён собственных и в соответствии с правилами русской орфографии
- Пишите как в обычной книге или газете

Создайте естественный русский текст с правильной грамматикой и лексикой, подходящей для изучающих русский язык.
`;

// Story generation endpoint
app.post('/api/generate-story', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    
    if (!openAIClient) {
      console.error('OpenAI client not initialized');
      return res.status(500).json({ error: 'OpenAI client not initialized' });
    }

    const { proficiency, theme, wordCount } = req.body;
    
    if (!proficiency || !theme || !wordCount) {
      console.error('Missing required parameters:', { proficiency, theme, wordCount });
      return res.status(400).json({ error: 'Missing required parameters: proficiency, theme, wordCount' });
    }
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
- Используйте ТОЛЬКО печатные буквы кириллицы (не рукописные/курсивные)
- Используйте правильный регистр: заглавные буквы в начале слов заголовка, строчные внутри слов
- НЕ ПИШИТЕ ВЕСЬ ЗАГОЛОВОК ЗАГЛАВНЫМИ БУКВАМИ
- Пишите как обычный заголовок в русской книге или газете
- Заголовок должен быть на русском языке`;

    // Generate story
    const storyResponse = await openAIClient.getChatCompletions(
      deploymentName,
      [
        { role: 'system', content: `Вы профессиональный преподаватель русского языка, создающий учебные материалы. 

${russianInstructions}

ОБЯЗАТЕЛЬНО пишите рассказ с правильным использованием заглавных и строчных букв, как в обычной русской книге. НЕ используйте только заглавные буквы.` },
        { role: 'user', content: userPrompt }
      ],
      {
        maxTokens: Math.max(800, Math.floor(wordCount * 1.5)),
        temperature: 0.8
      }
    );

    const story = storyResponse.choices[0].message.content;

    // Generate title
    const titlePrompt = `Создайте короткий заголовок для этого рассказа (2-4 слова на русском языке):

${story}

${russianInstructions}`;

    const titleResponse = await openAIClient.getChatCompletions(
      deploymentName,
      [
        { role: 'system', content: titleSystemMessage },
        { role: 'user', content: titlePrompt }
      ],
      {
        maxTokens: 20,
        temperature: 0.7
      }
    );

    const title = titleResponse.choices[0].message.content.replace(/[""«»]/g, '').trim();

    res.json({ 
      story: story.trim(),
      title: title
    });

  } catch (error) {
    console.error('Error generating story:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to generate story', details: error.message });
  }
});

// Questions generation endpoint
app.post('/api/generate-questions', async (req, res) => {
  try {
    console.log('Received questions request body:', req.body);
    
    if (!openAIClient) {
      console.error('OpenAI client not initialized for questions');
      return res.status(500).json({ error: 'OpenAI client not initialized' });
    }

    const { story, type } = req.body;
    
    if (!story || !type) {
      console.error('Missing required parameters for questions:', { story: !!story, type });
      return res.status(400).json({ error: 'Missing required parameters: story, type' });
    }
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';

    let systemMessage = '';
    let userPrompt = '';

    if (type === 'comprehension') {
      systemMessage = `Вы преподаватель русского языка. Создайте 5 вопросов на понимание прочитанного текста на русском языке с вариантами ответов. 

${russianInstructions}

ОБЯЗАТЕЛЬНО пишите вопросы с правильным использованием заглавных и строчных букв.`;
      userPrompt = `На основе этого рассказа создайте 5 вопросов на понимание содержания с множественным выбором. Каждый вопрос должен иметь 4 варианта ответа (А, Б, В, Г). Вопросы должны быть на русском языке и проверять понимание сюжета, персонажей и деталей:

${story}

${russianInstructions}

Формат для каждого вопроса:
1. [Вопрос]
   А) [Вариант ответа]
   Б) [Вариант ответа]
   В) [Вариант ответа]
   Г) [Вариант ответа]

Создайте только один правильный ответ для каждого вопроса, остальные должны быть правдоподобными, но неверными.`;
    } else {
      systemMessage = `Вы преподаватель русской грамматики. Создайте 5 грамматических вопросов на основе текста на русском языке с вариантами ответов. 

${russianInstructions}

ОБЯЗАТЕЛЬНО пишите вопросы с правильным использованием заглавных и строчных букв.`;
      userPrompt = `На основе этого рассказа создайте 5 грамматических упражнений с множественным выбором. Каждый вопрос должен иметь 4 варианта ответа (А, Б, В, Г). Сосредоточьтесь на падежах, временах глаголов, согласовании и других аспектах русской грамматики:

${story}

${russianInstructions}

Формат для каждого вопроса:
1. [Грамматический вопрос]
   А) [Вариант ответа]
   Б) [Вариант ответа]
   В) [Вариант ответа]
   Г) [Вариант ответа]

Создайте только один правильный ответ для каждого вопроса, остальные должны быть грамматически правдоподобными, но неверными.`;
    }

    const response = await openAIClient.getChatCompletions(
      deploymentName,
      [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userPrompt }
      ],
      {
        maxTokens: 1200,
        temperature: 0.7
      }
    );

    const questionsText = response.choices[0].message.content;
    
    // Parse questions with multiple choice options
    const questionBlocks = questionsText
      .split(/\d+\./)
      .slice(1)
      .map(block => block.trim())
      .filter(block => block.length > 0);

    const questions = questionBlocks.map(block => {
      // Split each block into question and options
      const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (lines.length === 0) return null;
      
      // First line is the question
      const question = lines[0];
      
      // Remaining lines are the options (А), Б), В), Г))
      const options = lines.slice(1).filter(line => /^[АБВГабвг]\)/.test(line));
      
      // If we have options, format as multiple choice
      if (options.length >= 4) {
        return {
          question: question,
          options: options,
          type: 'multiple-choice'
        };
      } else {
        // Fallback to simple question format if parsing fails
        return {
          question: block,
          type: 'open-ended'
        };
      }
    }).filter(q => q !== null);

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