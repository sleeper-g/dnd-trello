/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/Card.js
class Card {
  constructor(parent, value) {
    this.parent = parent;
    this.value = value;
  }
  addTask() {
    const newEl = document.createElement("div");
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
    <div class="tasks-list todo"></div>
    <div class="column-add">Add another card</div>
  </div>
  <div class="column">
    <h2 class="column-header">in progress</h2>
    <div class="tasks-list in-progress"></div> 
    <div class="column-add">Add another card</div>
  </div>
  <div class="column">
    <h2 class="column-header">done</h2>
    <div class="tasks-list done"></div>
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
    document.querySelector("body").append(this.board);
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
      columnAdd.textContent = "Add another card";
      closestColumn.querySelector(".column-add-form").remove();
      closestColumn.append(columnAdd);
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
    } else {
      this.tasks = [[], [], []];
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
    child.remove();
    parent.append(columnAdd);
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
    task.remove();
  }
  closeBtnEvent(event) {
    if (event.target.classList.contains("task") && !event.target.querySelector(".close")) {
      const closeEl = document.createElement("div");
      closeEl.classList.add("task-list-close");
      closeEl.classList.add("close");
      event.target.append(closeEl);
      closeEl.style.top = `${closeEl.offsetTop - closeEl.offsetHeight / 2}px`;
      closeEl.style.left = `${event.target.offsetWidth - closeEl.offsetWidth - 3}px`;
      closeEl.addEventListener("click", this.removeTask);
    }
  }
  onTaskLeave(event) {
    event.target.querySelector('.close').remove();
  }
  mouseDown(event) {
    event.preventDefault();

    // if click on close elem
    if (event.target.classList.contains("close")) return;
    const clickedTask = event.target.closest(".task");
    if (!clickedTask) return;
    if (!this.dragged) {
      this.dragged = clickedTask;
      this.dragged.style.width = `${clickedTask.offsetWidth}px`;
      this.dragged.style.height = `${clickedTask.offsetHeight}px`;
    }
    //this.hidden = event.target.cloneNode(true);
    //this.hidden.classList.toggle("hidden")
    if (!this.hidden) {
      this.hidden = document.createElement("div");
      this.hidden.classList.add("hidden");
      this.hidden.style.width = `${clickedTask.offsetWidth}px`;
      this.hidden.style.height = `${clickedTask.offsetHeight}px`;
      this.dragged.after(this.hidden);
    }
    ;
    // cursor offset
    this.shift = {
      // somehow it work
      x: event.clientX - 10,
      y: event.clientY - clickedTask.getBoundingClientRect().top + 70
    };
    // start position
    this.dragged.style.top = `${event.pageY - this.shift.y}px`;
    this.dragged.style.left = `${event.pageX - this.shift.x}px`;
    this.dragged.classList.toggle("dragged");
    document.addEventListener("mousemove", this.showPossiblePlace);
    document.addEventListener("mouseup", this.mouseUp);
  }
  mouseUp() {
    if (!this.dragged || !this.hidden) return;
    document.removeEventListener("mousemove", this.showPossiblePlace);
    this.dragged.removeAttribute("style");
    this.hidden.before(this.dragged);
    this.dragged.classList.remove("dragged");
    this.hidden.remove();
    this.dragged = null;
    this.hidden = null;
  }
  showPossiblePlace(event) {
    event.preventDefault();
    if (!this.dragged || !event.target.closest) return;
    this.dragged.style.top = `${event.pageY - this.shift.y}px`;
    this.dragged.style.left = `${event.pageX - this.shift.x}px`;
    const targetEl = event.target.closest(".task");
    if (!targetEl && !event.target.classList.contains("tasks-list")) return;
    if (event.target.classList.contains("tasks-list")) {
      const listCard = [...event.target.children].filter(card => !card.classList.contains("dragged") && !card.classList.contains("hidden"));

      // empty column
      if (listCard && !listCard.length) {
        this.hidden.remove();
        event.target.append(this.hidden);
      } else {
        // mouse lower last element
        if (event.clientY - 146 > listCard[listCard.length - 1].offsetTop - listCard[listCard.length - 1].offsetHeight) {
          // last elem is hidden
          if (!event.target.children[event.target.children.length - 1].classList.contains("hidden")) {
            this.hidden.remove();
            event.target.append(this.hidden);
          }
          ;
        } else {
          if (event.clientY - 100 < listCard[0].offsetTop) {
            this.hidden.remove();
            listCard[0].before(this.hidden);
            return;
          }
          for (let item in listCard) {
            let res = event.clientY - 100 > listCard[item].offsetTop && event.clientY - 100 < listCard[item].offsetTop + listCard[item].offsetHeight / 2 ? true : false;
            if (res) {
              this.hidden.remove();
              listCard[item].after(this.hidden);
              return;
            }
          }
        }
        ;
      }
      ;
    }
    ;
  }
}
;
;// CONCATENATED MODULE: ./src/js/app.js

new Board().init();
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;
//# sourceMappingURL=main.js.map