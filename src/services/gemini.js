/**
 * Fast, Robust Client-Side Service for Google Gemini API
 *
 * Implements Batch & Buffer MCQ Generation:
 * 1. Generates batches of 5 questions in a single request (~2-3s total).
 * 2. Queries ModelService.ListModels to use confirmed active 'flash' model.
 * 3. 12-second timeout per batch request via AbortController.
 * 4. Resilient JSON array parsing with fallback to plain JSON.
 */

const STORAGE_KEY = 'gemini_student_api_key';
let discoveredModelsCache = null;

/**
 * Fetch wrapper with strict AbortController timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000}s.`);
    }
    throw err;
  }
}

/**
 * Fetches the list of models that support generateContent for this API key
 */
async function getWorkingModels(apiKey) {
  if (discoveredModelsCache && discoveredModelsCache.length > 0) {
    return discoveredModelsCache;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetchWithTimeout(url, { method: 'GET' }, 8000);

  if (!res.ok) {
    const errJson = await res.json().catch(() => null);
    throw new Error(
      errJson?.error?.message || `Failed to verify API key models (HTTP ${res.status})`
    );
  }

  const data = await res.json();
  const rawModels = data?.models || [];

  const generateModels = rawModels.filter((m) =>
    m.supportedGenerationMethods?.includes('generateContent')
  );

  if (generateModels.length === 0) {
    throw new Error('Your API key does not have access to any generateContent models.');
  }

  // Sort priority: 'flash' models first (fastest)
  generateModels.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    const aFlash = aName.includes('flash') ? -10 : 0;
    const bFlash = bName.includes('flash') ? -10 : 0;

    const aVer = aName.includes('2.0') ? -5 : aName.includes('1.5') ? -2 : 0;
    const bVer = bName.includes('2.0') ? -5 : bName.includes('1.5') ? -2 : 0;

    return aFlash + aVer - (bFlash + bVer);
  });

  discoveredModelsCache = generateModels.map((m) => m.name);
  return discoveredModelsCache;
}

/**
 * Validates a Gemini API Key
 */
export async function validateGeminiKey(apiKey) {
  const cleanKey = (apiKey || localStorage.getItem(STORAGE_KEY))?.trim();
  if (!cleanKey) {
    throw new Error('API key cannot be empty.');
  }

  discoveredModelsCache = null;
  const models = await getWorkingModels(cleanKey);
  return models[0] || 'models/gemini-1.5-flash-latest';
}

/**
 * Generates a batch of MCQs (default: 5) in a single API call for buffering
 */
export async function generateBatchMcqs({
  apiKey,
  topic,
  difficulty = 'intermediate',
  count = 5,
  previousQuestions = [],
}) {
  const cleanKey = (apiKey || localStorage.getItem(STORAGE_KEY))?.trim();
  if (!cleanKey) {
    throw new Error('Missing Gemini API Key. Please click "Connect API Key" in the top bar.');
  }

  let availableModels;
  try {
    availableModels = await getWorkingModels(cleanKey);
  } catch (err) {
    console.warn('Could not query model list, using standard fallbacks:', err.message);
    availableModels = [
      'models/gemini-1.5-flash-latest',
      'models/gemini-1.5-flash',
      'models/gemini-2.0-flash-exp',
      'models/gemini-pro',
    ];
  }

  const pastQuestionsList = previousQuestions
    .slice(-20)
    .map((q, idx) => `${idx + 1}. ${typeof q === 'string' ? q : q.question}`)
    .join('\n');

  const promptText = `
You are a Senior Technical Hiring Manager and Engineering Mentor conducting campus placement and fresher interviews.
Create a batch of exactly ${count} distinct, HIGH-YIELD TECHNICAL INTERVIEW MCQs specifically for FRESHERS and BEGINNERS who recently started learning ${topic}.

Topic: ${topic}
Interview Difficulty Level: ${difficulty.toUpperCase()}

CORE OBJECTIVE - MOST-ASKED FRESHER INTERVIEW QUESTIONS:
Generate ONLY the most critical, foundational, and frequently asked interview questions that tech companies, MNCs, and startups ask candidates in fresher/junior screening rounds:
- Prioritize core concepts, basic syntax, output-prediction questions, and foundational differences that every beginner is expected to know:
  * For JavaScript: '==' vs '===', var vs let vs const, hoisting, closures, event loop, data types, array methods (map/filter/reduce), typeof null/NaN, truthy vs falsy.
  * For HTML: Semantic elements (<section> vs <div>), <!DOCTYPE>, block vs inline elements, form controls, meta tags, alt attribute.
  * For CSS: Box model (margin/padding/border), display: none vs visibility: hidden, Flexbox alignment, position (static/relative/absolute/fixed), rem vs em vs px.
  * For React.js: State vs props, rules of hooks, useState hook basics, Virtual DOM concept, component lifecycle, why keys are needed in lists.
  * For Java: 4 pillars of OOP, == vs .equals(), method overloading vs overriding, String immutability, final vs finally, basic JVM memory.
  * For Python: Mutable vs immutable, list vs tuple, slice notation [::-1], dictionary operations, indentation rules, range() function.
  * For SQL: PRIMARY KEY vs UNIQUE, WHERE vs HAVING, INNER vs LEFT JOIN, DELETE vs TRUNCATE vs DROP, basic aggregations (COUNT, SUM, AVG).
  (If the topic is another subject, select the equivalent top 20 most frequent interview screening questions asked to freshers).

Guidelines for EACH question:
1. Provide a crisp, realistic interview question stem or a short code snippet to evaluate (e.g. "What will be the output of the following code?", or "In a technical interview, you are asked about the difference between...").
2. Format all code snippets cleanly using proper markdown code blocks with language tags (e.g. \`\`\`javascript ... \`\`\` or \`\`\`python ... \`\`\`).
3. For inline identifiers, keywords, or variable names, wrap them in backticks like \`const\`, \`useState()\`, \`SELECT\`.
4. Provide exactly 4 realistic, distinct options (array of 4 strings). Do NOT prefix options with "A)", "B)", etc.
5. Exactly ONE option must be correct. The other 3 options should be common beginner misconceptions or frequent mistakes freshers make.
6. "correctIndex" must be the 0-based integer index (0, 1, 2, or 3) of the correct option.
7. "explanation" should be an educational interview breakdown: clearly explain the correct answer, why it is an interview favorite, and the key takeaway so the learner never forgets it.
8. "hint" should be a 1-sentence helpful clue or interview tip without directly revealing the answer.
${
  pastQuestionsList
    ? `\nIMPORTANT - Do NOT repeat or closely rephrase any of these previously asked questions in this session:\n${pastQuestionsList}\n`
    : ''
}

Respond ONLY with a valid JSON array of ${count} questions matching this schema:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctIndex": 0,
    "explanation": "string",
    "hint": "string"
  }
]
`.trim();

  let lastError = null;

  for (const modelPath of availableModels.slice(0, 4)) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${cleanKey}`;

    // Attempt 1: Structured JSON Array Schema
    try {
      const response = await fetchWithTimeout(
        endpoint,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'ARRAY',
                description: `Array of ${count} multiple-choice questions`,
                items: {
                  type: 'OBJECT',
                  properties: {
                    question: { type: 'STRING' },
                    options: {
                      type: 'ARRAY',
                      items: { type: 'STRING' },
                    },
                    correctIndex: { type: 'INTEGER' },
                    explanation: { type: 'STRING' },
                    hint: { type: 'STRING' },
                  },
                  required: ['question', 'options', 'correctIndex', 'explanation'],
                },
              },
            },
          }),
        },
        12000
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const questions = parseBatchMcqsJson(candidateText);
          if (questions.length > 0) {
            return questions;
          }
        }
      }

      // If structured array schema failed (e.g. 400 error on older models), attempt plain JSON
      if (response.status === 400) {
        const plainResponse = await fetchWithTimeout(
          endpoint,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${promptText}\n\nIMPORTANT: Return ONLY a raw JSON array of objects. Do not include markdown codeblocks or extra text.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
              },
            }),
          },
          12000
        );

        if (plainResponse.ok) {
          const plainData = await plainResponse.json();
          const plainText = plainData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (plainText) {
            const questions = parseBatchMcqsJson(plainText);
            if (questions.length > 0) {
              return questions;
            }
          }
        }
      }

      const errJson = await response.json().catch(() => null);
      const rawMessage = errJson?.error?.message || '';

      if (
        response.status === 429 ||
        rawMessage.toLowerCase().includes('quota') ||
        rawMessage.toLowerCase().includes('resource_exhausted')
      ) {
        lastError = new Error(
          'Gemini Free Quota Reached (HTTP 429). Please wait ~60 seconds for the rate limit to reset, or click "Gemini Key" in the top bar to connect another free API key.'
        );
      } else {
        lastError = new Error(
          rawMessage || `Model ${modelPath} failed (${response.status})`
        );
      }
    } catch (err) {
      lastError = err;
      console.warn(`Batch generation with ${modelPath} failed:`, err.message);
    }
  }

  throw new Error(
    lastError?.message ||
      'Failed to generate questions. Please check your API key or click "Try Again".'
  );
}

/**
 * Legacy wrapper: generates a single MCQ
 */
export async function generateSingleMcq(params) {
  const batch = await generateBatchMcqs({ ...params, count: 1 });
  return batch[0];
}

/**
 * Robust JSON parser for an array of MCQs
 */
function parseBatchMcqsJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('AI returned an empty response.');
  }

  let cleaned = rawText.trim();

  // Strip code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // Look for JSON array bounds [ ... ]
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');

  let parsed;
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const arrayStr = cleaned.substring(firstBracket, lastBracket + 1);
    try {
      parsed = JSON.parse(arrayStr);
    } catch {
      // If array parse failed, attempt to parse raw
    }
  }

  // If array parsing didn't work, attempt object parsing (in case model returned single object)
  if (!parsed) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const singleObj = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
        parsed = [singleObj];
      } catch {
        throw new Error('Failed to parse question data.');
      }
    }
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('AI returned an invalid question list.');
  }

  // Validate and sanitize each question item
  const validQuestions = [];
  for (const item of parsed) {
    if (!item?.question || !Array.isArray(item?.options) || item.options.length !== 4) {
      continue;
    }

    const correctIndex = Number(item.correctIndex);
    if (isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      continue;
    }

    validQuestions.push({
      id: `mcq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      question: item.question,
      options: item.options.map((opt) => String(opt).trim()),
      correctIndex: correctIndex,
      explanation: item.explanation || 'No explanation provided.',
      hint: item.hint || null,
    });
  }

  if (validQuestions.length === 0) {
    throw new Error('None of the generated questions met formatting standards.');
  }

  return validQuestions;
}
