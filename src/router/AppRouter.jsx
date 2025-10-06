import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Layout from '../components/layout/Layout';
import PrivateRoute from '../components/shared/PrivateRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AllProperties from '../pages/AllProperties';
import PropertyDetails from '../pages/PropertyDetails';
import NotFound from '../pages/NotFound';
import Dashboard from '../pages/dashboard/Dashboard';
import ApiTest from '../pages/ApiTest';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Property Routes */}
          <Route path="properties" element={<AllProperties />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          <Route path="dashboard/*" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          {/* API Test Route (for debugging) */}
          <Route path="api-test" element={<ApiTest />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;