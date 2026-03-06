import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const SYSTEM_PROMPT = `Du bist ein freundlicher und kompetenter KI-Assistent von "Deine Chance e.V." – einem Verein, der deutschsprachige Menschen bei der Auswanderung in die Schweiz unterstützt.

Deine Aufgabe:
- Beantworte Fragen rund um die Auswanderung von Deutschland/Österreich in die Schweiz
- Themen: Jobsuche, Wohnungssuche, Aufenthaltsbewilligung (B/C/L), Krankenversicherung, Bankkonto, Steuern, Umzug, Zoll, Integration, Familiennachzug, Schulsystem, Sozialversicherung (AHV/IV/BVG), 3-Säulen-System
- Antworte immer auf Deutsch
- Sei präzise, hilfreich und ermutigend
- Verweise bei rechtlichen Detailfragen darauf, dass du keine Rechtsberatung gibst und empfehle offizielle Stellen (z.B. Migrationsamt, Gemeinde)
- Halte Antworten kompakt (max. 3-4 Absätze)
- Du darfst keine Themen außerhalb der Schweiz-Auswanderung beantworten – leite höflich zurück zum Thema`;

export default async function handler(req, res) {
  // CORS – www und non-www
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    process.env.ALLOWED_ORIGIN || 'https://deinechance24.org',
    'https://www.deinechance24.org',
  ];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Env vars check
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY ist nicht konfiguriert');
    return res.status(500).json({ error: 'KI-System nicht konfiguriert. Bitte kontaktiere den Support.' });
  }
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase Env-Vars fehlen');
    return res.status(500).json({ error: 'Server-Konfiguration unvollständig.' });
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Auth check
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Nicht autorisiert – kein Token' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return res.status(401).json({ error: 'Sitzung ungültig. Bitte erneut anmelden.' });
    }

    // Parse messages
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Keine Nachrichten gesendet.' });
    }

    // Trim to last 20 messages
    const trimmed = messages.slice(-20).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content || '').slice(0, 2000),
    }));

    // Call Claude
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: trimmed,
    });

    const reply = response.content?.[0]?.text || 'Entschuldigung, ich konnte keine Antwort generieren.';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);

    if (err.status === 429) {
      return res.status(429).json({ error: 'Zu viele Anfragen. Bitte warte einen Moment.' });
    }

    return res.status(500).json({
      error: 'Antwort konnte nicht generiert werden. Bitte versuche es erneut.',
    });
  }
}
