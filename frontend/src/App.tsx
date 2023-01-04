import { TokenProvider } from './components/TokenContext';
import Dashboard from './components/Dashboard';

function App() {

  return (
    <div className="App">
      <TokenProvider>
        <Dashboard />
      </TokenProvider>
    </div>
  );
}

export default App;