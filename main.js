// En tom array för att lagra todos
let todos = [];

// Hämta befintliga todos från servern när sidan laddas
getTodosFromServer();

// Hämtar formuläret för att lägga till todo och tabellens kropp (där todos ska renderas)
let todoForm = document.querySelector(".todo-form form");
let todoBody = document.querySelector("#todo-body");

// Eventlyssnare för formulärinlämning för att lägga till en ny todo
todoForm.addEventListener("submit", async function (e) {
  e.preventDefault(); // Förhindrar standardbeteendet för formulärinlämning
  let todoTitle = todoForm.todotitle.value; // Hämtar titeln på den nya todo
  if (todoTitle === "") return; // Om titeln är tom, avsluta funktionen

  // Skapar ett nytt todo-objekt med titeln och sätter statusen till "Pending"
  const newTodo = { title: todoTitle, status: "Pending" };

  // Sparar den nya todo till servern och uppdaterar användargränssnittet
  await saveTodoToServer(newTodo);
  await getTodosFromServer(); // Hämta todos igen för att uppdatera listan
  calculateTodoStatus(); // Beräkna och uppdatera todo-statusen
  todoForm.todotitle.value = ""; // Rensa inmatningsfältet efter att todo har lagts till
});

// Eventlyssnare för klick på checkbox för att växla todo-status (Complete/Pending)
todoBody.addEventListener("click", async function (e) {
  if (e.target.getAttribute("type") == "checkbox") { // Om en checkbox klickas
    let id = e.target.id; // Hämtar ID för todo (checkbox ID)
    let newStatus = e.target.checked ? "Complete" : "Pending"; // Bestämmer den nya statusen baserat på checkboxens tillstånd

    // Uppdaterar todo-statusen på servern
    await updateTodoStatus(id, newStatus);
    await getTodosFromServer(); // Hämta todos igen för att uppdatera listan
    calculateTodoStatus(); // Beräkna och uppdatera todo-statusen
  }
});

// Eventlyssnare för dubbelklick på en todo för att ta bort den
todoBody.addEventListener("dblclick", async (e) => {
  if (e.target.nodeName == "TD") { // Om en cell i tabellen dubbelklickas
    let tr = e.target.parentNode; // Hämta raden där dubbelklicket skedde
    let id = tr.querySelector("input").id; // Hämta ID för todo (från checkbox)
    
    // Ta bort todo från servern
    await deleteTodoFromServer(id);
    await getTodosFromServer(); // Hämta todos igen för att uppdatera listan
    calculateTodoStatus(); // Beräkna och uppdatera todo-statusen
  }
});

// Funktion för att beräkna och visa status för alla todos
function calculateTodoStatus() {
  let total = todos.length; // Totalt antal todos
  let complete = todos.filter((todo) => todo.status === "Complete").length; // Antal completos todos
  let status = document.querySelector(".todo-table small"); // Hämtar status-raden i tabellen

  // Uppdatera statusmeddelandet baserat på hur många todos som är kompletta
  if (total === complete && total !== 0) {
    status.innerHTML = `Congratulations!!! All Tasks completed.`; // Om alla är kompletta
  } else {
    status.innerHTML = `${total} Total, ${complete} Complete and ${total - complete} Pending`; // Om inte alla är kompletta
  }
}

// Funktion för att rendera todos i tabellen
function renderTodo() {
  todoBody.innerHTML = ""; // Rensa existerande todos
  if (todos.length <= 0) {
    todoBody.innerHTML = `<tr><td colspan="3">No Todos added till now.</td></tr>`; // Om inga todos finns, visa meddelande
    return;
  }

  const template = document.getElementById("todoRowTemplate"); // Hämta todo-rad-mallen
  todos.forEach(function (todo) { // Loopar genom varje todo
    const clone = template.content.cloneNode(true); // Klona innehållet i mallen

    const checkbox = clone.querySelector(".todo-checkbox"); // Hämtar checkbox-elementet
    const title = clone.querySelector(".todo-title"); // Hämtar title-elementet
    const status = clone.querySelector(".todo-status"); // Hämtar status-elementet

    checkbox.id = todo.id; // Sätter checkboxens ID
    checkbox.checked = todo.status === "Complete"; // Sätter checkboxen som ikryssad om status är "Complete"
    title.textContent = todo.title; // Sätter todo-titeln
    status.textContent = todo.status; // Sätter todo-statusen

    todoBody.appendChild(clone); // Lägg till den klonade raden i tabellens kropp
  });
}

// Funktion för att hämta todos från servern
async function getTodosFromServer() {
  try {
    const response = await fetch("http://localhost:3000/todos"); // Hämtar todos från servern
    const data = await response.json(); // Omvandla svar till JSON
    todos = data; // Uppdatera todos-arrayen
    renderTodo(); // Rendera todos i tabellen
    calculateTodoStatus(); // Uppdatera todo-status
  } catch (error) {
    console.error("Error fetching todos:", error); // Hantera eventuella fel
  }
}

// Funktion för att spara en ny todo till servern
async function saveTodoToServer(todo) {
  try {
    await fetch("http://localhost:3000/todos", {
      method: "POST", // Använd POST-metoden för att skapa en ny todo
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo), // Skicka todo som JSON
    });
  } catch (error) {
    console.error("Error saving todo:", error); // Hantera eventuella fel
  }
}

// Funktion för att uppdatera status för en todo på servern
async function updateTodoStatus(id, status) {
  try {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH", // Använd PATCH-metoden för att uppdatera status
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }), // Skicka den nya statusen som JSON
    });
  } catch (error) {
    console.error("Error updating todo:", error); // Hantera eventuella fel
  }
}

// Funktion för att ta bort en todo från servern
async function deleteTodoFromServer(id) {
  try {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE", // Använd DELETE-metoden för att ta bort en todo
    });
  } catch (error) {
    console.error("Error deleting todo:", error); // Hantera eventuella fel
  }
}
