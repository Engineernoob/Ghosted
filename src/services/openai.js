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

const getToneHint = (ghostProbability) => {
  if (ghostProbability < 25) return 'Enthusiastic check-in';
  if (ghostProbability < 50) return 'Polite inquiry';
  if (ghostProbability < 80) return 'Direct but professional';
  return 'Final attempt, graceful';
};

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
  return data.choices?.[0]?.message?.content?.trim() || 'Unable to generate email right now.';
}
