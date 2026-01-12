/**
 * @typedef {object} Task
 * @property {string} id 
 * @property {string} text 
 * @property {boolean} isCompleted 
*/

/** @type {Task[]} */
let tasks = [];

const addTask = (text) => {
    const newTask = {
        id: crypto.randomUUID(),
        text: text,
        isCompleted: false
    };
    tasks = [newTask, ...tasks]; 
}

const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
}

const toggleTask = (id) => {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, isCompleted: !task.isCompleted };
        }
        return task;
    });
}

const getTasks = () => tasks;



const saveInBrowser = () => {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

const loadFromBrowser = () => {
    const data = localStorage.getItem('myTasks');
    tasks = JSON.parse(data) ?? [];
}

const tasksService = {
    addTask,
    deleteTask,
    toggleTask,
    getTasks,
    saveInBrowser,
    loadFromBrowser
};

export default tasksService;