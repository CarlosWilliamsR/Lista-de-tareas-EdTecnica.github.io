import tasksService from "./tasks.js";


const form = document.querySelector('#form-task');
const inputTask = document.querySelector('#task-input');
const btnAdd = document.querySelector('.btn-add');
const taskList = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');


let currentFilter = 'all'; 




const createTaskElement = (task) => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.id = task.id;
    if (task.isCompleted) li.classList.add('completed');

    li.innerHTML = `
        <button class="btn-check" aria-label="Completar">
            ${task.isCompleted ? '<i class="fas fa-check"></i>' : ''}
        </button>
        <span class="task-text">${task.text}</span>
        <button class="btn-delete" aria-label="Eliminar">
            <i class="fas fa-trash"></i>
        </button>
    `;
    return li;
}

const updateCounters = () => {
    const allTasks = tasksService.getTasks();
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.isCompleted).length;
    
    document.querySelector('#count-total').textContent = total;
    document.querySelector('#count-completed').textContent = completed;
    document.querySelector('#count-pending').textContent = total - completed;
}

const renderTasks = () => {
    const allTasks = tasksService.getTasks();
    
    
    const tasksToRender = allTasks.filter(task => {
        if (currentFilter === 'pending') return !task.isCompleted;
        if (currentFilter === 'completed') return task.isCompleted;
        return true;
    });

    
    taskList.innerHTML = '';

    
    if (tasksToRender.length === 0) {
        emptyState.style.display = 'flex';
        
        if (allTasks.length > 0) {
            emptyState.querySelector('p').textContent = "No hay tareas en esta categoría.";
        } else {
            emptyState.querySelector('p').textContent = "¡Todo limpio! No hay tareas pendientes.";
        }
    } else {
        emptyState.style.display = 'none';
        
        
        tasksToRender.forEach(task => {
            const taskNode = createTaskElement(task);
            taskList.appendChild(taskNode);
        });
    }

    updateCounters();
    validateInput();
}


const validateInput = () => {
    if (inputTask.value.trim().length > 0) {
        btnAdd.disabled = false;
        btnAdd.classList.add('active');
    } else {
        btnAdd.disabled = true;
        btnAdd.classList.remove('active');
    }
}
inputTask.addEventListener('input', validateInput);


form.addEventListener('submit', e => {
    e.preventDefault();
    const text = inputTask.value.trim();
    if (!text) return;

    tasksService.addTask(text);
    tasksService.saveInBrowser();
    
    inputTask.value = '';
    
    
    if (currentFilter === 'completed') {
        currentFilter = 'all';
        updateFilterButtons();
    }

    renderTasks();
});


taskList.addEventListener('click', e => {
    const checkBtn = e.target.closest('.btn-check');
    const deleteBtn = e.target.closest('.btn-delete');
    const li = e.target.closest('.task-item');

    if (!li) return;

   
    if (checkBtn) {
        tasksService.toggleTask(li.id);
        tasksService.saveInBrowser();
        renderTasks();
    }


    if (deleteBtn) {
        li.classList.add('fall'); 
        
        li.addEventListener('transitionend', () => {
            tasksService.deleteTask(li.id);
            tasksService.saveInBrowser();
            renderTasks();
        });
    }
});


filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentFilter = e.target.dataset.filter;
        updateFilterButtons();
        renderTasks();
    });
});

const updateFilterButtons = () => {
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}


window.onload = () => {
    tasksService.loadFromBrowser();
    renderTasks();
}