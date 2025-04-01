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

htmlBody.addEventListener("click", (e) => {
  console.log(e.target.checked);
  if (e.target.getAttribute("type") == "checkbox") {
    let tr = e.target.parentNode.parentNode;
    if (e.target.checked) {
      tr.classList.add("complete");
      tr.lastElementChild.innerHTML = "Complete";
    } else {
      tr.classList.remove("complete");
      tr.lastElementChild.innerHTML = "Pending";
    }
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

const calculateTodoStatus = () => {
  let total = 0;
  let complete = 0;
  let checkboxes = document.querySelectorAll(
    '.todo-table table tbody input[type="checkbox"]'
  );
  for (let checkbox of checkboxes) {
    total++;
    if (checkbox.checked) {
      complete++;
      checkbox.setAttribute("checked", "");
    }
  }

  let status = document.querySelector(".todo-table small");

  if (total == complete) {
    status.innerHTML = `Congratulations All Tasks are Completed`;
  } else {
    status.innerHTML = `${total} Total, ${complete} Complete and ${
      total - complete
    } pending`;
  }
};

const renderTodo = () => {
  htmlBody.innerHTML = "";

  todos.forEach((todo, i) => {
    htmlBody.innerHTML += `<tr ${todo.status == "Complete" ? "complete" : ""}>
                        <td><input type="checkbox" ${
                          todo.status == "complete" ? "checked" : ""
                        } id="${i}"></td>
                        <td>${todo.title}</td>
                        <td>${todo.status}</td>
                    </tr>`;
  });
};

renderTodo();
