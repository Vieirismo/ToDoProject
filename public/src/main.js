document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos HTML
    const todoForm = document.getElementById('todo-form'); 
    const taskInput = document.getElementById('task-input'); 
    const add_btn = document.getElementById("add-button");
    const taskContainer = document.getElementById("tasks"); 

    const all_btn = document.getElementById('all-button');
    const active_btn = document.getElementById('active-button');
    const finished_btn = document.getElementById('finished-button');

   
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let current_filter = 'all'; 

  
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

   
    const createTasks = (task) => { 
        const taskDiv = document.createElement('li');
        taskDiv.classList.add("task");

        taskDiv.setAttribute('data-id', task.id); 

        if (task.finished) { 
            taskDiv.classList.add('completed');
        }

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text; 

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const completeBtn = document.createElement('button');
        completeBtn.classList.add('complete-btn');
        completeBtn.innerHTML = `<i class="fas fa-check"></i>`;
        completeBtn.title = task.finished ? 'Marcar como não concluída' : 'Marcar como concluída';
        completeBtn.addEventListener('click', () => toggleComplete(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
        deleteBtn.title = 'Excluir tarefa';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);

        taskDiv.appendChild(taskTextSpan);
        taskDiv.appendChild(actionsDiv);
        taskContainer.appendChild(taskDiv);
    };

    
    const load_tasks = () => {
        taskContainer.innerHTML = ''; 
        let filtered_tasks = tasks;

     
        if (current_filter === 'active') {
            filtered_tasks = tasks.filter(task => !task.finished);
        } else if (current_filter === 'finished') {
            filtered_tasks = tasks.filter(task => task.finished);
        }


        if (filtered_tasks.length === 0 && current_filter === 'all') {
            const no_tasks_msg = document.createElement("h3");
            no_tasks_msg.textContent = "Nenhuma tarefa criada ainda!";
            no_tasks_msg.style.textAlign = 'center';
            no_tasks_msg.style.color = 'black';
            taskContainer.appendChild(no_tasks_msg);
            return;
        } else if (filtered_tasks.length === 0) {
            const no_tasks_msg = document.createElement("h3");
            no_tasks_msg.textContent = `Nenhuma tarefa ${current_filter === 'active' ? 'ativa' : 'concluída'} encontrada.`;
            no_tasks_msg.style.textAlign = 'center';
            no_tasks_msg.style.color = 'black';
            taskContainer.appendChild(no_tasks_msg);
            return;
        }

      
        filtered_tasks.forEach(task => { 
            createTasks(task);
        });
    };

    
    const toggleComplete = (id) => {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, finished: !task.finished } : task 
        );
        saveTasks();
        load_tasks(); 
    };

   
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        load_tasks(); 
    };


    todoForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const text = taskInput.value.trim(); 

        if (text) { 
            const newTask = {
                id: Date.now(), 
                text: text,
                finished: false
            };
            tasks.push(newTask); 
            saveTasks();
            taskInput.value = ''; 
            load_tasks(); 
        }
    });

  
    all_btn.addEventListener('click', () => {
        current_filter = 'all';
        all_btn.classList.add('active');
        active_btn.classList.remove('active');
        finished_btn.classList.remove('active');
        load_tasks();
    });

    active_btn.addEventListener('click', () => {
        current_filter = 'active';
        all_btn.classList.remove('active');
        active_btn.classList.add('active');
        finished_btn.classList.remove('active');
        load_tasks();
    });

    finished_btn.addEventListener('click', () => {
        current_filter = 'finished';
        all_btn.classList.remove('active');
        active_btn.classList.remove('active');
        finished_btn.classList.add('active');
        load_tasks();
    });

    load_tasks();
});