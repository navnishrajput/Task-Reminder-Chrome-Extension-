// Event listener for the "Add Task" button
document.getElementById("addTask").addEventListener("click", function () {
    const task = document.getElementById("task").value;
    const dueTime = document.getElementById("dueTime").value;

    if (task && dueTime) {
        const taskId = Date.now().toString(); // Unique ID for each task

        // Save the task to local storage
        chrome.storage.sync.get({ tasks: [] }, function (result) {
            const tasks = result.tasks;
            tasks.push({ id: taskId, task, dueTime, notified: false });
            chrome.storage.sync.set({ tasks }, function () {
                console.log("Task saved:", task);
            });
        });

        // Add task to the UI
        addTaskToUI(taskId, task, dueTime);
    } else {
        alert("Please enter a task and due time.");
    }
});

// Function to add a task to the UI
function addTaskToUI(taskId, task, dueTime) {
    const tasksDiv = document.getElementById("tasks");
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item";
    taskDiv.innerHTML = `
        <div>
            <strong>${task}</strong> <br/>
            <span>Due: ${new Date(dueTime).toLocaleString()}</span>
        </div>
        <button class="remove-task" data-id="${taskId}">Remove</button>
    `;
    tasksDiv.appendChild(taskDiv);

    // Add event listener to the remove button
    taskDiv.querySelector(".remove-task").addEventListener("click", function () {
        removeTask(taskId, taskDiv);
    });
}

// Function to remove a task from the UI and storage
function removeTask(taskId, taskDiv) {
    // Remove task from storage
    chrome.storage.sync.get({ tasks: [] }, function (result) {
        const tasks = result.tasks.filter(t => t.id !== taskId);
        chrome.storage.sync.set({ tasks }, function () {
            console.log("Task removed:", taskId);
        });
    });

    // Remove task from UI
    taskDiv.remove();
}

// Load saved tasks from storage when popup is opened
chrome.storage.sync.get({ tasks: [] }, function (result) {
    const tasks = result.tasks;
    tasks.forEach(function (taskObj) {
        addTaskToUI(taskObj.id, taskObj.task, taskObj.dueTime);
    });
});
