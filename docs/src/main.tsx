import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './theme.scss';
import './style.css';

const root = document.getElementById('root');
if (!root) throw new Error('文档挂载节点不存在');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
