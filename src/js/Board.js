import Card from "./Card";

export default class Board {
  constructor() {
    this.board = null;
    this.taskTodo = [];
    this.taskProgess = [];
    this.taskDone = [];
    this.tasks = [this.taskTodo, this.taskProgess, this.taskDone];
    this.addInput = this.addInput.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }
  init() {
    this.drawBoard();
    const addList = this.board.querySelectorAll(".column-add");
    [...addList].forEach((el) => el.addEventListener("click", this.addInput));
  }
  drawBoard() {
    this.board = document.createElement("main");
    this.board.classList.add("board");
    this.board.innerHTML = `<div class="column">
          <h2 class="column-header">Todo</h2>
          <ul class="task-list todo"></ul>
          <div class="column-add">Add another card</div>
        </div>
        <div class="column">
          <h2 class="column-header">In Progress</h2>
          <ul class="task-list progress"></ul>
          <div class="column-add">Add another card</div>
        </div>
        <div class="column">
          <h2 class="column-header">Done</h2>
          <ul class="task-list done"></ul>
          <div class="column-add">Add another card</div>
        </div>
        `;
    document.querySelector("body").appendChild(this.board);
  }
  addInput(event) {
    const newCardForm = document.createElement("form");
    newCardForm.classList.add("column-add-form");
    newCardForm.innerHTML = `
        <textarea class="add-form-textarea" type="text" 
        placeholder="Enter a title for this card"></textarea>
        <div class="add-form-card">
          <button class="add-form-add-card">Add Card</button>
          <button class="add-form-close-card"></button>
        </div>
        `;
    const closestColumn = event.target.closest(".column");
    event.target.replaceWith(newCardForm);
    const add = closestColumn.querySelector(".add-form-add-card");
    const close = closestColumn.querySelector(".add-form-close-card");
    add.addEventListener("click", this.addNewTask);
    close.addEventListener("click", this.closeForm);
  }
  addNewTask(event) {
    event.preventDefault();
    const closestColumn = event.target.closest(".column");
    const parent = closestColumn.querySelector(".task-list");
    const taskValue = closestColumn.querySelector(".add-form-textarea").value;
    if (taskValue) {
      new Card(parent, taskValue).addTask();
      const columnAdd = document.createElement("div");
      columnAdd.classList.add("column-add");
      columnAdd.textContent = "Add card";
      console.log(columnAdd);
      closestColumn.removeChild(
        closestColumn.querySelector(".column-add-form"),
      );
      closestColumn.appendChild(columnAdd);
      columnAdd.addEventListener("click", this.addInput);
    } else {
      alert("Add some text!");
    }
  }
  closeForm(event) {
    event.preventDefault();
    const columnAdd = document.createElement("div");
    columnAdd.classList.add("column-add");
    columnAdd.textContent = "Add another card";
    const parent = event.target.closest(".column");
    const child = parent.querySelector(".column-add-form");
    parent.removeChild(child);
    parent.appendChild(columnAdd);
    columnAdd.addEventListener("click", this.addInput);
  }
  removeTask(event) {
    const task = event.target.closest(".task");
    const parent = event.target.closest(".task-list");
    parent.removeChild(task);
  }
}
