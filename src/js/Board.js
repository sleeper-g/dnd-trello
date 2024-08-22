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
    this.saveTasks = this.saveTasks.bind(this);
    this.drawTasks = this.drawTasks.bind(this);
    this.closeBtnEvent = this.closeBtnEvent.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseBtn = this.mouseBtn.bind(this);
  }
  init() {
    this.drawBoard();
    this.drawTasks();
    const addList = this.board.querySelectorAll(".column-add");
    [...addList].forEach((el) => el.addEventListener("click", this.addInput));
    document.addEventListener("beforeunload", this.saveTasks);
  }
  static get markupBoard() {
    return `<div class="column">
          <h2 class="column-header">Todo</h2>
          <ul class="task-list todo"></ul>
          <div class="column-add">Add another card</div>
        </div>
        <div  class="column">
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
  }
  static get markupInput() {
    return `<textarea class="add-form-textarea" type="text" 
        placeholder="Enter a title for this card"></textarea>
        <div class="add-form-card">
          <button class="add-form-add-card">Add Card</button>
          <button class="add-form-close-card"></button>
        </div>`;
  }
  drawBoard() {
    this.board = document.createElement("main");
    this.board.classList.add("board");
    this.board.innerHTML = this.constructor.markupBoard;
    document.querySelector("body").appendChild(this.board);
  }
  addInput(event) {
    const newCardForm = document.createElement("form");
    newCardForm.classList.add("column-add-form");
    newCardForm.innerHTML = this.constructor.markupInput;
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
      closestColumn.removeChild(
        closestColumn.querySelector(".column-add-form"),
      );
      closestColumn.appendChild(columnAdd);
      columnAdd.addEventListener("click", this.addInput);
      this.mouseBtn();
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
  saveTasks() {
    this.taskTodo = [];
    this.taskProgess = [];
    this.taskDone = [];
    const todo = this.board.querySelector(".todo");
    const progress = this.board.querySelector(".progress");
    const done = this.board.querySelector(".done");
    const listTodo = [...todo.querySelectorAll(".task")];
    const listProgress = [...progress.querySelectorAll(".task")];
    const listDone = [...done.querySelectorAll(".task")];
    listTodo.forEach((elem) => this.taskTodo.push(elem.textContent));
    listProgress.forEach((elem) => this.taskProgess.push(elem.textContent));
    listDone.forEach((elem) => this.taskDone.push(elem.textContent));
    this.tasks = [this.taskTodo, this.taskProgess, this.taskDone];
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
  drawTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
      let index;
      const taskLists = document.querySelectorAll(".task-list");
      for (index in this.tasks) {
        this.tasks[index].forEach((elem) => {
          new Card(taskLists[index], elem).addTask();
          if (index == 0) {
            this.taskTodo.push(elem);
          }
          if (index == 1) {
            this.taskProgess.push(elem);
          }
          if (index == 2) {
            this.taskDone.push(elem);
          }
        });
      }
    } else {
      console.warn("empty localStorage");
    }
    this.mouseBtn();
  }
  closeBtnEvent(event) {
    if (
      event.target.classList.contains("task") &&
      !event.target.querySelector(".closeBtn")
    ) {
      const closeBtn = document.createElement("div");
      closeBtn.classList.add("task-list-close");
      closeBtn.classList.add("closeBtn");
      event.target.appendChild(closeBtn);
      closeBtn.style.top = `${closeBtn.offsetTop - closeBtn.offsetHeight / 2}px`;
      closeBtn.style.left = `${event.target.offsetWidth - closeBtn.offsetWidth - 3}px`;
      closeBtn.addEventListener("click", this.removeTask);
    }
  }
  mouseBtn() {
    const taskLists = this.board.querySelectorAll(".task");
    [...taskLists].forEach((elem) => {
      elem.addEventListener("mouseover", this.closeBtnEvent);
    });
    [...taskLists].forEach((elem) => {
      elem.addEventListener("mouseleave", this.mouseLeave);
    });
    [...taskLists].forEach((elem) => {
      elem.addEventListener("mousedown", this.mouseDown);
    });
  }
  mouseLeave(event) {
    event.target.removeChild(event.target.querySelector(".closeBtn"));
  }
  mouseDown(event) {
    if (event.target.classList.contains("task")) {
      this.dragged = event.target;
      this.ghostEl = event.target.cloneNode(true);
      console.log(this.ghostEl);
    }
  }
}
