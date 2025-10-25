import { generateId } from './utils.js';

export function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

export function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function addTask(title, body) {
    const tasks = getTasks();

    const newTask = {
        id: generateId(),
        title: title.trim(),
        body: body.trim(),
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
}

export function deleteTask(tasks) {
    const tasks = getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    saveTasks(filteredTasks);
}