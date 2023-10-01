import { deleteTodo, getTodos, createNewTodo, updateTodo, deleteCompletedTodo } from "./requests.js";


function todosRender(todo){
    let todoBlock = document.querySelector('.todoapp__main');
    let element = document.createElement('div');

    element.innerHTML = `
        <div data-cy="Todo" id="todo_${todo.id}" class="todo ${todo.completed ? 'completed' : ''}">
            <label class="todo__status-label">
            <input
                data-cy="TodoStatus"
                type="checkbox"
                class="todo__status"
                todo-id="${todo.id}"
                ${todo.completed  ? 'checked' : ''}
            />
            </label>

            <span data-cy="TodoTitle" class="todo__title">
            ${todo.title}
            </span>
            <button type="button" class="todo__remove" data-cy="TodoDelete" todo-id="${todo.id}">
            ×
            </button>

        </div>
    `;
   
    todoBlock.appendChild(element);
    return todoBlock;
}

function todosCount(count){
    let todoCountBlock = document.querySelector('.todoapp__footer .todo-count span');
    todoCountBlock.innerHTML = count;
}

async function delTodo(id){
    deleteTodo(id)
    .then(() => {
        document.getElementById(`todo_${id}`).remove();
        todosCount(document.querySelectorAll('.todo').length);
    })
}

async function updateTodoStatus(id, completed){
    updateTodo({id: id, completed: completed})
    .then(() => {
        document.getElementById(`todo_${id}`).classList.toggle('completed');
    })
}

const input = document.querySelector('.todoapp__new-todo');

input.addEventListener('keypress', (e) => {
    if(e.keyCode === 13){
        e.preventDefault();
        addAndRender(e.target);
    }
});

function addAndRender(inputElement) {
    const todoText = inputElement.value;
    createNewTodo({title: todoText, completed: false})
    .then((response) => {
        todosRender(response.data);
        input.value = '';
        todosCount(document.querySelectorAll('.todo').length);
      })
      .catch((error) => {
        console.log(error);
      });
}


async function buttonClick(el){
    await delTodo(el.target.getAttribute('todo-id'));
}

async function statusClick(el){
    await updateTodoStatus(el.target.getAttribute('todo-id'), el.target.checked);
}

const filterLink = document.querySelectorAll('.filter__link');

let onClick = function (event) {
    event.preventDefault();
  
    for (let i = 0; i < filterLink.length; i++) {
        filterLink[i].classList.remove('selected');
    }
  
    event.currentTarget.classList.add('selected');
};

for (let i = 0; i < filterLink.length; i++) {
    filterLink[i].addEventListener('click', onClick, false);
}

document.querySelector('.filter').addEventListener('click', event => {

    if(event.target.tagName !== 'A') return false;
    const filterElements = document.querySelectorAll('.todo');
    let filterClass = event.target.dataset['filter'];

    filterElements.forEach(element => {
        switch (filterClass){
            case 'active':
                if(element.classList.contains('completed')){
                    element.style.display = 'none';
                }else{
                    element.style.display = 'grid';
                }
                break;
            case 'completed':
                if(element.classList.contains('completed')){
                    element.style.display = 'grid';
                }else{
                    element.style.display = 'none';
                }
                break;
            default: 
                element.style.display = 'grid';
        }
    });
});

function delCompletedTodo(){
    deleteCompletedTodo()
    .then(()  => {
        let deleteElement = document.querySelectorAll('.completed');
        deleteElement.forEach(element => element.remove());
        todosCount(document.querySelectorAll('.todo').length);
    });
}

const completedDelButton = document.querySelector('.todoapp__clear-completed');

completedDelButton.addEventListener('click', () => {
    console.log('click')
    delCompletedTodo();
});




document.addEventListener('DOMContentLoaded', () =>{
    
    getTodos('todos')
    .then(data =>{
        console.log(data);
        todosCount(data.length);
        
        data.forEach((todo) => {
            todosRender(todo);
        });
        document.querySelectorAll('.todo__remove').forEach((el) => {
            el.addEventListener('click', buttonClick);
        });
        document.querySelectorAll('.todo__status').forEach((el) => {
            el.addEventListener('click', statusClick);
        });
    });
});




