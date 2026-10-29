import { openModal } from "./modal.js";
let employees = [
  { id: 1, name: "Alice Johnson", role: "Developer", score: 88 },
  { id: 2, name: "James Smith", role: "Designer", score: 73 },
  { id: 3, name: "Fatou Kamara", role: "Project Manager", score: 91 },
  { id: 4, name: "David Mwangi", role: "QA Engineer", score: 64 }
];

let sortKey = "";
let ascending = true;

const search = document.getElementById("search");
const roleFilter = document.getElementById("roleFilter");
const container = document.getElementById("tableContainer");
const summary = document.getElementById("summary");


// The colors for these classes are defined in style.css.
function getColor(score) {
  if (score >= 85) {
    return "green";
  } else if (score >= 70) {
    return "yellow";
  } else {
    return "red";
  }
}


function renderTable() {
  container.innerHTML = "";
  const table = document.createElement("table");

  // Header row
  const header = document.createElement("tr");
  const columns = { name: "Name", role: "Role", score: "Score" };
  for (const key in columns) {
    const th = document.createElement("th");
    th.textContent = columns[key];
    th.addEventListener("click", () => sortBy(key));
    header.appendChild(th);
  }
  header.appendChild(document.createElement("th"));
  table.appendChild(header);

  // Search + role filter together
  updateRoleFilter();
  const text = search.value.toLowerCase();
  const role = roleFilter.value;
  const list = employees.filter(emp =>
    emp.name.toLowerCase().includes(text) &&
    (role === "All" || role === "all" || emp.role === role)
  );

  // Sorting
  if (sortKey) {
    list.sort((a, b) => {
      const comparison = sortKey === "score"
        ? a.score - b.score
        : a[sortKey].localeCompare(b[sortKey]);
      return ascending ? comparison : -comparison;
    });
  }

  // One row per employee
  list.forEach(emp => {
    const row = document.createElement("tr");
  // The class comes from the employee's score in the data array
    row.classList.add(getColor(emp.score));

    [emp.name, emp.role, emp.score].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      row.appendChild(td);
    });

    const actions = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      openModal(emp, ({ role, score }) => {
        emp.role = role;
        emp.score = score;
        renderTable();
      });
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteEmployee(emp.id));
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    row.appendChild(actions);

    table.appendChild(row);
  });

  container.appendChild(table);
  updateSummary();
}

function sortBy(key) {
  ascending = sortKey === key ? !ascending : true;
  sortKey = key;
  renderTable();
}

function addEmployee() {
  openModal(null, ({ name, role, score }) => {
    employees.push({ id: Date.now(), name, role, score });
    renderTable();
  });
}

function deleteEmployee(id) {
  employees = employees.filter(emp => emp.id !== id);
  renderTable();
}

// Rebuild the role dropdown from the roles that exist in the data
function updateRoleFilter() {
  const selectedRole = roleFilter.value;
  const roles = [...new Set(employees.map(emp => emp.role))];

  roleFilter.innerHTML = '<option value="all">All Roles</option>';
  roles.forEach(role => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    roleFilter.appendChild(option);
  });

  roleFilter.value = roles.includes(selectedRole) ? selectedRole : "all";
}

function updateSummary() {
  const total = employees.length;
  let sum = 0;
  let top = employees[0];

  employees.forEach(emp => {
    sum += emp.score;
    if (emp.score > top.score) top = emp;
  });

  // textContent keeps user-typed names from being parsed as HTML
  summary.innerHTML = "";
  const heading = document.createElement("h3");
  heading.textContent = "Summary";
  summary.appendChild(heading);

  [
    `Total employees: ${total}`,
    `Average score: ${total ? (sum / total).toFixed(1) : 0}`,
    `Top performer: ${top ? top.name : "-"}`
  ].forEach(text => {
    const p = document.createElement("p");
    p.textContent = text;
    summary.appendChild(p);
  });
}

search.addEventListener("input", renderTable);
roleFilter.addEventListener("change", renderTable);
document.getElementById("addBtn").addEventListener("click", addEmployee);

renderTable();
