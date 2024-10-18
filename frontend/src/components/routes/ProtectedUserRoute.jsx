import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

import { getCurrentUserTokens } from '../../utils/auth';

    const ProtectedUserRoute= ({ allowedRoles }) => {
        const tokens = getCurrentUserTokens();
        
      
        if (!tokens || !tokens.accessToken) {
          return <Navigate to="/landing-page" replace />;
        }
      
        if (!allowedRoles.includes(tokens.role)) {
          return <Navigate to="/landing-page" replace />;
        }
      
        return <Outlet />;
      };
      
      export default  ProtectedUserRoute;