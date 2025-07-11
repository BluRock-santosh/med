import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import Login from "./components/LoginForm";
import Register from "./components/Registerform";
import Dashboard from "./components/Dashboard";


function App() {
  const { user} = useUserStore();
  const [showRegister, setShowRegister] = useState(false);
 


  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          {showRegister ? (
            <>
              <Register />
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign in
                </button>
              </p>
            </>
          ) : (
            <>
              <Login />
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }


  return <Dashboard />;
}

export default App
