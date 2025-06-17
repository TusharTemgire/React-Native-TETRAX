# Karyah Mobile App

A fully functional React Native mobile application for project management with NativeWind styling.

## Features

- **Authentication**: Login/Register with OTP verification
- **Dashboard**: Overview of projects, tasks, and issues
- **Project Management**: Create, view, and manage projects
- **Task Management**: Create, assign, and track tasks with priority levels
- **Issue Tracking**: Report and manage project issues
- **Notifications**: Real-time notifications for updates
- **Profile Management**: User profile with editable information
- **Modern UI**: Built with NativeWind (Tailwind CSS for React Native)

## Tech Stack

- **React Native 0.73.6**
- **TypeScript**
- **NativeWind (Tailwind CSS)**
- **React Navigation 6**
- **Axios** for API calls
- **AsyncStorage** for local storage
- **React Native Gesture Handler**
- **React Native Reanimated**

## Prerequisites

- Node.js (v18 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

## Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd Karyah-Native-App
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. For iOS (macOS only):
\`\`\`bash
cd ios && pod install && cd ..
\`\`\`

## Configuration

1. Update the API base URL in \`src/services/api.ts\`:
\`\`\`typescript
const BASE_URL = 'http://your-backend-url/api';
\`\`\`

2. For Android development, ensure your backend is accessible from the Android emulator.

## Running the App

### Android
\`\`\`bash
npm run android
\`\`\`

### iOS
\`\`\`bash
npm run ios
\`\`\`

### Start Metro Bundler
\`\`\`bash
npm start
\`\`\`

## Project Structure

\`\`\`
src/
├── context/          # React Context (Auth)
├── navigation/       # Navigation configuration
├── screens/          # App screens
│   ├── auth/        # Authentication screens
│   └── main/        # Main app screens
├── services/        # API services
├── styles/          # Global styles
└── types/           # TypeScript type definitions
\`\`\`

## API Integration

The app integrates with the Karyah backend API for:
- User authentication and registration
- Project management
- Task management
- Issue tracking
- Notifications
- User profile management

## Features Overview

### Authentication
- Email/PIN login
- Phone number registration with OTP verification
- Secure token-based authentication

### Dashboard
- Project statistics
- Recent tasks and issues
- Quick action buttons
- Real-time data updates

### Project Management
- Create and manage projects
- Track project progress
- View project details
- Search and filter projects

### Task Management
- Create and assign tasks
- Set priorities and due dates
- Update task status
- Filter tasks by status

### Issue Management
- Report project issues
- Track issue resolution
- Priority-based issue management
- Approval workflow

### Profile Management
- Edit user information
- Profile photo management
- Privacy settings
- Account management

## Building for Production

### Android
\`\`\`bash
cd android
./gradlew assembleRelease
\`\`\`

### iOS
1. Open \`ios/KaryahApp.xcworkspace\` in Xcode
2. Select your target device/simulator
3. Build and archive for distribution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.