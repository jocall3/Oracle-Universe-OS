
export type UserID = string;
export type SessionID = string;
export type AgentID = string;
export type ModelIdentifier = string;
export type ToolIdentifier = string;

export interface IUsageMetrics {
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
    computeUnits: number;
}

export interface ILatencyMetrics {
    totalMs: number;
    apiCallMs: number;
    processingMs: number;
}

export interface IErrorDetail {
    code: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

export enum Modality {
    Text = "text",
    Image = "image",
    Code = "code",
    Programmatic = "programmatic"
}

export interface IContentPart {
    type: Modality;
    value: string | object;
    mimeType?: string;
    description?: string;
}

export interface IAgentMessage {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: IContentPart[];
    timestamp: string;
    agentId?: AgentID;
    modelUsed?: ModelIdentifier;
    metrics?: {
        latency: ILatencyMetrics;
        usage: IUsageMetrics;
    };
}

export interface IAuditLogEntry {
    logId: string;
    timestamp: string;
    actor: string;
    action: string;
    target: string;
    outcome: 'success' | 'failure';
    details: string;
}

export interface IAgentConfiguration {
    agentId: AgentID;
    name: string;
    description: string;
    persona: string;
    icon: string;
}
