import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Booking } from "@/types";

// Initialize Gemini Client
// Access API key from environment variable
const getApiKey = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable exposed via next.config
    return process.env.GEMINI_API_KEY;
  } else {
    // Server-side: use environment variable directly
    return process.env.GEMINI_API_KEY;
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() || '' });

const MODEL_NAME = 'gemini-3-pro-preview';

/**
 * Creates a new chat session with context about the specific booking.
 */
export const createBookingChatSession = (booking: Booking): Chat => {
  const systemInstruction = `
You are a helpful, friendly, and professional customer support AI agent for "Modern Utility".
You are currently assisting a customer with their booking, Reference #${booking.ref}.

Here are the details of the booking you are discussing:
- Service: ${booking.title}
- Status: ${booking.status}
- Date: ${booking.fullDate}
- Address: ${booking.address}
- Technician: ${booking.technician.name}

Your goal is to answer questions about this booking, provide status updates (simulated), 
and generally assist the user. Keep your responses concise and helpful. 
If the user asks to reschedule, politely inform them that they need to call the office 
but you can mark it as 'requested'.
  `;

  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction,
    },
  });
};

/**
 * Sends a message to the chat session and returns a stream.
 */
export const sendMessageStream = async (chat: Chat, message: string) => {
  return await chat.sendMessageStream({ message });
};

