import React, { useState } from 'react';
import './App.css'; // Import file CSS tùy chỉnh
import TinhNang1 from './TinhNang1';
import TinhNang2 from './TinhNang2';
import TinhNang3 from './TinhNang3';

const App = () => {
  const [activeFeature, setActiveFeature] = useState(1);

  return (
    <div className="uda-container">
      {/* Header */}
      <header className="uda-header">
        <h1 className="uda-title">🏡 UDA MAP</h1>
      </header>

      {/* Layout chính */}
      <div className="uda-main">
        {/* Sidebar */}
        <nav className="uda-sidebar">
          <button onClick={() => setActiveFeature(1)} className="uda-nav-item">Quản lý nhà trọ</button>
          <button onClick={() => setActiveFeature(2)} className="uda-nav-item">Quản lý tiện ích</button>
          <button onClick={() => setActiveFeature(3)} className="uda-nav-item">Tính Năng 3</button>
        </nav>

        {/* Nội dung chính */}
        <main className="uda-content">
          {activeFeature === 1 && <TinhNang1 />}
          {activeFeature === 2 && <TinhNang2 />}
          {activeFeature === 3 && <TinhNang3 />}
        </main>
      </div>
    </div>
  );
};

export default App;
