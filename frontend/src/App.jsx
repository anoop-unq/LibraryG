// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { BookProvider } from './context/BookContext';
// import Navbar from './components/Navbar';
// import ProtectedRoute from './components/ProtectedRoute';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Books from './pages/Books';
// import Admin from './pages/Admin';
// import './App.css';

// function App() {
//   return (
//     <AuthProvider>
//       <BookProvider>
//         <Router>
//           <div className="App min-h-screen bg-gray-100 overflow-x-hidden">
//             <Navbar />
//             <main className="max-w-screen-xl mx-auto w-full px-4 py-6">
//               <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route
//                   path="/dashboard"
//                   element={
//                     <ProtectedRoute>
//                       <Dashboard />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/books"
//                   element={
//                     <ProtectedRoute>
//                       <Books />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/admin"
//                   element={
//                     <ProtectedRoute requiredRole="admin">
//                       <Admin />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/"
//                   element={
//                     <ProtectedRoute>
//                       <Dashboard />
//                     </ProtectedRoute>
//                   }
//                 />
//               </Routes>
//             </main>
//           </div>
//         </Router>
//       </BookProvider>
//     </AuthProvider>
//   );
// }

// export default App;


// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Admin from './pages/Admin';
import './App.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <Router>
          <ToastContainer 
           position="top-right"
        autoClose={3000}
        theme="light"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />
          <div className="App min-h-screen bg-gray-100 overflow-x-hidden">
            <Navbar />
            <main className="max-w-screen-xl mx-auto w-full px-4 py-6">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/books"
                  element={
                    <ProtectedRoute>
                      <Books />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/add-book"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;