import React from 'react';
import {createRoot} from "react-dom/client";
import {App} from './App';

const reactRoot = document.getElementById('react-root');

if (reactRoot) {
    createRoot(reactRoot).render(<App/>);
}
