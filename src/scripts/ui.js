import { getTasks, addTask, deleteTask } from './storage.js';

export function renderTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    const tasks = getTasks();

    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<div class="no-tasks"><p>No tasks</p></div>';
        return;
    }

    tasksContainer.innerHTML = `
        ${tasks.map(task => `
        <div class="task-card" data-id="${task.id}">
            <div class="task-card__info">
                <h3 class="task-card__title">${task.title}</h3>
                <p class="task-card__body">${task.body}</p>
            </div>
            <div class="task-card__actions">
                <button class="btn delete-task-btn" data-action="delete" title="Удалить">X</button>
            </div>
        </div>
        `).join('')}
    `;
}

export function setupFormSubmit() {
    const form = document.getElementById('create-task-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleInput = document.getElementById('task-title');
        const bodyInput = document.getElementById('task-about');

        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();

        if (!title || !body) {
            alert('Заполните оба поля!');
            return;
        }

        addTask(title, body);

        titleInput.value = '';
        bodyInput.value = '';
        titleInput.focus();

        renderTasks();
    });
}

export function setupTaskListeners() {
  const tasksContainer = document.getElementById('tasks-container');
  if (!tasksContainer) return;

  tasksContainer.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="delete"]')) {
      const card = e.target.closest('.task-card');
      if (!card) return;

      const id = card.dataset.id;
      if (!id) return;

      if (!confirm('Удалить задачу?')) return;

      deleteTask(id);

      renderTasks();
    }
  });
}