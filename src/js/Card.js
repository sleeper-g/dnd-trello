export default class Card {
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
