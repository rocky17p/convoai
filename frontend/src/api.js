const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function register(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function fetchConversations(userId) {
  const response = await fetch(`${API_BASE_URL}/chat/conversations/${userId}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return response.json();
}

export async function createConversation(userId, title, type, task = 'general') {
  const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ userId, title, type, task }),
  });
  return response.json();
}

export async function sendMessage(conversationId, sender, text) {
  const response = await fetch(`${API_BASE_URL}/chat/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ conversationId, sender, text }),
  });
  return response.json();
}

export async function handleVoiceMessage(userId, text) {
  const response = await fetch(`${API_BASE_URL}/chat/voice-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ userId, text }),
  });
  return response.json();
}

// New API functions for agents
export async function fetchAgents() {
  const response = await fetch(`${API_BASE_URL}/agents`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function createAgent(agent) {
  const response = await fetch(`${API_BASE_URL}/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(agent),
  });
  return response.json();
}

export async function updateAgent(id, agent) {
  const response = await fetch(`${API_BASE_URL}/agents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(agent),
  });
  return response.json();
}

export async function deleteAgent(id) {
  const response = await fetch(`${API_BASE_URL}/agents/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
}

// New API functions for analytics
export async function fetchAnalytics(startDate, endDate) {
  let url = `${API_BASE_URL}/analytics`;
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return response.json();
}


