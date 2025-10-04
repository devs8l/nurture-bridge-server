/**
 * Service for fetching and processing call summaries
 */

const VAPI_API_BASE = 'https://api.vapi.ai';
const NBT_BACKEND_API = 'https://nbt-backend.vercel.app/api/conversation';
const BEARER_TOKEN = '00ad2e7c-1cde-4b39-867a-7570d3579307';

/**
 * Fetch call data from Vapi API
 * @param {string} callId - The ID of the call to fetch
 * @returns {Promise<Object>} Call data from Vapi API
 */
export async function fetchCallData(callId) {
  try {
    const response = await fetch(`${VAPI_API_BASE}/call/${callId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch call data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching call data:', error);
    throw error;
  }
}

/**
 * Process conversation messages with NBT backend
 * @param {Array} messages - Array of messages from the call
 * @returns {Promise<Object>} Processed conversation data
 */
export async function processConversation(messages) {
  try {
    const response = await fetch(NBT_BACKEND_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Failed to process conversation: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing conversation:', error);
    throw error;
  }
}

/**
 * Get complete call summary by fetching call data and processing it
 * @param {string} callId - The ID of the call to summarize
 * @returns {Promise<Object>} Complete summary with chat segregation and questions mapping
 */
export async function getCallSummary(callId) {
  try {
    // Step 1: Fetch call data from Vapi API
    const callData = await fetchCallData(callId);
    
    // Step 2: Extract messages array
    const messages = callData.messages || [];
    
    if (messages.length === 0) {
      throw new Error('No messages found in call data');
    }

    // Step 3: Process messages with NBT backend
    const processedData = await processConversation(messages);
    
    return {
      success: true,
      callData,
      summary: processedData,
    };
  } catch (error) {
    console.error('Error getting call summary:', error);
    return {
      success: false,
      error: error.message,
      callData: null,
      summary: null,
    };
  }
}