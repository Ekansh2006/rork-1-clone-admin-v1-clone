# Beer App Admin Panel

A simple web-based admin panel for managing user verification in the Beer app.

## Features

- **Admin Authentication**: Secure login with admin credentials
- **User Management**: View all registered users with their details
- **Selfie Verification**: Display user selfies from Cloudinary
- **Approval System**: Approve or reject user verification requests
- **Statistics Dashboard**: Real-time stats of pending, approved, and rejected users
- **Username Generation**: Automatically generates usernames for approved users

## Setup

1. Open `admin-panel/index.html` in a web browser
2. Login with admin credentials:
   - **Email**: `admin@beerapp.com`
   - **Password**: `admin123`

## Admin Credentials

For security, you should:
1. Create a proper admin user in Firebase Authentication
2. Update the `ADMIN_EMAIL` and `ADMIN_PASSWORD` constants in the HTML file
3. Implement proper role-based authentication in production

## Features Overview

### Dashboard Statistics
- **Pending Verification**: Users waiting for admin approval
- **Approved Users**: Successfully verified users
- **Rejected Users**: Users who were denied verification

### User Management
Each user card displays:
- Profile selfie (from Cloudinary)
- Personal information (name, email, phone, location)
- Registration date
- Current verification status
- Username (auto-generated upon approval)

### Actions
- **Approve**: Sets user status to 'approved' and generates username
- **Reject**: Sets user status to 'rejected'
- **Status Updates**: Real-time updates reflected in the dashboard

## Technical Details

- **Frontend**: Pure HTML/CSS/JavaScript with Firebase Web SDK
- **Database**: Firebase Firestore for user data
- **Images**: Cloudinary URLs for selfie display
- **Authentication**: Firebase Authentication
- **Real-time**: Automatic data refresh after status updates

## Security Notes

- Admin credentials are hardcoded for demo purposes
- In production, implement proper admin role management
- Consider adding rate limiting and audit logging
- Use HTTPS in production environment

## Browser Compatibility

- Modern browsers with ES6 module support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile responsive design