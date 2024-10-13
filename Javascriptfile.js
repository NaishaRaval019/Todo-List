const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDescription = document.getElementById('task-description');
const dueDateInput = document.getElementById('due-date');
const priorityInput = document.getElementById('priority');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


const renderTasks = (filter = 'all') => {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        if (filter === 'overdue') return isOverdue;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `${task.priority} ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div>
                <strong>${task.description}</strong> (Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'})
                <div class="description" style="display:none;">${task.detail}</div>
                <button onclick="toggleDescription(this)">Show/Hide Details</button>
            </div>
            <div>
                <button onclick="toggleComplete('${task.id}')">✔️</button>
                <button onclick="editTask('${task.id}')">✏️</button>
                <button onclick="deleteTask('${task.id}')">❌</button>
            </div>
        `;
        taskList.appendChild(li);
    });
};


const toggleDescription = (button) => {
    const description = button.previousElementSibling.querySelector('.description');
    description.style.display = description.style.display === 'none' ? 'block' : 'none';
};

const addTask = (event) => {
    event.preventDefault();
    const taskId = Date.now().toString();
    const newTask = {
        id: taskId,
        description: taskInput.value,
        detail: taskDescription.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        completed: false,
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    taskForm.reset();
};

const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
};

const editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    taskInput.value = task.description;
    taskDescription.value = task.detail;
    dueDateInput.value = task.dueDate;
    priorityInput.value = task.priority;
    deleteTask(id);
};

const deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
};

const filterTasks = (event) => {
    const filter = event.target.id;
    renderTasks(filter);
};

taskForm.addEventListener('submit', addTask);
filters.forEach(filter => filter.addEventListener('click', filterTasks));

renderTasks();  
