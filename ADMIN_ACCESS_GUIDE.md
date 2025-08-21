# Beer App Admin Panel Access Guide

## How to Access the Admin Panel

### Option 1: Web Admin Panel (Recommended)
1. Open your browser and go to: `{your-app-url}/admin-panel/`
2. Login with admin credentials:
   - **Email**: `admin@beerapp.com`
   - **Password**: `SecureAdmin123!`

### Option 2: Mobile Admin Panel
1. In your mobile app, navigate to: `{your-app-url}/admin`
2. This provides a mobile-friendly admin interface

## Admin Credentials

**Primary Admin Account:**
- Email: `admin@beerapp.com`
- Password: `SecureAdmin123!`

**Secondary Admin Account:**
- Email: `admin@beer-app.com`
- Password: `SecureAdmin123!`

## Features

- User verification management
- Approve/reject pending users
- View user selfies and details
- Admin authentication
- Real-time updates
- User statistics dashboard

## Troubleshooting Registration Issues

### If Account Creation Fails:
1. Check that the backend server is running
2. Verify tRPC routes are properly configured
3. Check browser/app console for errors
4. Ensure Firebase Admin SDK is working

### If Waiting Screen Doesn't Show:
1. The app should automatically redirect to `/verification-pending` after successful registration
2. Check that the UserContext is properly updated after registration
3. Verify the user status is set to `pending_verification`

### Common Issues:
- **Network errors**: Check if the backend API is accessible
- **Firebase errors**: Verify Firebase configuration
- **tRPC errors**: Check server logs for detailed error messages

## Testing the Flow

1. **Register a new account** with all required fields and selfie
2. **Check that you're redirected** to the verification pending screen
3. **Use admin panel** to approve/reject the user
4. **Verify the user** can access the main app after approval

## Development Notes

- The app uses tRPC for backend communication
- User registration creates a Firebase Auth user and Firestore document
- Admin panel connects directly to Firebase Admin SDK
- All admin actions are logged for audit purposes