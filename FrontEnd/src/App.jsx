import { BrowserRouter } from 'react-router-dom';
import Routes from './router/Routers';
import { LanguageProvider } from './util/LanguageProvider.jsx';
import { AuthProvider } from './util/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
