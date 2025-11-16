import React, { useState } from 'react';
import './ProfilePage.css';
import { translations } from '../translations';
import ExactOdometer from './ExactOdometer'; // Import the Odometer

const ProfilePage = ({ language = 'en', onClose, footer }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [skillPoints, setSkillPoints] = useState({
    strength: 0,
    attack: 0,
    fatality: 0,
    stamina: 0,
    agility: 0,
    defense: 0,
    charisma: 0,
    magicka: 0,
  });
  const [availablePoints, setAvailablePoints] = useState(9);
  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const handleSkillChange = (skill, amount) => {
    if (amount > 0 && availablePoints > 0) {
      setSkillPoints(prev => ({ ...prev, [skill]: prev[skill] + amount }));
      setAvailablePoints(prev => prev - 1);
    } else if (amount < 0 && skillPoints[skill] > 0) {
      setSkillPoints(prev => ({ ...prev, [skill]: prev[skill] + amount }));
      setAvailablePoints(prev => prev + 1);
    }
  };

  const renderSkillRow = (skillName) => (
    <div className="skill-point-row">
      <span className="skill-label">{skillName.charAt(0).toUpperCase() + skillName.slice(1)}</span>
      <div className="skill-controls">
        <button onClick={() => handleSkillChange(skillName, -1)} disabled={skillPoints[skillName] <= 0}>-</button>
        <span>{skillPoints[skillName]}</span>
        <button onClick={() => handleSkillChange(skillName, 1)} disabled={availablePoints <= 0}>+</button>
      </div>
    </div>
  );

  return (
    <div className="profile-page-new">
      <div className="profile-content-wrapper">
        {/* Header */}
        <div className="profile-header-new">
          <button className="back-button-new" onClick={onClose}>←</button>
          <h1 className="username-header">SumoUser123</h1>
          <button className="settings-button-new">⚙️</button>
        </div>

        {/* User Info */}
        <div className="user-info-section">
          <div className="pfp-container">
            <div className="pfp-gold-ring"></div>
            <button className="pfp-edit-button">✎</button>
          </div>
          <div className="bio-and-stats">
            <textarea className="bio-textarea" placeholder="Write your bio (max 264 characters)..."></textarea>
            <div className="social-stats-new">
              <button>128 Followers ▼</button>
              <button>87 Following ▼</button>
              <button>34 Friends ▼</button>
            </div>
          </div>
        </div>

        {/* Level and XP */}
        <div className="level-bar">
          <span>Level 0</span>
          <span>0 XP</span>
        </div>

        {/* Main Content Grid */}
        <div className="profile-main-grid">
          {/* Character Customization */}
          <div className="customization-panel">
            <h2 className="panel-title">Character Customization</h2>
            <div className="customization-grid">
              <div className="customization-group">
                <label>Body Type</label>
                <select><option>Yokozuna</option></select>
                <label>Shirt Style</label>
                <select><option>Ceremonial Robe</option></select>
                <label>Eye Shape</label>
                <select><option>Determined</option></select>
              </div>
              <div className="customization-group">
                <label>Hair Style</label>
                <select><option>Topknot</option></select>
                <label>Pants Style</label>
                <select><option>Mawashi</option></select>
                <label>Mouth Shape</label>
                <select><option>Confident Smirk</option></select>
              </div>
              <div className="color-section">
                <div className="shirt-color-preview"></div>
                <div className="color-sliders">
                  <label>Primary Color</label>
                  <input type="range" min="0" max="100" defaultValue="75" className="color-slider primary" />
                  <label>Secondary</label>
                  <input type="range" min="0" max="100" defaultValue="50" className="color-slider secondary" />
                </div>
              </div>
            </div>
            <div className="auto-rotate-check">
              <input type="checkbox" id="auto-rotate" />
              <label htmlFor="auto-rotate">Auto Rotate</label>
            </div>
          </div>

          {/* Skill Points */}
          <div className="skill-points-panel">
            <h2 className="panel-title">Skill Points</h2>
            <span className="available-points">Available: {availablePoints}</span>
            <div className="skills-grid">
              <div className="skills-column">
                {renderSkillRow('strength')}
                {renderSkillRow('attack')}
                {renderSkillRow('fatality')}
                {renderSkillRow('stamina')}
              </div>
              <div className="skills-column">
                {renderSkillRow('agility')}
                {renderSkillRow('defense')}
                {renderSkillRow('charisma')}
                {renderSkillRow('magicka')}
              </div>
            </div>
            <div className="stats-tabs">
              <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>Stats</button>
              <button className={activeTab === 'items' ? 'active' : ''} onClick={() => setActiveTab('items')}>Items</button>
              <button className={activeTab === 'campaign' ? 'active' : ''} onClick={() => setActiveTab('campaign')}>Campaign</button>
              <button className={activeTab === 'checkout' ? 'active' : ''} onClick={() => setActiveTab('checkout')}>Checkout</button>
            </div>
            <div className="stats-display-area">
              <p>Your in-depth stats will appear here.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Render the passed-in footer */}
      {footer}
    </div>
  );
};

export default ProfilePage;
