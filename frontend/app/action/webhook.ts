'use server';

import { takeoffFetch } from "@/utils/fetch";
import { BACKEND_URL } from "../constants";

export async function registerWebhook(webhookUrl: string) {
  const response = await takeoffFetch(`${BACKEND_URL}/api/webhook-register`, {
    method: 'POST',
    body: JSON.stringify({ webhookUrl }),
  });
  const data = await response.json();
  return data;
}

export async function getWebhookList() {
  const response = await takeoffFetch(`${BACKEND_URL}/api/webhook-list`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

export async function deleteWebhookUrl(id: string) {
  const response = await takeoffFetch(`${BACKEND_URL}/api/webhook-delete`, {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
  const data = await response.json();
  return data;
}
