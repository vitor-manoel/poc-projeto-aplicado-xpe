# Mobile SQLite Queue POC

A React Native/Expo mobile application demonstrating local SQLite database operations with a message queue system.

## Features

### 📱 **Two Main Screens**
1. **Insert Screen**: Add messages to the queue with sample data generation
2. **Queue Screen**: View, manage, and process messages in the queue

### 🗃️ **SQLite Database**
- Local storage using `expo-sqlite`
- Message queue table with timestamps
- Automatic database initialization
- CRUD operations with error handling

### ⚡ **Queue Management**
- **Message States**: `pending`, `processing`, `done`, `failed`
- **Actions**: Add, update status, delete, clear all
- **Statistics**: Real-time counters by status
- **Refresh**: Pull-to-refresh functionality

### 🎨 **Modern UI**
- Material Design inspired interface
- Dark/Light theme support
- Status-based color coding
- Interactive buttons and alerts
- Loading states and empty states

## Database Schema

```sql
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payload TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Available Functions

### Database Operations
- `initDB()` - Initialize database and tables
- `enqueueMessage(payload)` - Add new message
- `getAllMessages()` - Fetch all messages
- `updateMessageStatus(id, status)` - Update message status
- `deleteMessage(id)` - Delete specific message
- `clearAllMessages()` - Delete all messages
- `getMessageStats()` - Get status statistics

### Message Status Flow
```
pending → processing → done
    ↓         ↓
  done     failed
    ↓         ↓
 pending ← pending
```

## Technology Stack

- **Framework**: React Native with Expo
- **Database**: SQLite (expo-sqlite)
- **Navigation**: Expo Router with Tab Navigation
- **UI**: React Native built-in components
- **Icons**: Ionicons
- **Language**: TypeScript

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Run on Device/Simulator**
   - Press `i` for iOS
   - Press `a` for Android
   - Scan QR code with Expo Go app

## Project Structure

```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigation
│   │   ├── insert.tsx       # Insert message screen
│   │   └── queue.tsx        # Queue management screen
│   └── _layout.tsx          # Root layout
├── components/
│   └── navigation/
│       └── TabBarIcon.tsx   # Tab bar icon component
├── constants/
│   └── theme.ts             # Color and theme constants
├── database/
│   └── db.ts                # SQLite database operations
└── hooks/
    └── use-color-scheme.ts  # Theme hook
```

## Sample Messages

The app includes predefined sample messages for testing:
- Process order #12345
- Send welcome email to user
- Update inventory for product X
- Generate monthly report
- Backup database
- Send push notification
- Clean temporary files
- Sync user preferences

## Key Features Demonstrated

1. **Local Data Persistence**: SQLite database with proper schema
2. **State Management**: React hooks for managing app state
3. **User Experience**: Loading states, error handling, confirmations
4. **Mobile Navigation**: Tab-based navigation with proper routing
5. **Responsive Design**: Works on different screen sizes
6. **TypeScript**: Full type safety and interfaces
7. **Modern React**: Hooks, functional components, async/await

This POC demonstrates a complete mobile application with local database operations, perfect for offline-first applications or local data caching scenarios.
