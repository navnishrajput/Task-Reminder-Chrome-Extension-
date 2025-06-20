// Background script to monitor tasks and trigger reminders

// Check tasks every minute
chrome.alarms.create('checkTasks', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkTasks') {
    checkDueTasks();
  }
});

function checkDueTasks() {
  chrome.storage.sync.get({ tasks: [] }, (result) => {
    const tasks = result.tasks || [];
    const now = Date.now();

    tasks.forEach((task) => {
      const dueTime = new Date(task.dueTime).getTime();

      // If task is due or past due and not notified yet
      if (dueTime <= now && !task.notified) {
        // Show notification
        chrome.notifications.create(task.id, {
          type: 'basic',
          iconUrl: 'icon128.png',
          title: 'Task Reminder',
          message: `Task due: ${task.task}`,
          priority: 2,
          requireInteraction: true
        });

        // Mark task as notified to prevent repeated notifications
        task.notified = true;
      }
    });

    // Save updated tasks with notified flags
    chrome.storage.sync.set({ tasks });
  });
}

// Optional: Handle notification click to open popup or focus extension
chrome.notifications.onClicked.addListener((notificationId) => {
  // Open the popup.html in a new tab or focus existing tab
  chrome.tabs.create({ url: 'popup.html' });
  // Clear the notification
  chrome.notifications.clear(notificationId);
});
