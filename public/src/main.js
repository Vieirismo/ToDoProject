
document.addEventListener('DOMContentLoaded', () => {

    // imports
    const db = window.db;
    const { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } = window.firebaseFirestore;

    
    const todoForm = document.getElementById('todo-form'); 
    const taskInput = document.getElementById('task-input'); 
    const taskContainer = document.getElementById("tasks"); 

    const all_btn = document.getElementById('all-button');
    const active_btn = document.getElementById('active-button');
    const finished_btn = document.getElementById('finished-button');

    const tasksCollectionRef = collection(db, 'tasks');


    let current_filter = 'all'; 


    const load_tasks = async () => {
        taskContainer.innerHTML = ''; 
        let filtered_tasks = tasksCollectionRef;

     
        if (current_filter === 'active') {
            filtered_tasks = query(tasksCollectionRef, where('finished', '==', false))
        } else if (current_filter === 'finished') {
            filtered_tasks = query(tasksCollectionRef, where('finished', '==', true))
        }

        try{
            const querySnapshot = await getDocs(filtered_tasks);
            const tasks = querySnapshot.docs.map(docData => ({
                id: docData.id, 
                ...docData.data()
            }));
        

        if (tasks.length === 0 && current_filter === 'all') {
            const no_tasks_msg = document.createElement("h3");
            no_tasks_msg.textContent = "Nenhuma tarefa criada ainda!";
            no_tasks_msg.style.textAlign = 'center';
            no_tasks_msg.style.color = 'black';
            taskContainer.appendChild(no_tasks_msg);
            return;
        } else if (tasks.length === 0) {
            const no_tasks_msg = document.createElement("h3");
            no_tasks_msg.textContent = `Nenhuma tarefa ${current_filter === 'active' ? 'ativa' : 'concluída'} encontrada.`;
            no_tasks_msg.style.textAlign = 'center';
            no_tasks_msg.style.color = 'black';
            taskContainer.appendChild(no_tasks_msg);
            return;
        }

      
        tasks.forEach(task => { 
            createTasks(task);
        });
        }catch(err){
            console.error("Erro ao carregar tarefas: ", err);
        }
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

    
    const toggleComplete = async (id, currentStatus) => {
        const taskDocRef = doc(db, 'tasks', id);
        try {
            await updateDoc(taskDocRef, {
                finished: !currentStatus
            });
            load_tasks(); 
        } catch (err) {
            console.error("Erro ao atualizar tarefa: ", err);
        }
    }
    
   
    const deleteTask = async (id) => {
        const taskDocRef = doc(db,'tasks', id);
        try{
            await deleteDoc(taskDocRef);
            load_tasks();
        }catch(err){
            console.error("Erro ao deletar tarefa: ",err)
        }
    };


    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const text = taskInput.value.trim(); 

        if (text) { 
            try{
                await addDoc(tasksCollectionRef,{
                    text: text,
                    finished: false,
                    createAt: new Date()
                });
                taskInput.value = ''; 
                load_tasks(); 
            }catch(err){
                console.error("Erro ao adicionar tarefa: ", err)
            }
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