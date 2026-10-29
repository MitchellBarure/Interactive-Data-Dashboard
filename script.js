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

function getColor(score) {
  if (score >= 85) return "green";
  if (score >= 70) return "yellow";
  return "red";
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
  const text = search.value.toLowerCase();
  const role = roleFilter.value;
  const list = employees.filter(emp =>
    emp.name.toLowerCase().includes(text) && (role === "All" || emp.role === role)
  );

  // Sorting
  if (sortKey) {
    list.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return ascending ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return ascending ? 1 : -1;
      return 0;
    });
  }

  // One row per employee
  list.forEach(emp => {
    const row = document.createElement("tr");
    row.classList.add(getColor(emp.score));

    [emp.name, emp.role, emp.score].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      row.appendChild(td);
    });

    const actions = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => openModal(emp));
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

function openModal(emp) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.innerHTML = `
    <div class="modal">
      <h3>${emp ? "Edit" : "Add"} Employee</h3>
      <input id="nameInput" placeholder="Name">
      <select id="roleInput">
        <option>Developer</option>
        <option>Designer</option>
        <option>Project Manager</option>
        <option>QA Engineer</option>
      </select>
      <input id="scoreInput" type="number" placeholder="Score (0-100)">
      <p id="error"></p>
      <button id="saveBtn">Save</button>
    </div>`;
  document.body.appendChild(overlay);

  const nameInput = document.getElementById("nameInput");
  const roleInput = document.getElementById("roleInput");
  const scoreInput = document.getElementById("scoreInput");

  // When editing, fill in the current values (name can't be changed)
  if (emp) {
    nameInput.value = emp.name;
    nameInput.disabled = true;
    roleInput.value = emp.role;
    scoreInput.value = emp.score;
  }

  const close = () => document.body.removeChild(overlay);

  // Click outside the white box closes the modal
  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    const name = nameInput.value.trim();
    const score = Number(scoreInput.value);

    if (name === "" || scoreInput.value === "" || score < 0 || score > 100) {
      document.getElementById("error").textContent = "Enter a name and a score from 0 to 100.";
      return;
    }

    if (emp) {
      emp.role = roleInput.value;
      emp.score = score;
    } else {
      employees.push({ id: Date.now(), name: name, role: roleInput.value, score: score });
    }

    close();
    renderTable();
  });
}

function deleteEmployee(id) {
  employees = employees.filter(emp => emp.id !== id);
  renderTable();
}

function updateSummary() {
  const total = employees.length;
  let sum = 0;
  let top = employees[0];

  employees.forEach(emp => {
    sum += emp.score;
    if (emp.score > top.score) top = emp;
  });

  summary.innerHTML = `
    <h3>Summary</h3>
    <p>Total employees: ${total}</p>
    <p>Average score: ${total ? (sum / total).toFixed(1) : 0}</p>
    <p>Top performer: ${top ? top.name : "-"}</p>`;
}

search.addEventListener("input", renderTable);
roleFilter.addEventListener("change", renderTable);
document.getElementById("addBtn").addEventListener("click", () => openModal(null));

renderTable();



let sortColumn = "name";
let sortDirection = "asc";

document.querySelectorAll("[data-sort]").forEach(button => {
    button.addEventListener("click", () => {
        const column = button.dataset.sort;

        if (sortColumn === column) {
            sortDirection =
                sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortColumn = column;
            sortDirection = "asc";
        }

        const sortedEmployees = [...employees].sort((a, b) => {
            let comparison;

            if (column === "score") {
                comparison = a.score - b.score;
            } else {
                comparison = a[column].localeCompare(b[column]);
            }

            return sortDirection === "asc"
                ? comparison
                : -comparison;
        });

        renderTable(sortedEmployees);
    });
});

const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");

function updateRoleFilter() {
    const selectedRole = roleFilter.value;

    const roles = [...new Set(
        employees.map(employee => employee.role)
    )];

    roleFilter.innerHTML = '<option value="all">All Roles</option>';

    roles.forEach(role => {
        const option = document.createElement("option");
        option.value = role;
        option.textContent = role;
        roleFilter.appendChild(option);
    });

    roleFilter.value = roles.includes(selectedRole)
        ? selectedRole
        : "all";
}