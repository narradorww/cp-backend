import React, {useState} from 'react';
import UserProfile from './components/UserProfile';

function App() {
const [user, setUser] = useState(null);

const handleGoogleLogin = () => {
  window.open('http://localhost:3001/auth/google', '_self');
};

const handleFacebookLogin = () => {
  window.open('http://localhost:3001/auth/facebook', '_self');
};

  return (
    <div className="App">
    {user ? (
      <UserProfile user={user} />
    ) : (
      <>
        <h1>Login com Google e Facebook</h1>
        <button onClick={handleGoogleLogin}>Login com Google</button>
        <button onClick={handleFacebookLogin}>Login com Facebook</button>
      </>
    )}
  </div>
  );
}

export default App;
