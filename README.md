# TETRAX Mobile App

A comprehensive React Native mobile application for project management built with modern technologies and beautiful UI components using NativeWind (Tailwind CSS for React Native).

## 🚀 Features

- **🔐 Authentication System**
  - Email/PIN login authentication
  - Phone number registration with OTP verification
  - Secure token-based authentication with AsyncStorage
  - Auto-logout on token expiration

- **📊 Dashboard & Analytics**
  - Real-time project statistics overview
  - Recent tasks, issues, and notifications display
  - Quick action buttons for common operations
  - Responsive data visualization

- **📁 Project Management**
  - Create, view, edit, and manage projects
  - Project progress tracking with visual indicators
  - Status management (active, completed, on-hold, cancelled)
  - Advanced search and filtering capabilities

- **📋 Task Management**
  - Create and assign tasks with detailed information
  - Priority levels (low, medium, high, urgent)
  - Status tracking (pending, in-progress, completed, cancelled)
  - Due date management and notifications
  - Quick status update actions

- **🚨 Issue Tracking**
  - Report and manage project issues
  - Priority-based issue classification (low, medium, high, critical)
  - Status workflow (open, in-progress, resolved, closed, reopened)
  - Approval system with admin controls
  - Issue reassignment capabilities

- **🔔 Notifications System**
  - Real-time notifications for all activities
  - Categorized notifications (task, project, issue, connection, system)
  - Mark as read/unread functionality
  - Push notification support

- **👤 User Profile Management**
  - Comprehensive profile editing
  - Profile photo upload and management
  - Privacy settings (public/private profiles)
  - Account security with PIN change
  - Bio and location information

- **🎨 Modern UI/UX**
  - Built with NativeWind (Tailwind CSS for React Native)
  - Responsive design for all screen sizes
  - Dark/Light theme support
  - Smooth animations and transitions

## 🛠️ Tech Stack

- **Frontend Framework**: React Native 0.76.3
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation 6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Local Storage**: AsyncStorage
- **UI Components**: React Native Safe Area Context
- **Animations**: React Native Reanimated 3
- **Gestures**: React Native Gesture Handler
- **Build Tool**: Expo SDK 53

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)
- **Git**

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/React-Native-TETRAX.git
   cd React-Native-TETRAX
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install iOS dependencies (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Environment Configuration:**
   - Update the API base URL in `src/services/api.ts`:
   ```typescript
   const BASE_URL = 'https://your-backend-api.com/api';
   ```
   - Configure your `.env` file with appropriate values

## 🏃‍♂️ Running the Application

### Using Expo (Recommended)
```bash
# Start the Expo development server
npm start

# Run on Android device/emulator
npm run android

# Run on iOS device/simulator (macOS only)
npm run ios

# Run on web browser
npm run web
```

### Using React Native CLI
```bash
# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS (macOS only)
npx react-native run-ios
```

## 📁 Project Structure

```
React-Native-TETRAX/
├── src/
│   ├── context/              # React Context providers
│   │   └── AuthContext.tsx   # Authentication context
│   ├── navigation/           # Navigation configuration  
│   │   └── AppNavigator.tsx  # Main navigation setup
│   ├── screens/              # Application screens
│   │   ├── auth/            # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── main/            # Main app screens
│   │       ├── HomeScreen.tsx
│   │       ├── ProjectsScreen.tsx
│   │       ├── TasksScreen.tsx
│   │       ├── IssuesScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       └── NotificationsScreen.tsx
│   ├── services/            # API and external services
│   │   └── api.ts          # Axios API configuration
│   ├── styles/              # Global styles
│   │   └── global.css      # Tailwind CSS imports
│   └── types/               # TypeScript type definitions
│       └── index.ts        # Interface definitions
├── assets/                  # Static assets
│   ├── icon.png
│   └── splash.png
├── App.tsx                  # Root component
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── app.json              # Expo configuration
```

## 🔧 API Integration

The application integrates with a backend API providing the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/send-otp` - Send OTP for verification
- `POST /auth/verify-otp` - Verify OTP
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Projects
- `GET /projects` - Get all projects
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get task details
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Issues
- `GET /issues` - Get all issues
- `POST /issues` - Create new issue
- `GET /issues/:id` - Get issue details
- `PUT /issues/:id` - Update issue
- `DELETE /issues/:id` - Delete issue

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark notification as read

## 🎨 Styling & Theming

The app uses NativeWind for styling, which provides Tailwind CSS utilities for React Native:

### Custom Color Scheme
```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... full color palette
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f8fafc',
    // ... secondary colors
    700: '#334155',
  },
}
```

### Usage in Components
```typescript
<View className="bg-primary-600 p-4 rounded-lg">
  <Text className="text-white font-semibold">Primary Button</Text>
</View>
```

## 📱 Features Deep Dive

### Authentication Flow
1. User enters email and PIN
2. App validates credentials with backend
3. On success, JWT token and user data stored locally
4. Automatic token refresh and logout on expiration

### Real-time Data Management
- Automatic data refresh on screen focus
- Pull-to-refresh functionality
- Optimistic UI updates
- Error handling with user feedback

### Offline Support
- Local data caching with AsyncStorage
- Graceful handling of network failures
- Queue sync when connection restored

## 🔒 Security Features

- JWT token-based authentication
- Secure local storage with AsyncStorage
- API request/response interceptors
- Input validation and sanitization
- Automatic logout on token expiration

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📦 Building for Production

### Android APK
```bash
# Generate Android APK
expo build:android

# Using EAS Build (recommended)
npx eas build --platform android
```

### iOS IPA
```bash
# Generate iOS IPA (macOS only)
expo build:ios

# Using EAS Build (recommended)  
npx eas build --platform ios
```

### Web Build
```bash
# Build for web
npm run build:web
```

## 🚀 Deployment

### Expo Application Services (EAS)
1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Configure `eas.json`
3. Build: `eas build --platform all`
4. Submit: `eas submit --platform all`

### Google Play Store
1. Generate signed APK
2. Create Play Console account
3. Upload APK and complete store listing
4. Submit for review

### Apple App Store
1. Generate IPA with distribution certificate
2. Upload to App Store Connect
3. Complete app metadata
4. Submit for review

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards
- Use TypeScript for type safety
- Follow React Native best practices
- Use NativeWind for styling
- Write meaningful commit messages
- Add tests for new features

## 📋 TODO / Roadmap

- [ ] Push notifications implementation
- [ ] Offline mode with data sync
- [ ] File attachment support
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Dark mode implementation
- [ ] Biometric authentication
- [ ] Export/Import functionality

## 🐛 Known Issues

- iOS simulator may require additional setup for networking
- Android emulator needs proper API level configuration
- Some animations may not work on older devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors & Contributors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Expo team for amazing development tools
- NativeWind for bringing Tailwind CSS to React Native
- All contributors who helped shape this project

## 📞 Support & Contact

For support, email your-email@example.com or join our Slack channel.

For bugs and feature requests, please use the [GitHub Issues](https://github.com/your-username/React-Native-TETRAX/issues) page.

---

**Made with ❤️ using React Native and NativeWind**