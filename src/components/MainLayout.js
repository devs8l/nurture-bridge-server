'use client';

import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <main className="flex-1 m-3 border border-[#22302c23] rounded-xl overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;