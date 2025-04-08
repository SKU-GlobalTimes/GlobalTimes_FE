import { BrowserRouter } from 'react-router-dom';
import Routes from './router/Routers';
import { LanguageProvider } from './util/LanguageContext.jsx';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
