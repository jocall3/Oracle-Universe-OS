
import React from 'react';
import { IAuditLogEntry } from '../types';

interface LogViewerProps {
    logs: IAuditLogEntry[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
    return (
        <div className="h-full flex flex-col p-8 bg-zinc-950">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Audit Logs</h1>
                <p className="text-zinc-500 uppercase text-xs tracking-[0.3em]">Full System Traceability</p>
            </header>

            <div className="flex-1 bg-black/50 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                <div className="bg-zinc-900/80 px-6 py-4 grid grid-cols-12 gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-2">Actor</div>
                    <div className="col-span-3">Action</div>
                    <div className="col-span-3">Target</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {logs.map((log) => (
                        <div key={log.logId} className="px-6 py-5 grid grid-cols-12 gap-4 text-xs items-center hover:bg-zinc-900/50 transition-colors border-b border-zinc-900/50 last:border-0">
                            <div className="col-span-2 font-mono text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                            <div className="col-span-2 flex items-center space-x-2">
                                <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
                                    <i className="fa-solid fa-user-secret text-[10px]"></i>
                                </div>
                                <span className="font-bold text-zinc-300">{log.actor}</span>
                            </div>
                            <div className="col-span-3">
                                <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-[10px] font-bold text-zinc-400">
                                    {log.action.toUpperCase()}
                                </span>
                            </div>
                            <div className="col-span-3 text-zinc-500 font-medium truncate">{log.target}</div>
                            <div className="col-span-2 text-right">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                    log.outcome === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                    {log.outcome}
                                </span>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-700 italic py-20">
                            <i className="fa-solid fa-inbox text-4xl mb-3"></i>
                            <p>No audit data detected.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogViewer;
