
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatWindow from './components/ChatWindow';
import LogViewer from './components/LogViewer';
import { AGENTS } from './constants';
import { IAgentMessage, IAuditLogEntry, IAgentConfiguration } from './types';
import { AuditLogManager } from './services/geminiUniverse';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedAgent, setSelectedAgent] = useState<IAgentConfiguration>(AGENTS[0]);
    const [messages, setMessages] = useState<IAgentMessage[]>([]);
    const [logs, setLogs] = useState<IAuditLogEntry[]>([]);

    useEffect(() => {
        // Poll for logs every second
        const interval = setInterval(() => {
            setLogs([...AuditLogManager.getLogs()]);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard logs={logs} />;
            case 'agents':
                return (
                    <div className="h-full flex flex-col md:flex-row bg-zinc-950 overflow-hidden">
                        <div className="w-full md:w-80 border-r border-zinc-900 bg-zinc-950 flex flex-col">
                            <div className="p-8 border-b border-zinc-900">
                                <h2 className="text-xl font-bold text-white mb-1">Agents</h2>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Select Active Personality</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {AGENTS.map((agent) => (
                                    <button
                                        key={agent.agentId}
                                        onClick={() => setSelectedAgent(agent)}
                                        className={`w-full text-left p-5 rounded-3xl border transition-all duration-300 ${
                                            selectedAgent.agentId === agent.agentId
                                            ? 'bg-zinc-900 border-yellow-500/50 shadow-xl'
                                            : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                                                selectedAgent.agentId === agent.agentId ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-500'
                                            }`}>
                                                <i className={`fa-solid ${agent.icon}`}></i>
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{agent.name}</div>
                                                <div className="text-[10px] text-zinc-500 line-clamp-1">{agent.description}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1">
                            <ChatWindow 
                                agent={selectedAgent} 
                                messages={messages} 
                                setMessages={setMessages} 
                            />
                        </div>
                    </div>
                );
            case 'logs':
                return <LogViewer logs={logs} />;
            case 'metrics':
                return (
                    <div className="h-full flex items-center justify-center bg-zinc-950 text-zinc-600">
                        <div className="text-center">
                            <i className="fa-solid fa-microscope text-6xl mb-4 block"></i>
                            <h2 className="text-2xl font-bold mb-2">Deep Telemetry Pending</h2>
                            <p className="max-w-md mx-auto">Accessing low-level hardware counters requires higher level of authorization. Consult System Administrator.</p>
                        </div>
                    </div>
                );
            default:
                return <Dashboard logs={logs} />;
        }
    };

    return (
        <div className="flex h-screen bg-black font-sans selection:bg-yellow-500/30 selection:text-yellow-500">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 h-full overflow-hidden">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
