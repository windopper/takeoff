'use server';

export async function registerWebhook(webhookUrl: string) {
  const response = await fetch(`https://takeoff-backend.kamilereon.workers.dev/api/webhook-register`, {
    method: 'POST',
    body: JSON.stringify({ webhookUrl }),
  });
  const data = await response.json();
  return data;
}
