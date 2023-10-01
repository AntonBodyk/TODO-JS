import { client } from './fetchClient.js';

export const getTodos = (userId) => {
  return client.get(`/todos?userId=${userId}`);
};


// Add more methods here

export const createNewTodo = (todo) => {
  return client.post(`/todos`, todo);
}

export const deleteTodo = (id) => {
  return client.delete(`/todos/${id}`);
}

export const updateTodo = (todo) => {
  return client.patch(`/todos/${todo.id}`, todo);
}

export const deleteCompletedTodo = () => {
  return client.delete('/todos/completed');
}