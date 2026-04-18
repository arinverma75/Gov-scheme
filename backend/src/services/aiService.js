import { SchemeModel } from '../models/db.js';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are "SahayakAI", a friendly and knowledgeable AI assistant for the Indian Government Scheme Awareness Platform. 

Your role is to:
1. Help citizens understand government schemes in simple language
2. Answer questions about eligibility, benefits, and application processes
3. Respond in the same language the user writes in (Hindi or English)
4. Be empathetic, patient, and clear — many users may have limited education
5. Always provide accurate information based on the scheme data provided
6. If you don't know something, say so honestly and suggest visiting the official website
7. Use bullet points and simple formatting for clarity
8. Include relevant scheme names and links when discussing specific schemes

Important guidelines:
- Never make up scheme details that aren't in your context
- Always mention official websites for verification
- Be encouraging and supportive
- Use ₹ symbol for Indian currency
- Explain technical terms in simple language`;

// Demo responses when no API key is configured
const DEMO_RESPONSES = {
  default: `🙏 Namaste! I'm **SahayakAI**, your Government Scheme Assistant.

I can help you with:
• 🔍 **Find schemes** matching your profile
• 📋 **Understand eligibility** criteria
• 📝 **Application process** guidance
• 📄 **Document requirements** for any scheme
• 🗺️ **State-specific** scheme information

Try asking me something like:
- "What schemes are available for farmers?"
- "Tell me about PM Kisan Yojana"
- "मुझे महिलाओं के लिए योजनाओं के बारे में बताइए"
- "How to apply for Ayushman Bharat?"`,

  greeting: `🙏 Namaste! Welcome to the Government Scheme Awareness Platform!

I'm **SahayakAI**, and I'm here to help you discover government schemes you're eligible for.

How can I help you today? You can ask me in **Hindi** or **English**! 😊`,
};

function findRelevantSchemes(query) {
  const q = query.toLowerCase();
  const keywords = q.split(/\s+/).filter(w => w.length > 2);
  
  const results = SchemeModel.findAll({ limit: 50 });
  const schemes = results.schemes;

  return schemes
    .map(scheme => {
      let relevance = 0;
      const searchText = `${scheme.name} ${scheme.nameHindi} ${scheme.description} ${scheme.category} ${scheme.tags.join(' ')}`.toLowerCase();
      
      keywords.forEach(kw => {
        if (searchText.includes(kw)) relevance++;
      });

      // Boost for category matches
      if (q.includes('farmer') || q.includes('कृषि') || q.includes('किसान')) {
        if (scheme.category === 'Agriculture') relevance += 3;
      }
      if (q.includes('education') || q.includes('शिक्षा') || q.includes('scholarship') || q.includes('छात्रवृत्ति')) {
        if (scheme.category === 'Education') relevance += 3;
      }
      if (q.includes('health') || q.includes('स्वास्थ्य') || q.includes('medical') || q.includes('hospital')) {
        if (scheme.category === 'Health') relevance += 3;
      }
      if (q.includes('women') || q.includes('महिला') || q.includes('girl') || q.includes('बालिका')) {
        if (scheme.category === 'Women & Child') relevance += 3;
      }
      if (q.includes('housing') || q.includes('आवास') || q.includes('house') || q.includes('घर')) {
        if (scheme.category === 'Housing') relevance += 3;
      }
      if (q.includes('business') || q.includes('loan') || q.includes('ऋण') || q.includes('startup')) {
        if (scheme.category === 'Business & Entrepreneurship') relevance += 3;
      }
      if (q.includes('pension') || q.includes('पेंशन') || q.includes('retirement')) {
        if (scheme.category === 'Pension & Social Security') relevance += 3;
      }
      if (q.includes('skill') || q.includes('कौशल') || q.includes('training')) {
        if (scheme.category === 'Skill Development') relevance += 3;
      }
      if (q.includes('employment') || q.includes('रोजगार') || q.includes('job') || q.includes('naukri')) {
        if (scheme.category === 'Employment') relevance += 3;
      }

      return { ...scheme, relevance };
    })
    .filter(s => s.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);
}

function generateDemoResponse(query) {
  const q = query.toLowerCase();

  // Greeting detection
  if (q.match(/^(hi|hello|hey|namaste|namaskar|नमस्ते|हेलो|sathya)/)) {
    return DEMO_RESPONSES.greeting;
  }

  // Find relevant schemes
  const relevant = findRelevantSchemes(query);

  if (relevant.length === 0) {
    return `I understand you're asking about "${query}". 

While I couldn't find an exact match in our database, here are some suggestions:

1. 🔍 Try using the **Scheme Explorer** to browse all ${SchemeModel.findAll({limit: 1}).total} available schemes
2. ✅ Use the **Eligibility Checker** to find schemes matching your profile
3. 📱 Try different keywords or ask in Hindi/English

Would you like me to help you with something specific? For example:
- "Show me schemes for students"
- "What schemes are available in my state?"
- "How can I apply for housing scheme?"`;
  }

  let response = `Based on your query, here are the most relevant schemes:\n\n`;

  relevant.forEach((scheme, idx) => {
    response += `### ${idx + 1}. ${scheme.name}\n`;
    response += `${scheme.nameHindi ? `*${scheme.nameHindi}*\n` : ''}`;
    response += `📂 **Category:** ${scheme.category}\n`;
    response += `💰 **Benefits:** ${scheme.benefits}\n`;
    response += `📋 **Status:** ${scheme.status}\n`;
    response += `🔗 [Official Website](${scheme.officialLink})\n\n`;
  });

  response += `\n---\n💡 *For detailed eligibility and application process, click on any scheme name or ask me a specific question!*`;

  return response;
}

export async function getChatResponse(message, chatHistory = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key, use demo mode
  if (!apiKey) {
    const response = generateDemoResponse(message);
    return { response, mode: 'demo' };
  }

  // Find relevant schemes for context (RAG)
  const relevantSchemes = findRelevantSchemes(message);
  const context = relevantSchemes.map(s => 
    `Scheme: ${s.name} (${s.nameHindi})\nCategory: ${s.category}\nBenefits: ${s.benefits}\nEligibility: Age ${s.eligibility.minAge}-${s.eligibility.maxAge}, Income up to ₹${s.eligibility.maxIncome}, States: ${s.eligibility.states.join(', ')}\nDocuments: ${s.requiredDocuments.join(', ')}\nApply: ${s.applicationProcess}\nLink: ${s.officialLink}`
  ).join('\n\n');

  const contents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT + '\n\nRelevant scheme context:\n' + context }]
    },
    ...chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })),
    {
      role: 'user',
      parts: [{ text: message }]
    }
  ];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1024
        }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return { 
        response: data.candidates[0].content.parts[0].text,
        mode: 'ai'
      };
    }

    // Fallback to demo if API fails
    return { response: generateDemoResponse(message), mode: 'demo' };
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return { response: generateDemoResponse(message), mode: 'demo' };
  }
}
