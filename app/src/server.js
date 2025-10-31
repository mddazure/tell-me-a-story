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
  } catch (error) {
    console.error('Failed to initialize Azure OpenAI client:', error.message);
  }
}

// Initialize the client
initializeOpenAIClient();

// API Routes
app.post('/api/generate-story', async (req, res) => {
  try {
    const { language, proficiency, theme, wordCount } = req.body;
    
    // Validate input
    if (!language || !proficiency || !theme || !wordCount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const validProficiency = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (!validProficiency.includes(proficiency.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid proficiency level' });
    }
    
    if (wordCount < 50 || wordCount > 1000) {
      return res.status(400).json({ error: 'Word count must be between 50 and 1000' });
    }
    
    // Add special instructions for Russian language
    const russianInstructions = language.toLowerCase() === 'russian' ? 
      ' IMPORTANT: Use ONLY standard typed Cyrillic characters (печатные буквы), NOT handwritten/cursive characters (прописные буквы). Use the standard computer keyboard Cyrillic alphabet like: А, Б, В, Г, Д, Е, Ё, Ж, З, И, Й, К, Л, М, Н, О, П, Р, С, Т, У, Ф, Х, Ц, Ч, Ш, Щ, Ъ, Ы, Ь, Э, Ю, Я and their lowercase equivalents.' : '';
    
    const storyPrompt = `Generate a short story in ${language} at ${proficiency.toUpperCase()} proficiency level about the theme: ${theme}. The story should be approximately ${wordCount} words long. Make it engaging and appropriate for language learners at this level. Include vocabulary and cultural context related to ${theme} that would be interesting for learners.${russianInstructions}`;
    
    const titlePrompt = `Generate a creative and descriptive title in ${language} for a ${language} story about ${theme} at ${proficiency.toUpperCase()} level. The title should be engaging and hint at the story's content. Keep it under 60 characters and appropriate for ${proficiency.toUpperCase()} language learners.${russianInstructions}`;
    
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
    console.log(`Using deployment: ${deploymentName}`);
    
    // Generate the story
    const storyResponse = await openAIClient.getChatCompletions(
      deploymentName,
      [
        {
          role: 'system',
          content: 'You are a language learning assistant that creates engaging stories for language learners at different proficiency levels.'
        },
        {
          role: 'user',
          content: storyPrompt
        }
      ],
      {
        maxTokens: Math.min(wordCount * 2, 2000),
        temperature: 0.7,
        topP: 0.9
      }
    );
    
    // Generate the title
    const titleSystemMessage = language.toLowerCase() === 'russian' ? 
      'You are a creative title generator for language learning stories. Generate concise, engaging titles. For Russian text, use ONLY standard typed Cyrillic characters (печатные буквы), never handwritten/cursive forms (прописные буквы).' :
      'You are a creative title generator for language learning stories. Generate concise, engaging titles. Use ONLY standard typed Cyrillic characters (печатные буквы), never handwritten/cursive forms (прописные буквы).';
    
    const titleResponse = await openAIClient.getChatCompletions(
      deploymentName,
      [
        {
          role: 'system',
          content: titleSystemMessage
        },
        {
          role: 'user',
          content: titlePrompt
        }
      ],
      {
        maxTokens: 50,
        temperature: 0.8,
        topP: 0.9
      }
    );
    
    const story = storyResponse.choices[0]?.message?.content;
    const title = titleResponse.choices[0]?.message?.content?.replace(/['"]/g, '').trim();
    
    if (!story) {
      throw new Error('No story generated');
    }
    
    res.json({ 
      story,
      title: title || `${theme} Story in ${language}`
    });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story. Please try again.' });
  }
});

app.post('/api/generate-questions', async (req, res) => {
  try {
    const { story, language, questionType } = req.body;
    
    // Validate input
    if (!story || !language || !questionType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    if (!['comprehension', 'grammar'].includes(questionType)) {
      return res.status(400).json({ error: 'Invalid question type' });
    }
    
    let prompt;
    if (questionType === 'comprehension') {
      prompt = `Based on this ${language} story, create 5 multiple-choice comprehension questions in English. Each question should have 4 options (A, B, C, D) with one correct answer. Focus on understanding the plot, characters, and main ideas. Format as JSON with this structure: {"questions": [{"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "correct": "A"}]}

Story: ${story}`;
    } else {
      prompt = `Based on this ${language} story, create 5 multiple-choice grammar questions in English about the grammar structures used in the story. Each question should have 4 options (A, B, C, D) with one correct answer. Focus on verb tenses, sentence structure, and other grammatical elements present in the text. Format as JSON with this structure: {"questions": [{"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "correct": "A"}]}

Story: ${story}`;
    }
    
    const response = await openAIClient.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
      [
        {
          role: 'system',
          content: 'You are a language learning assistant that creates educational questions for language learners. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      {
        maxTokens: 1500,
        temperature: 0.5,
        responseFormat: { type: 'json_object' }
      }
    );
    
    const questionsText = response.choices[0]?.message?.content;
    if (!questionsText) {
      throw new Error('No questions generated');
    }
    
    const questions = JSON.parse(questionsText);
    res.json(questions);
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions. Please try again.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    openai_client: !!openAIClient 
  });
});

// Serve the single page application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});