const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const submButtn = document.querySelector('#addbtn');
const delDoneBtn = document.querySelector('#removeDoneTasks');

let tasks = [];
let edited = true;

if (localStorage.getItem('tasks')) {
    let j = 0;
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => {
        j++
        renderTask(task, j)}
        );
} 

checkEmptylist()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
tasksList.addEventListener('click', editTask)
delDoneBtn.addEventListener('click', deleteDone)


function addTask(e){
    e.preventDefault(); //предотвращение отправки формы
    const taskTxt = taskInput.value  

    const newTask = {
        id: Date.now(),
        text: taskTxt,
        done: false
    }

    tasks.push(newTask);
    let i = tasks.length;
    saveToLocal();

    renderTask(newTask, i);
    taskInput.value = ""
    taskInput.focus()
    checkEmptylist()
}

function deleteTask(e){
    if (e.target.dataset.action !== 'delete') return;
    const taskItem = e.target.closest('li');
    const id = taskItem.id 
    const index = tasks.findIndex((task) => task.id == id); 
    tasks.splice(index, 1);
    taskItem.remove()
    saveToLocal();
    location.reload();
    checkEmptylist()
}
function deleteDone(e){
    if (e.target.dataset.action !== 'deletedone') return;
    tasks = tasks.filter((task) => task.done == false);
    saveToLocal();
    tasksList.innerHTML = '';
    checkEmptylist();

    let j = 0;
    tasks.forEach((task) => {
        j++
        renderTask(task, j)}
        );

}

function editTask(e){
    if (e.target.dataset.action !== 'edit') return;
    const taskItem = e.target.closest('li');  
    const span = taskItem.firstElementChild;
    const div1 = span.firstElementChild;
    const div_edit = div1.firstElementChild;
    const editArea = div1.lastElementChild;
    const id = taskItem.id     
    const index = tasks.findIndex((task) => task.id == id);
    let task = tasks[index];
    e.preventDefault(); 
    if (edited){
        edited = false;
        taskItem.style.background = "#81c98d93"
        div_edit.classList.add('none');
        editArea.classList.remove('none');
        editArea.value = div_edit.innerText;
    } else {
        edited = true;
        taskItem.style.background = "#e5ebe6d8"
        div_edit.classList.remove('none');
        editArea.classList.add('none');
        task.text = editArea.value;
        div_edit.innerText = task.text;
        tasks.slice(index, 1, task)
        saveToLocal();
    }

}

function doneTask(e){
    if (e.target.dataset.action !== 'done'){
        return
    } 
    const taskItem = e.target.closest('li');
    const id = taskItem.id;
    const findTask = tasks.find((task)=> task.id == id) //возвращает элемент
    findTask.done = !findTask.done;
    saveToLocal();
    const task = taskItem.querySelector('span')
    task.classList.toggle('task-done')
}

function checkEmptylist(){
    if (tasks.length == 0){
        const emptyListHTML = `
        <li id="emptyList" class="empty-list">
            <img src="./image/leaf2.svg" alt="Empty" width="48" class="">
            <div class="empty-list-title">Список пуст</div>
        </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    } else {
        const emplyListEl = document.querySelector('#emptyList')
        emplyListEl ? emplyListEl.remove() : null;
    }
}

function saveToLocal(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task, i){
    const cssClass = task.done ? 'task-title task-done':'task-title';
    //html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const taskHTML = `
        <li id = "${task.id}" class="displ-f">
            <span class="${cssClass}">
                <div class="d-f">${i}) 
                <div class = "child"><xmp>${task.text}</xmp></div>
                <input class = "none texteditor" type="text"> 
                </div>
            
                <div class="task-buttons">
                    <button type="button" data-action="edit" class="btn-action" title="для выхода из режима редактирования снова нажмите сюда">
                        <img src="./image/edit.svg" alt="Edit" width="18" height="18">
                    </button>
                    <button type="button" data-action="done" class="btn-action">
                        <img src="./image/tick.svg" alt="Done" width="18" height="18">
                    </button>
                    <button type="button" data-action="delete" class="btn-action">
                        <img src="./image/cross.svg" alt="Done" width="18" height="18">
                    </button>
                </div>
            </span>
        </li>
    `
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}