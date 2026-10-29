export function openModal(employee, onSave) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const title = document.createElement("h3");
  title.textContent = `${employee ? "Edit" : "Add"} Employee`;

  const nameInput = document.createElement("input");
  nameInput.id = "nameInput";
  nameInput.placeholder = "Name";
  nameInput.value = employee ? employee.name : "";
  nameInput.disabled = Boolean(employee);

  const roleInput = document.createElement("select");
  roleInput.id = "roleInput";
  ["Developer", "Designer", "Project Manager", "QA Engineer"].forEach(role => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    roleInput.appendChild(option);
  });
  roleInput.value = employee ? employee.role : "Developer";

  const scoreInput = document.createElement("input");
  scoreInput.id = "scoreInput";
  scoreInput.type = "number";
  scoreInput.min = "0";
  scoreInput.max = "100";
  scoreInput.placeholder = "Score (0-100)";
  scoreInput.value = employee ? employee.score : "";

  const error = document.createElement("p");
  error.id = "error";

  const saveButton = document.createElement("button");
  saveButton.id = "saveBtn";
  saveButton.textContent = "Save";

  const close = () => overlay.remove();

  saveButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const score = Number(scoreInput.value);

    if (!name || scoreInput.value === "" || score < 0 || score > 100) {
      error.textContent = "Enter a name and a score from 0 to 100.";
      return;
    }

    onSave({
      name,
      role: roleInput.value,
      score
    });
    close();
  });

  overlay.addEventListener("click", event => {
    if (event.target === overlay) close();
  });

  modal.append(title, nameInput, roleInput, scoreInput, error, saveButton);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  nameInput.focus();
}
