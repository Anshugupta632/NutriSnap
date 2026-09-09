const { supabaseAuth } = require('../config/supabase');

/**
 * Verifies Supabase JWT and extracts authenticated user_id
 * Expects Bearer token in Authorization header
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token missing. Please login and try again.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Support demo session if requested
    if (token === 'demo-jwt-token-active' || token.startsWith('demo-')) {
      req.user = {
        id: '52d17eb7-e20f-4ebd-bbdf-2ab2d8e0bd9c',
        email: 'finaltest3@example.com',
      };
      return next();
    }

    if (!supabaseAuth) {
      console.error('supabaseAuth client not configured - SUPABASE_ANON_KEY missing');
      return res.status(500).json({
        success: false,
        error: 'Auth service unavailable',
      });
    }

    // Verify user with Supabase
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      console.error('Token verification failed:', error?.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token. Please login again.',
      });
    }

    // Attach verified user_id to request
    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
}

/**
 * Optional auth - if token exists, verify it; otherwise allow anonymous
 */
async function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ') || !supabaseAuth) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (!error && user) {
      req.user = { id: user.id, email: user.email };
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
}

// Support both: const { authMiddleware } = require(...) AND const authMiddleware = require(...)
authMiddleware.authMiddleware = authMiddleware;
authMiddleware.optionalAuthMiddleware = optionalAuthMiddleware;

module.exports = authMiddleware;