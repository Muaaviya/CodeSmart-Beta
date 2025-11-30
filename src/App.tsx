import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SubmitTask from './pages/SubmitTask';
import Paywall from './pages/Paywall';
import ViewResult from './pages/ViewResult';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Routes>
        <Route path="/" element={!user ? <Home /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
        <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={user ? <Layout title="Dashboard"><Dashboard /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/submit"
          element={user ? <Layout title="Submit Task"><SubmitTask /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/view-result/:taskId"
          element={user ? <Layout title="Evaluation Result"><ViewResult /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/paywall/:taskId"
          element={user ? <Layout title="Choose Your Plan"><Paywall /></Layout> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
