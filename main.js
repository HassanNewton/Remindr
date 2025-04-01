let todos = [
  {
    title: "Drink Milk",
    status: "Pending",
  },
  {
    title: "Breakfast",
    status: "Pending",
  },
  {
    title: "Eat Lunch",
    status: "Complete",
  },
  {
    title: "Sleep",
    status: "Pending",
  },
];

getTodosFromStorage();

let todoForm = document.querySelector(".todo-form form");
let htmlBody = document.querySelector(".todo-table tbody");

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let todoTitle = todoForm.todotitle.value;

  addTodoItem(todoTitle);
  renderTodo();
  calculateTodoStatus();
  todoForm.todotitle.value = "";
});

htmlBody.addEventListener("click", function (e) {
  if (e.target.getAttribute("type") == "checkbox") {
    if (e.target.checked) {
      todos[e.target.id].status = "Complete";
    } else {
      todos[e.target.id].status = "Pending";
    }
    renderTodo();
    calculateTodoStatus();
  }
});

htmlBody.addEventListener("dblclick", (e) => {
  console.log(e.target.nodeName);
  if (e.target.nodeName == "TD") {
    let tr = e.target.parentNode;
    tr.remove();
    calculateTodoStatus();
  }
});

const addTodoItem = (title) => {
  if (title == "") {
    return;
  }
  //   let htmlContent = `<tr>
  //                         <td><input type="checkbox"></td>
  //                         <td>${title}</td>
  //                         <td>Pending</td>
  //                     </tr>`;

  //   htmlBody.innerHTML += htmlContent;

  todos.push({
    title,
    status: "Pending",
  });
};

function calculateTodoStatus() {
  let total = 0;
  let complete = 0;
  for (let todo of todos) {
    total++;
    if (todo.status == "Complete") {
      complete++;
    }
  }
  let status = document.querySelector(".todo-table small");

  if (total == complete) {
    status.innerHTML = `Congratulations!!! All Tasks completed.`;
  } else {
    status.innerHTML = `${total} Total, ${complete} Complete and ${
      total - complete
    } Pending`;
  }
}

function renderTodo() {
  htmlBody.innerHTML = "";
  if (todos.length <= 0) {
    htmlBody.innerHTML = `<tr>
                                    <td colspan="3">No Todos added till now.</td>
                                </tr>`;
  }
  todos.forEach(function (todo, i) {
    htmlBody.innerHTML += `<tr class="${
      todo.status == "Complete" ? "complete" : ""
    }">
                                    <td><input type="checkbox" ${
                                      todo.status == "Complete" ? "checked" : ""
                                    } name="" id="${i}"></td>
                                    <td>${todo.title}</td>
                                    <td>${todo.status}</td>
                                </tr>`;
  });
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodosFromStorage() {
  if (localStorage.getItem("todos") == null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
}

renderTodo();
