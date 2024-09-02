/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/Card.js
class Card {
  constructor(parent, value) {
    this.parent = parent;
    this.value = value;
  }
  addTask() {
    const newEl = document.createElement("li");
    newEl.classList.add("task");
    newEl.textContent = this.value;
    newEl.draggable = true;
    this.parent.appendChild(newEl);
  }
}
;// CONCATENATED MODULE: ./src/js/Board.js

class Board {
  constructor() {
    this.board = null;
    this.tasksTodo = [];
    this.tasksInP = [];
    this.tasksDone = [];
    this.tasks = [this.tasksTodo, this.tasksInP, this.tasksDone];
    this.addInput = this.addInput.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.closeBtnEvent = this.closeBtnEvent.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.saveListOfTasks = this.saveListOfTasks.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.drawSavedTasks = this.drawSavedTasks.bind(this);
    this.showPossiblePlace = this.showPossiblePlace.bind(this);
  }
  init() {
    this.drawBoard();
    this.drawSavedTasks();
    const addList = this.board.querySelectorAll(".column-add");
    [...addList].forEach(el => el.addEventListener("click", this.addInput));
    window.addEventListener("beforeunload", this.saveListOfTasks);
  }
  static get markupBoard() {
    return `<div class="column">
    <h2 class="column-header">todo</h2>
    <ul class="tasks-list todo"></ul>
    <div class="column-add">Add another card</div>
  </div>
  <div class="column">
    <h2 class="column-header">in progress</h2>
    <ul class="tasks-list in-progress" id="trew"></ul> 
    <div class="column-add">Add another card</div>
  </div>
  <div class="column">
    <h2 class="column-header">done</h2>
    <ul class="tasks-list done"></ul>
    <div class="column-add">Add another card</div>
  </div>`;
  }
  static get markupInput() {
    return `
    <textarea class="add-form-textarea" type ="text"
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
    const parent = closestColumn.querySelector(".tasks-list");
    const taskValue = closestColumn.querySelector(".add-form-textarea").value;
    if (taskValue) {
      new Card(parent, taskValue).addTask();
      const columnAdd = document.createElement("div");
      columnAdd.classList.add("column-add");
      columnAdd.textContent = "Add card";
      closestColumn.removeChild(closestColumn.querySelector(".column-add-form"));
      closestColumn.appendChild(columnAdd);
      columnAdd.addEventListener("click", this.addInput);
      this.addListeners();
    } else {
      alert("Add some text!");
    }
  }
  saveListOfTasks() {
    this.tasksTodo = [];
    this.tasksInP = [];
    this.tasksDone = [];
    const todo = this.board.querySelector(".todo");
    const inP = this.board.querySelector(".in-progress");
    const done = this.board.querySelector(".done");
    const tasksTodo = [...todo.querySelectorAll(".task")];
    const tasksInP = [...inP.querySelectorAll(".task")];
    const tasksDone = [...done.querySelectorAll(".task")];
    tasksTodo.forEach(task => this.tasksTodo.push(task.textContent));
    tasksInP.forEach(task => this.tasksInP.push(task.textContent));
    tasksDone.forEach(task => this.tasksDone.push(task.textContent));
    this.tasks = [this.tasksTodo, this.tasksInP, this.tasksDone];
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
  drawSavedTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
    const parents = [".todo", ".in-progress", ".done"];
    for (let index = 0; index < parents.length; index += 1) {
      const parent = this.board.querySelector(parents[index]);
      this.tasks[index].forEach(elem => {
        new Card(parent, elem).addTask();
        if (index === 0) {
          this.tasksTodo.push(elem);
        }
        if (index === 1) {
          this.tasksInP.push(elem);
        }
        if (index === 2) {
          this.tasksDone.push(elem);
        }
      });
      this.addListeners();
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
  addListeners() {
    const taskList = this.board.querySelectorAll(".task");
    [...taskList].forEach(el => el.addEventListener("mouseover", this.closeBtnEvent));
    [...taskList].forEach(el => el.addEventListener("mouseleave", this.onTaskLeave));
    [...taskList].forEach(el => el.addEventListener("mousedown", this.mouseDown));
  }
  removeTask(event) {
    const task = event.target.closest(".task");
    const parent = event.target.closest(".tasks-list");
    parent.removeChild(task);
  }
  closeBtnEvent(event) {
    if (event.target.classList.contains("task") && !event.target.querySelector(".close")) {
      const closeEl = document.createElement("div");
      closeEl.classList.add("task-list-close");
      closeEl.classList.add("close");
      event.target.appendChild(closeEl);
      closeEl.style.top = `${closeEl.offsetTop - closeEl.offsetHeight / 2}px`;
      closeEl.style.left = `${event.target.offsetWidth - closeEl.offsetWidth - 3}px`;
      closeEl.addEventListener("click", this.removeTask);
    }
  }
  onTaskLeave(event) {
    event.target.removeChild(event.target.querySelector(".close"));
  }
  mouseDown(event) {
    if (event.target.classList.contains("task")) {
      this.dragged = event.target;
      this.hidden = event.target.cloneNode(true);
      this.hidden.removeChild(this.hidden.querySelector(".close"));
      this.hidden.classList.add("dragged");
      this.hidden.classList.add("ghost");
      this.hidden.style.width = `${this.dragged.offsetWidth}px`;
      this.hidden.style.height = `${this.dragged.offsetHeight}px`;
      document.body.appendChild(this.hidden);
      const {
        top,
        left
      } = event.target.getBoundingClientRect();
      this.top = event.pageY - top;
      this.left = event.pageX - left;
      this.hidden.style.top = `${top - this.dragged.offsetHeight}px`;
      this.hidden.style.left = `${left - this.board.offsetWidth}px`;
      this.hidden.style.width = `${this.dragged.offsetWidth}px`;
      this.hidden.style.height = `${this.dragged.offsetHeight}px`;
      this.board.addEventListener("mousemove", this.dragMove);
      document.addEventListener("mousemove", this.showPossiblePlace);
      document.addEventListener("mouseup", this.mouseUp);
    }
  }
  dragMove(event) {
    event.preventDefault();
    if (!this.dragged) {
      return;
    }
    this.dragged.style.display = "none";
    this.hidden.style.top = `${event.pageY - this.top}px`;
    this.hidden.style.left = `${event.pageX - this.left}px`;
  }
  mouseUp() {
    if (!this.dragged || !this.newPlace) {
      return;
    }
    this.newPlace.replaceWith(this.dragged);
    this.dragged.style.display = "flex";
    document.body.removeChild(document.body.querySelector(".dragged"));
    this.hidden = null;
    this.dragged = null;
  }
  showPossiblePlace(event) {
    event.preventDefault();
    if (!this.dragged) {
      return;
    }
    const closestColumn = event.target.closest(".column");
    if (closestColumn) {
      const closestColumnTask = closestColumn.querySelector(".tasks-list");
      const allTasks = closestColumn.querySelectorAll(".task");
      const allPos = [closestColumn.getBoundingClientRect().top];
      if (allTasks) {
        for (const item of allTasks) {
          allPos.push(item.getBoundingClientRect().top + item.offsetHeight / 2);
        }
      }
      if (!this.newPlace) {
        this.newPlace = document.createElement("div");
        this.newPlace.classList.add("task-list__new-place");
      }
      this.newPlace.style.width = `${this.hidden.offsetWidth}px`;
      this.newPlace.style.height = `${this.hidden.offsetHeight}px`;
      const itemIndex = allPos.findIndex(item => item > event.pageY);
      if (itemIndex !== -1) {
        closestColumnTask.insertBefore(this.newPlace, allTasks[itemIndex - 1]);
      } else {
        closestColumnTask.appendChild(this.newPlace);
      }
    }
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

new Board().init();
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;
//# sourceMappingURL=main.js.map