import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Code, ClipboardCheck, BookOpen, User, Menu } from 'lucide-react';

const DashboardLayout = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Practice', icon: Code, path: '/dashboard/practice' },
        { name: 'Assessments', icon: ClipboardCheck, path: '/dashboard/assessments' },
        { name: 'Resources', icon: BookOpen, path: '/dashboard/resources' },
        { name: 'Profile', icon: User, path: '/dashboard/profile' },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed md:relative h-full z-10 transition-transform duration-300 md:translate-x-0 -translate-x-full">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <span className="text-xl font-bold text-primary">Placement Prep</span>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs mr-3">
                            JD
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">John Doe</p>
                            <p className="text-xs text-slate-500">Student</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
                    <span className="text-lg font-bold text-primary">Placement Prep</span>
                    <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-md">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
