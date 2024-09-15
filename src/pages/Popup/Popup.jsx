import React from 'react';
import { useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';

import browser from 'webextension-polyfill';

import './Popup.css';

export default function Popup() {

  const [blockDownloads, setBlockDownloads] = useState(false);

  async function fetchBlockDownloads() {
    try {
      const result = await browser.storage.local.get('blockDownloads');
      setBlockDownloads(result.blockDownloads || false);
    } catch (error) {
      console.error('Error fetching blockDownloads:', error);
    }
  };

  fetchBlockDownloads()

  useEffect(() => {
    fetchBlockDownloads();
  }, []);

  const handleToggleChange = async (event) => {
    const isEnabled = event.target.checked;
    try {
      await browser.storage.local.set({ blockDownloads: isEnabled });
      setBlockDownloads(isEnabled);
    } catch (error) {
      console.error('Error setting blockDownloads:', error);
    }
  };

  return (
    <div id="app-container">
      <label>
        <input
          type="checkbox"
          checked={blockDownloads}
          onChange={handleToggleChange}
          id="toggle"
        />
        Block Downloads
      </label>
    </div>
  );
};