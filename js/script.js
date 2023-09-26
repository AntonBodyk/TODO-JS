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
    updateTodo({id: id, completed: !completed})
    .then(() => {
        console.log(id);
        document.getElementById(`todo_${id}`).classList.toggle(`completed`);
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
        console.log(response);
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
    await updateTodoStatus(el.target.getAttribute('todo-id'));
}

// const filterLink = document.querySelectorAll('.filter__link'),
//       filterElements = document.querySelectorAll('.todo');
// console.log(filterElements);

// async function filterItems(){
//     filterLink.forEach(link => {
//         link.addEventListener('click', () => {
//             console.log(location.hash);
//             switch(location.hash){
//                 case '#/':
//                     break
//                 case '#/active':
//                     filterElements.forEach(item => {
//                         if(item.classList.contains('todo active')){
//                             item.style.display = 'block';
//                         }else{
//                             item.style.display = 'none';
//                         }
//                     });
//                     break
//                 case '#/completed':
//                     break
//             }
//         });
//     })
// }
// filterItems();

// function delCompletedTodo(id){
    
//     deleteCompletedTodo(id)
//     .then(() => {
//         let deleteElement = document.querySelectorAll('.todo completed').remove();
//         console.log(deleteElement);
//     });
// }

// const completedDelButton = document.querySelector('.todoapp__clear-completed');

// completedDelButton.addEventListener('click', () => {
//     delCompletedTodo();
// });

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




