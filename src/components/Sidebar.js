'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    // {
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 7 5 5 5-5" />
    //     </svg>
    //   ),
    //   label: 'Dashboard',
    //   href: '/dashboard',
    //   active: pathname === '/dashboard'
    // },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      label: 'Chat',
      href: '/chat',
      active: pathname === '/chat'
    },
    // {
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    //     </svg>
    //   ),
    //   label: 'Summary',
    //   href: '/chat/summary',
    //   active: pathname.startsWith('/chat/summary')
    // },
    // {
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    //     </svg>
    //   ),
    //   label: 'Archive',
    //   href: '/archive',
    //   active: pathname === '/archive'
    // }
  ];

  return (
    <div className={`bg-white h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="p-4 flex items-center">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 bg-[#5C756B] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span 
            className={`font-semibold text-gray-800 hanken whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
            }`}
          >
            NurtureBridge
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center rounded-lg transition-colors duration-200 group py-2.5 px-1.5 ${
              item.active 
                ? 'bg-[#5C756B] text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${item.active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
              {item.icon}
            </span>
            <span 
              className={`font-medium hanken text-sm ml-3 whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">RU</span>
          </div>
          <div 
            className={`flex-1 min-w-0 transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            }`}
          >
            <p className="text-sm font-medium text-gray-900 hanken truncate">Ruchi & Sirish</p>
            <p className="text-xs text-gray-500 truncate">Welcome onboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;