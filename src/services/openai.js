const SYSTEM_PROMPT = `You are a career coach helping a student write a follow-up email for a job application.

Write a professional, warm follow-up email that:
1. Is concise (under 150 words)
2. References specific details when available
3. Reiterates interest without being desperate
4. Includes a clear call-to-action
5. Matches the tone to the situation:
   - Fresh (< 1 week): Enthusiastic check-in
   - Warming (1-2 weeks): Polite inquiry
   - Cold (2-3 weeks): Direct but professional
   - Ghosted (3+ weeks): Final attempt, graceful

Return only the email body, no subject line.`;

const INTERVIEW_PREP_SYSTEM_PROMPT = `You are an interview coach.
Generate a concise prep brief for a student. Include:
1) 5 likely interview questions tailored to company + role
2) 3 talking points the candidate should emphasize
3) 2 smart questions to ask the interviewer
4) a 45-second pitch they can practice
Keep output under 350 words.`;

const getToneHint = (ghostProbability) => {
  if (ghostProbability < 25) return 'Enthusiastic check-in';
  if (ghostProbability < 50) return 'Polite inquiry';
  if (ghostProbability < 80) return 'Direct but professional';
  return 'Final attempt, graceful';
};

async function chat(messages, temperature = 0.7) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_API_KEY. Add it to your .env file to enable AI features.');
  }

export async function generateFollowUpEmail(application, ghostMeta) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_API_KEY. Add it to your .env file to enable AI email generation.');
  }

  const userPrompt = `Context:\n- Company: ${application.company}\n- Role: ${application.role}\n- Days since applied: ${ghostMeta.daysSinceApplied}\n- Days since last activity: ${ghostMeta.daysSinceLastActivity}\n- Current status: ${application.status}\n- Notes: ${application.notes || 'N/A'}\n- Preferred tone: ${getToneHint(ghostMeta.ghostProbability)}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 400,
      temperature
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error('OpenAI request failed. Check API key and quota.');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || 'Unable to generate content right now.';
}

export async function generateFollowUpEmail(application, ghostMeta) {
  const userPrompt = `Context:\n- Company: ${application.company}\n- Role: ${application.role}\n- Days since applied: ${ghostMeta.daysSinceApplied}\n- Days since last activity: ${ghostMeta.daysSinceLastActivity}\n- Current status: ${application.status}\n- Notes: ${application.notes || 'N/A'}\n- Preferred tone: ${getToneHint(ghostMeta.ghostProbability)}`;

  return chat(
    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    0.7
  );
}

export async function generateInterviewPrep(application, ghostMeta) {
  const prompt = `Company: ${application.company}\nRole: ${application.role}\nStatus: ${application.status}\nDays since activity: ${ghostMeta?.daysSinceLastActivity ?? 'unknown'}\nCandidate notes: ${application.notes || 'N/A'}`;

  return chat(
    [
      { role: 'system', content: INTERVIEW_PREP_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    0.6
  );
  return data.choices?.[0]?.message?.content?.trim() || 'Unable to generate email right now.';
}
