import { getTasks } from './storage.js';

export function renderTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    const tasks = getTasks();

    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<div class="no-tasks"><p>No tasks</p></div>';
        return;
    }
}