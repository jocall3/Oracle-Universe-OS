
import { GoogleGenAI } from "@google/genai";
import { 
    IAgentMessage, 
    IContentPart, 
    Modality, 
    IUsageMetrics, 
    ILatencyMetrics, 
    IAuditLogEntry,
    AgentID,
    UserID
} from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export class AuditLogManager {
    private static logs: IAuditLogEntry[] = [];
    
    public static log(entry: Omit<IAuditLogEntry, 'logId' | 'timestamp'>) {
        const fullEntry: IAuditLogEntry = {
            logId: `audit-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            ...entry
        };
        this.logs.unshift(fullEntry);
        if (this.logs.length > 100) this.logs.pop();
    }

    public static getLogs() {
        return this.logs;
    }
}

export class GeminiUniverseService {
    private static instance: GeminiUniverseService;
    private defaultModel = 'gemini-3-flash-preview';

    public static getInstance() {
        if (!this.instance) this.instance = new GeminiUniverseService();
        return this.instance;
    }

    private constructor() {}

    public async converse(
        sessionId: string,
        agentId: AgentID,
        history: IAgentMessage[],
        userInput: string,
        persona: string
    ): Promise<IAgentMessage> {
        const startTime = Date.now();
        
        AuditLogManager.log({
            actor: 'user',
            action: 'send_message',
            target: `Agent:${agentId}`,
            outcome: 'success',
            details: userInput.substring(0, 50)
        });

        try {
            // Construct contents for Gemini API
            const contents = history.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: msg.content.map(part => ({ text: typeof part.value === 'string' ? part.value : JSON.stringify(part.value) }))
            }));

            // Add system instruction as part of the first message context if needed, 
            // but for simplicity we'll use it in the prompt or config.
            
            const response = await ai.models.generateContent({
                model: this.defaultModel,
                contents: [
                    ...contents,
                    { role: 'user', parts: [{ text: `[System Persona: ${persona}]\nUser: ${userInput}` }] }
                ],
                config: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 64,
                }
            });

            const endTime = Date.now();
            const latencyMs = endTime - startTime;
            const text = response.text || "The Oracle remains silent.";

            const result: IAgentMessage = {
                id: `msg-${Math.random().toString(36).substr(2, 9)}`,
                role: 'assistant',
                content: [{ type: Modality.Text, value: text }],
                timestamp: new Date().toISOString(),
                agentId,
                modelUsed: this.defaultModel,
                metrics: {
                    latency: {
                        totalMs: latencyMs,
                        apiCallMs: latencyMs * 0.8, // Approximation
                        processingMs: latencyMs * 0.2
                    },
                    usage: {
                        inputTokens: userInput.length / 4, // Estimate
                        outputTokens: text.length / 4, // Estimate
                        costUsd: 0.0001,
                        computeUnits: 1
                    }
                }
            };

            AuditLogManager.log({
                actor: agentId,
                action: 'generate_response',
                target: 'user',
                outcome: 'success',
                details: text.substring(0, 50)
            });

            return result;
        } catch (error: any) {
            AuditLogManager.log({
                actor: 'system',
                action: 'api_call',
                target: 'gemini-api',
                outcome: 'failure',
                details: error.message
            });
            throw error;
        }
    }
}
