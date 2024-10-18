import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { clearAllNotifications, removeNotification } from './tutorChatSlice'; // Update the path as needed

// Create the middleware
export const notificationMiddleware = createListenerMiddleware();

// Listener for clearAllNotifications
notificationMiddleware.startListening({
  actionCreator: clearAllNotifications,
  effect: async (action, listenerApi) => {
    // Perform any side effects when all notifications are cleared
    console.log('All notifications cleared');
    
    // Example: Send a request to the server to mark all notifications as read
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers
        },
      });
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read on the server');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Optionally dispatch an error action
      // listenerApi.dispatch(markAllReadError(error.toString()));
    }
  },
});

// Listener for removeNotification
notificationMiddleware.startListening({
  actionCreator: removeNotification,
  effect: async (action, listenerApi) => {
    const notificationId = action.payload;
    console.log(`Notification ${notificationId} removed`);
    
    // Example: Send a request to the server to mark a specific notification as read
    try {
      const response = await fetch(`/api/notifications/${notificationId}/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to mark notification ${notificationId} as read on the server`);
      }
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      // Optionally dispatch an error action
      // listenerApi.dispatch(markReadError({ id: notificationId, error: error.toString() }));
    }
  },
});

// Optional: Combined listener for both actions
notificationMiddleware.startListening({
  matcher: isAnyOf(clearAllNotifications, removeNotification),
  effect: async (action, listenerApi) => {
    // Perform any common side effects for both actions
    console.log('Notification state updated:', action.type);
    
    // Example: Update some UI state or trigger a re-fetch of notifications
    // listenerApi.dispatch(refreshNotificationBadge());
  },
});

export default notificationMiddleware;