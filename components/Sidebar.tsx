
import React from 'react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: 'fa-gauge-high', label: 'Command Center' },
        { id: 'agents', icon: 'fa-users-rectangle', label: 'Agents' },
        { id: 'logs', icon: 'fa-terminal', label: 'Audit Logs' },
        { id: 'metrics', icon: 'fa-chart-line', label: 'Telemetry' },
    ];

    return (
        <div className="w-20 md:w-64 bg-black border-r border-zinc-800 flex flex-col items-center md:items-stretch py-6 transition-all">
            <div className="px-6 mb-10 flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    <i className="fa-solid fa-brain text-xl"></i>
                </div>
                <span className="hidden md:block font-bold tracking-widest text-yellow-500 text-lg">ORACLE OS</span>
            </div>

            <nav className="flex-1 space-y-2 px-3">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                            activeTab === item.id 
                            ? 'bg-zinc-900 text-yellow-500 border border-zinc-700' 
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                        }`}
                    >
                        <i className={`fa-solid ${item.icon} text-lg`}></i>
                        <span className="hidden md:block font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="px-6 py-6 border-t border-zinc-800">
                <div className="flex items-center space-x-3 opacity-50 text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-500 pulse-gold"></div>
                    <span className="hidden md:block">NETWORK SECURE</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
