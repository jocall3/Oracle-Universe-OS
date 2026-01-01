
import React, { useState, useRef, useEffect } from 'react';
import { IAgentMessage, IAgentConfiguration } from '../types';
import { GeminiUniverseService } from '../services/geminiUniverse';

interface ChatWindowProps {
    agent: IAgentConfiguration;
    messages: IAgentMessage[];
    setMessages: React.Dispatch<React.SetStateAction<IAgentMessage[]>>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ agent, messages, setMessages }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: IAgentMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: [{ type: 'text' as any, value: input }],
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const oracle = GeminiUniverseService.getInstance();
            const response = await oracle.converse(
                'main-session',
                agent.agentId,
                messages,
                input,
                agent.persona
            );
            setMessages(prev => [...prev, response]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 relative overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md z-10">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-yellow-500 shadow-xl">
                        <i className={`fa-solid ${agent.icon} text-xl`}></i>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-white">{agent.name}</h2>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">{agent.description}</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-10 space-y-8">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-50">
                        <i className="fa-solid fa-comments text-6xl mb-4"></i>
                        <p className="text-sm">Initiate communication with the Oracle.</p>
                    </div>
                )}
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-5 ${
                            msg.role === 'user' 
                            ? 'bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.2)]' 
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
                        }`}>
                            <div className="flex items-center justify-between mb-2 opacity-50 text-[10px] font-bold uppercase tracking-tighter">
                                <span>{msg.role === 'user' ? 'Direct Input' : agent.name}</span>
                                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed text-sm">
                                {msg.content[0].value as string}
                            </div>
                            {msg.metrics && (
                                <div className="mt-4 pt-4 border-t border-white/10 flex space-x-4 text-[9px] uppercase tracking-widest font-bold opacity-40">
                                    <span>LATENCY: {msg.metrics.latency.totalMs}ms</span>
                                    <span>COMPUTE: {msg.metrics.usage.computeUnits}u</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="px-8 pb-10 pt-4 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Transmit message to the Oracle..."
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl px-6 py-5 pr-16 focus:outline-none focus:border-yellow-500/50 transition-all placeholder:text-zinc-600 shadow-2xl"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-lg"
                    >
                        <i className="fa-solid fa-arrow-up text-lg"></i>
                    </button>
                </div>
                <p className="text-center text-[10px] text-zinc-700 mt-4 tracking-widest uppercase font-bold">
                    Authenticated Universe Stream | Model: Gemini 3 Flash
                </p>
            </div>
        </div>
    );
};

export default ChatWindow;
