// Get elements from DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const notification = document.getElementById('notification');

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task event
addTaskBtn.addEventListener('click', addTask);

// Task interactions (delete, edit, complete)
taskList.addEventListener('click', handleTaskActions);

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        showNotification('Task cannot be empty', 'error');
        return;
    }

    const taskItem = createTaskElement(taskText);
    taskList.appendChild(taskItem);

    saveTaskToLocalStorage(taskText);

    taskInput.value = '';
    showNotification('Task added successfully', 'success');
}

// Create task element
function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskText}</span>
        <div>
            <button class="complete">Complete</button>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    `;
    return li;
}

// Handle task actions (delete, edit, complete)
function handleTaskActions(e) {
    if (e.target.classList.contains('delete')) {
        const taskItem = e.target.parentElement.parentElement;
        taskItem.remove();
        removeTaskFromLocalStorage(taskItem.firstElementChild.textContent);
        showNotification('Task deleted', 'success');
    } else if (e.target.classList.contains('edit')) {
        const taskItem = e.target.parentElement.parentElement;
        const newTask = prompt('Edit your task:', taskItem.firstElementChild.textContent);
        if (newTask) {
            taskItem.firstElementChild.textContent = newTask;
            updateTaskInLocalStorage(taskItem.firstElementChild.textContent, newTask);
            showNotification('Task updated', 'success');
        }
    } else if (e.target.classList.contains('complete')) {
        const taskItem = e.target.parentElement.parentElement;
        taskItem.classList.toggle('completed');
        showNotification('Task marked as completed', 'success');
    }
}

// Show notification
function showNotification(message, type) {
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.color = type === 'error' ? 'red' : 'green';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Save task to localStorage
function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskText => {
        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
    });
}

// Remove task from localStorage
function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task in localStorage
function updateTaskInLocalStorage(oldTask, newTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.indexOf(oldTask);
    if (index !== -1) {
        tasks[index] = newTask;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}
