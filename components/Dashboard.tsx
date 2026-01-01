
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IAuditLogEntry } from '../types';

interface DashboardProps {
    logs: IAuditLogEntry[];
}

const data = [
    { name: '00:00', value: 400 },
    { name: '04:00', value: 300 },
    { name: '08:00', value: 600 },
    { name: '12:00', value: 800 },
    { name: '16:00', value: 500 },
    { name: '20:00', value: 900 },
    { name: '23:59', value: 700 },
];

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
    return (
        <div className="h-full overflow-y-auto p-8 bg-zinc-950 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
                <p className="text-zinc-500 uppercase text-xs tracking-[0.3em]">Operational Overview • Real-time Monitoring</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Network Uptime', value: '99.99%', icon: 'fa-globe', color: 'text-green-500' },
                    { label: 'Active Sessions', value: '1,432', icon: 'fa-user-clock', color: 'text-blue-500' },
                    { label: 'Universe Load', value: '14.2%', icon: 'fa-bolt-lightning', color: 'text-yellow-500' },
                    { label: 'Audit Status', value: 'Healthy', icon: 'fa-shield-halved', color: 'text-purple-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                            <i className={`fa-solid ${stat.icon} ${stat.color}`}></i>
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
                    <h3 className="text-sm font-bold text-zinc-400 mb-8 uppercase tracking-widest flex items-center">
                        <i className="fa-solid fa-chart-area mr-3 text-yellow-500"></i>
                        Throughput Flux
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#555" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#eab308' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col">
                    <h3 className="text-sm font-bold text-zinc-400 mb-6 uppercase tracking-widest flex items-center">
                        <i className="fa-solid fa-clock-rotate-left mr-3 text-yellow-500"></i>
                        Recent Audits
                    </h3>
                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                        {logs.slice(0, 6).map((log) => (
                            <div key={log.logId} className="flex space-x-4 group">
                                <div className="flex-shrink-0 w-1 bg-zinc-700 rounded-full group-hover:bg-yellow-500 transition-colors"></div>
                                <div>
                                    <div className="text-[10px] text-zinc-600 font-bold mb-1">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                    <div className="text-xs font-medium text-zinc-300">{log.action.replace('_', ' ').toUpperCase()}</div>
                                    <div className="text-[9px] text-zinc-500 uppercase">{log.target}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
