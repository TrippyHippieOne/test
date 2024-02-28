import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import bridge from '@vkontakte/vk-bridge';
import { ConfigProvider, AdaptivityProvider } from '@vkontakte/vkui'

bridge.send('VKWebAppInit')

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider>
    <AdaptivityProvider>
      <App />
    </AdaptivityProvider>
  </ConfigProvider>
);
