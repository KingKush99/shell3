import React, { useState } from 'react';
import './ProfilePage.css';
import { translations } from '../translations';
import ExactOdometer from './ExactOdometer'; // Reserved for future use

const ProfilePage = ({ language = 'en', onClose, footer }) => {
  // Core stat state
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

  // Username & display name logic
  const storedUsername =
    typeof window !== 'undefined' && window.localStorage
      ? window.localStorage.getItem('profileUsername') || 'SumoUser123'
      : 'SumoUser123';

  const storedDisplayName =
    typeof window !== 'undefined' && window.localStorage
      ? window.localStorage.getItem('profileDisplayName') || storedUsername
      : storedUsername;

  const [username, setUsername] = useState(storedUsername);
  const [displayName, setDisplayName] = useState(storedDisplayName);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [usernameInput, setUsernameInput] = useState(storedUsername);
  const [displayNameInput, setDisplayNameInput] = useState(storedDisplayName);
  const [usernameError, setUsernameError] = useState('');

  // Followers / following / friends
  const [activeSocialList, setActiveSocialList] = useState('followers');
  const [socialSearch, setSocialSearch] = useState('');

  const socialLists = {
    followers: [
      { id: 1, name: 'SumoGal_1' },
      { id: 2, name: 'Rikishi_Ruler' },
      { id: 3, name: 'Dojo_Dreamer' },
      { id: 4, name: 'Yokozuna_Fanatic' },
    ],
    following: [
      { id: 5, name: 'Tatami_Tactician' },
      { id: 6, name: 'RingSideRival' },
      { id: 7, name: 'ChankoChampion' },
    ],
    friends: [
      { id: 8, name: 'BeltBreaker' },
      { id: 9, name: 'SumoStrategist' },
      { id: 10, name: 'PillowFightPro' },
    ],
  };

  const visibleSocialList = socialLists[activeSocialList].filter((user) =>
    user.name.toLowerCase().includes(socialSearch.toLowerCase())
  );

  // Context menu for social entries
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    user: null,
  });

  const handleUserClick = (user) => {
    // Placeholder: navigate to player's base/profile
    console.log('Visit base for', user.name);
    if (typeof window !== 'undefined') {
      window.alert(`Opening ${user.name}'s base and profile (placeholder).`);
    }
  };

  const handleUserContextMenu = (event, user) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      user,
    });
  };

  const handleContextAction = (action) => {
    if (!contextMenu.user) return;
    console.log(action, 'selected for', contextMenu.user.name);
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const closeContextMenu = () => {
    if (contextMenu.visible) {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    }
  };

  // Mascot selection
  const mascots = Array.from({ length: 32 }).map((_, index) => `Mascot ${index + 1}`);
  const [selectedMascotIndex, setSelectedMascotIndex] = useState(0);
  const [showMascotPicker, setShowMascotPicker] = useState(false);

  const openMascotPicker = (event) => {
    event.stopPropagation();
    setShowMascotPicker(true);
  };

  const handleMascotSelect = (index) => {
    setSelectedMascotIndex(index);
    setShowMascotPicker(false);
  };

  // Username / display name saving
  const handleSaveDisplayName = () => {
    const trimmed = displayNameInput.trim();
    if (!trimmed) return;

    setDisplayName(trimmed);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('profileDisplayName', trimmed);
    }
    setIsEditingDisplayName(false);
  };

  const handleSaveUsername = () => {
    const trimmed = usernameInput.trim();
    if (!trimmed) return;

    let lastChange = 0;
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('profileUsernameLastChange');
      lastChange = stored ? parseInt(stored, 10) : 0;
    }
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (lastChange && now - lastChange < oneWeek) {
      setUsernameError('You can only change your username once per week.');
      return;
    }

    setUsername(trimmed);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('profileUsername', trimmed);
      window.localStorage.setItem('profileUsernameLastChange', String(now));
    }
    setUsernameError('');
    setIsEditingUsername(false);
  };

  // Simple XP + level display; wire this to real XP later
  const [profileXP] = useState(1000); // Level 1 / 1000 XP as requested

  const calculateLevelFromXP = (xp) => {
    // Total XP thresholds: 0, 1000, 3000, 6000, 10000, 15000, 21000, ...
    const thresholds = [0, 1000, 3000, 6000, 10000, 15000, 21000];
    let level = 0;
    for (let i = 0; i < thresholds.length; i++) {
      if (xp >= thresholds[i]) {
        level = i;
      } else {
        break;
      }
    }
    return level;
  };

  const profileLevel = calculateLevelFromXP(profileXP);

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const handleSkillChange = (skill, amount) => {
    if (amount > 0 && availablePoints > 0) {
      setSkillPoints((prev) => ({ ...prev, [skill]: prev[skill] + amount }));
      setAvailablePoints((prev) => prev - 1);
    } else if (amount < 0 && skillPoints[skill] > 0) {
      setSkillPoints((prev) => ({ ...prev, [skill]: prev[skill] + amount }));
      setAvailablePoints((prev) => prev + 1);
    }
  };

  const renderSkillRow = (skillName) => (
    <div className="skill-point-row" key={skillName}>
      <span className="skill-label">
        {skillName.charAt(0).toUpperCase() + skillName.slice(1)}
      </span>
      <div className="skill-controls">
        <button
          onClick={() => handleSkillChange(skillName, -1)}
          disabled={skillPoints[skillName] <= 0}
        >
          -
        </button>
        <span>{skillPoints[skillName]}</span>
        <button
          onClick={() => handleSkillChange(skillName, 1)}
          disabled={availablePoints <= 0}
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="profile-page-new" onClick={closeContextMenu}>
      <div className="profile-content-wrapper">
        {/* Header */}
        <div className="profile-header-new">
          <button className="back-button-new" onClick={onClose}>
            ←
          </button>
          <div className="header-name-block">
            <h1 className="username-header">
              {displayName}
              <button
                className="inline-edit-button"
                type="button"
                onClick={() => {
                  setDisplayNameInput(displayName);
                  setIsEditingDisplayName(true);
                }}
              >
                ✎
              </button>
            </h1>
            <div className="username-row">
              <span className="username-label">@{username}</span>
              <button
                className="inline-edit-button small"
                type="button"
                onClick={() => {
                  setUsernameInput(username);
                  setIsEditingUsername(true);
                  setUsernameError('');
                }}
              >
                ✎
              </button>
            </div>
          </div>
          <button className="settings-button-new">⚙️</button>
        </div>

        {isEditingDisplayName && (
          <div className="inline-edit-row">
            <label>Display Name</label>
            <input
              type="text"
              value={displayNameInput}
              onChange={(e) => setDisplayNameInput(e.target.value)}
            />
            <button type="button" onClick={handleSaveDisplayName}>
              Save
            </button>
            <button type="button" onClick={() => setIsEditingDisplayName(false)}>
              Cancel
            </button>
          </div>
        )}

        {isEditingUsername && (
          <div className="inline-edit-row">
            <label>Username</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <button type="button" onClick={handleSaveUsername}>
              Save
            </button>
            <button type="button" onClick={() => setIsEditingUsername(false)}>
              Cancel
            </button>
            {usernameError && <p className="inline-error">{usernameError}</p>}
          </div>
        )}

        {/* User Info */}
        <div className="user-info-section">
          <div className="pfp-container">
            <div className="pfp-gold-ring">
              <div className="pfp-avatar">{mascots[selectedMascotIndex]}</div>
            </div>
            <button
              className="pfp-edit-button"
              type="button"
              onClick={openMascotPicker}
            >
              ✎
            </button>
          </div>
          <div className="bio-and-stats">
            <textarea
              className="bio-textarea"
              placeholder="Write your bio (max 264 characters)..."
            ></textarea>
            <div className="social-stats-new">
              <button
                type="button"
                className={activeSocialList === 'followers' ? 'active' : ''}
                onClick={() => setActiveSocialList('followers')}
              >
                {socialLists.followers.length} Followers ▼
              </button>
              <button
                type="button"
                className={activeSocialList === 'following' ? 'active' : ''}
                onClick={() => setActiveSocialList('following')}
              >
                {socialLists.following.length} Following ▼
              </button>
              <button
                type="button"
                className={activeSocialList === 'friends' ? 'active' : ''}
                onClick={() => setActiveSocialList('friends')}
              >
                {socialLists.friends.length} Friends ▼
              </button>
            </div>
          </div>
        </div>

        {/* Social search & list */}
        <div className="social-search-section">
          <input
            type="text"
            className="social-search-input"
            placeholder={
              activeSocialList === 'followers'
                ? 'Search followers...'
                : activeSocialList === 'following'
                ? 'Search following...'
                : 'Search friends...'
            }
            value={socialSearch}
            onChange={(e) => setSocialSearch(e.target.value)}
          />
          <ul className="social-results-list">
            {visibleSocialList.map((user) => (
              <li
                key={user.id}
                className="social-result-item"
                onClick={() => handleUserClick(user)}
                onContextMenu={(event) => handleUserContextMenu(event, user)}
              >
                {user.name}
              </li>
            ))}
            {visibleSocialList.length === 0 && (
              <li className="social-result-item empty">No matches found.</li>
            )}
          </ul>
        </div>

        {/* Main Content Grid */}
        <div className="profile-main-grid">
          {/* Character Customization */}
          <div className="customization-panel">
            <h2 className="panel-title">Character Customization</h2>
            <div className="customization-grid">
              <div className="customization-group">
                <label>Body Type</label>
                <select>
                  <option>Yokozuna</option>
                </select>
                <label>Shirt Style</label>
                <select>
                  <option>Ceremonial Robe</option>
                </select>
                <label>Eye Shape</label>
                <select>
                  <option>Determined</option>
                </select>
              </div>
              <div className="customization-group">
                <label>Hair Style</label>
                <select>
                  <option>Topknot</option>
                </select>
                <label>Pants Style</label>
                <select>
                  <option>Mawashi</option>
                </select>
                <label>Mouth Shape</label>
                <select>
                  <option>Confident Smirk</option>
                </select>
              </div>
              <div className="color-section">
                <div className="shirt-color-preview"></div>
                <div className="color-sliders">
                  <label>Primary Color</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="color-slider primary"
                  />
                  <label>Secondary</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="50"
                    className="color-slider secondary"
                  />
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
              <button
                className={activeTab === 'stats' ? 'active' : ''}
                onClick={() => setActiveTab('stats')}
              >
                Stats
              </button>
              <button
                className={activeTab === 'items' ? 'active' : ''}
                onClick={() => setActiveTab('items')}
              >
                Items
              </button>
              <button
                className={activeTab === 'campaign' ? 'active' : ''}
                onClick={() => setActiveTab('campaign')}
              >
                Campaign
              </button>
              <button
                className={activeTab === 'checkout' ? 'active' : ''}
                onClick={() => setActiveTab('checkout')}
              >
                Checkout
              </button>
            </div>
            <div className="stats-display-area">
              <p>Your in-depth stats will appear here.</p>
            </div>
          </div>
        </div>

        {/* Level and XP (under customization + skill points) */}
        <div className="level-bar">
          <span>Level {profileLevel}</span>
          <span>{profileXP} XP</span>
        </div>
      </div>

      {/* Context menu for social entries */}
      {contextMenu.visible && (
        <ul
          className="profile-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <li onClick={() => handleContextAction('addFriend')}>Add Friend</li>
          <li onClick={() => handleContextAction('visitBase')}>Visit Base</li>
          <li onClick={() => handleContextAction('sendMessage')}>Send Message</li>
        </ul>
      )}

      {/* Mascot picker */}
      {showMascotPicker && (
        <div
          className="mascot-modal-overlay"
          onClick={() => setShowMascotPicker(false)}
        >
          <div className="mascot-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Select Mascot</h2>
            <div className="mascot-grid">
              {mascots.map((label, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    index === selectedMascotIndex ? 'mascot-option active' : 'mascot-option'
                  }
                  onClick={() => handleMascotSelect(index)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Render the passed-in footer */}
      {footer}
    </div>
  );
};

export default ProfilePage;
