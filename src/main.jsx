import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import "@fontsource/eb-garamond";
import "@fontsource/eb-garamond/700.css";
import "@fontsource/eb-garamond/400.css";
import "@fontsource/inter";
import "@fontsource/bree-serif";

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)