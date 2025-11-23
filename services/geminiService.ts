import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Role } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là HV AI, một trợ lý sức khỏe ảo chuyên nghiệp, tận tâm và thân thiện.
Nhiệm vụ của bạn là hỗ trợ người dùng giải đáp các thắc mắc liên quan đến sức khỏe, dinh dưỡng, tập luyện thể thao và lối sống lành mạnh.

NGUYÊN TẮC QUAN TRỌNG:
1. Bạn KHÔNG PHẢI là bác sĩ. Luôn đưa ra lời khuyên dựa trên kiến thức y khoa tổng quát đã được kiểm chứng.
2. Với các triệu chứng bệnh lý cụ thể hoặc nghiêm trọng, bạn PHẢI khuyên người dùng đi khám bác sĩ chuyên khoa. Không được tự ý kê đơn thuốc hay chẩn đoán bệnh thay cho bác sĩ.
3. Giọng điệu: Ân cần, lịch sự, tích cực và dễ hiểu.
4. Trả lời bằng Tiếng Việt.
5. Sử dụng định dạng Markdown để câu trả lời rõ ràng (in đậm, danh sách, tiêu đề).
`;

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please set process.env.API_KEY");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const createChatSession = (): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string): Promise<AsyncIterable<string>> => {
  try {
    const resultStream = await chat.sendMessageStream({ message });
    
    // Generator function to yield text chunks
    async function* streamGenerator() {
      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    }

    return streamGenerator();
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};
