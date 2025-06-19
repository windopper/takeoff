'use server';

import { takeoffFetch } from "@/utils/fetch";

export async function registerWebhook(webhookUrl: string) {
  const response = await takeoffFetch(`https://takeoff-backend.kamilereon.workers.dev/api/webhook-register`, {
    method: 'POST',
    body: JSON.stringify({ webhookUrl }),
  });
  const data = await response.json();
  return data;
}

export async function getWebhookList() {
  const response = await takeoffFetch(`https://takeoff-backend.kamilereon.workers.dev/api/webhook-list`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

export async function deleteWebhookUrl(id: string) {
  const response = await takeoffFetch(`https://takeoff-backend.kamilereon.workers.dev/api/webhook-delete`, {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
  const data = await response.json();
  return data;
}
