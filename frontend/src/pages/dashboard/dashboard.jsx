import React from 'react';

export default function Dashboard() { 
  return (
    <main className="app-shell">
      <h1>ft_transcendence</h1>
      <p>Tamagotchi dashboard setup</p>
      <div className="pet-card">
        <div className="pet" aria-label="virtual pet">🐣</div>
        <div className="stats">
          <div><span>Hunger</span><strong>72%</strong></div>
          <div><span>Happiness</span><strong>86%</strong></div>
          <div><span>Energy</span><strong>64%</strong></div>
        </div>
      </div>
      <div className="actions">
        <button>Feed</button>
        <button>Play</button>
        <button>Clean</button>
      </div>
    </main>
  );
}