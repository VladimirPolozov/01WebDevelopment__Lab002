import { getTasks, addTask, deleteTask, editTask } from './storage.js';

export function renderTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    const tasks = getTasks();

    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<div class="no-tasks"><p>No tasks</p></div>';
        return;
    }

    tasksContainer.innerHTML = `
        ${tasks.map(task => `
        <div class="task-card__container" data-id="${task.id}">
            <div class="task-card">
                <div class="task-card__info">
                    <h3 class="task-card__title">${task.title}</h3>
                    <p class="task-card__body">${task.body}</p>
                </div>
                <div class="task-card__actions">
                    <button class="btn small-btn" data-action="delete" title="Удалить">X</button>
                </div>
            </div>
            <div class="context-menu">
                <button class="btn small-btn" data-action="share" title="Поделиться"><i class="fa fa-share-alt context-menu__icon"></i></button>
                <button class="btn small-btn" data-action="info" title="Информация"><i class="fas fa-info-circle"></i></button>
                <button class="btn small-btn" data-action="edit" title="Редактировать"><i class="fas fa-edit"></i></button>
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
        const container = e.target.closest('.task-card__container');
        const isActionButton = e.target.closest('[data-action]');

        // === 1. Если кликнули по кнопке действия ===
        if (isActionButton) {
            const id = container?.dataset.id;

            if (!id) return;
            
            const action = isActionButton.dataset.action;

            if (action === 'delete') {
                showDeleteModal(id);
            } else if (action === 'share') {
                alert('Поделиться: ' + id);
            } else if (action === 'info') {
                alert('Информация о: ' + id);
            } else if (action === 'edit') {
                showEditModal(id);
            }

            return;
        }

        if (container) {
            document.querySelectorAll('.context-menu').forEach(menu => {
            menu.style.display = 'none';
        });

        const menu = container.querySelector('.context-menu');
        if (menu) {
            menu.style.display = 'flex';
        }
        return;
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.task-card__container')) {
            document.querySelectorAll('.context-menu').forEach(menu => {
            menu.style.display = 'none';
        });
        }
    });
}

// Глобальные переменные, обработчики модальных окон
let currentDeleteId = null;
let currentEditId = null;

export function showDeleteModal(id) {
    currentDeleteId = id;
    const modal = document.getElementById('delete-modal');
    if (modal) modal.style.display = 'flex';
}

export function hideDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.style.display = 'none';
        currentDeleteId = null;
    }
}

export function showEditModal(id) {
    const task = getTasks().find(t => t.id === id);
    if (!task) return;

    currentEditId = id;
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-body').value = task.body;

    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('edit-title').focus();
    }
}

export function hideEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.style.display = 'none';
        currentEditId = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (currentDeleteId) {
                deleteTask(currentDeleteId);
                renderTasks();
                hideDeleteModal();
            }
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => hideDeleteModal());
    }

    const saveEditBtn = document.getElementById('save-edit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', () => {
            const title = document.getElementById('edit-title')?.value.trim();
            const body = document.getElementById('edit-body')?.value.trim();

            if (!title || !body) {
                alert('Заполните оба поля!');
                return;
            }

            if (currentEditId) {
                editTask(currentEditId, title, body);
                renderTasks();
                hideEditModal();
            }
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => hideEditModal());
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideDeleteModal();
            hideEditModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideDeleteModal();
            hideEditModal();
        }
    });
});