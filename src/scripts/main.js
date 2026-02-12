import { renderTasks, setupFormSubmit, setupTaskListeners} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    setupFormSubmit();
    setupTaskListeners();
});