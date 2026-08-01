// گرفتن فرم
const tasks = [];
let editId = null;
function render() {
  const act = tasks
    .map(function (act) {
      return `
        <tr data-id="${act.id}">
          <td>${act.task}</td>
          <td>${act.Priority}</td>
          <td>${act.category}</td>
          <td>${act.duedate}</td>
          <td>${act.id}</td>
          
          <td>
            <select name="statement" class="statement">
             <option value="DONE" ${act.status === "DONE" ? "selected" : ""}>
  انجام شد
</option>

<option value="PENDING" ${act.status === "PENDING" ? "selected" : ""}>
  در حال انجام
</option>

<option value="stop" ${act.status === "stop" ? "selected" : ""}>
  توقف
</option>
            </select>
          </td>
          <td>
            <select name="changes" class="changes">
              <option value="deleted">حذف</option>
              <option value="edited">ویرایش</option>
              <option value="noedited" selected>بدون تغییر</option>
            </select>
          </td>
        </tr>`;
    })
    .join("");
  const tablelist = document.querySelector(".card-items");
  tablelist.innerHTML = act;
}
const form = document.querySelector("#builttaskfo");
console.log(form.elements);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // console.log(form.elements.duedate.value);
  // console.log(form.elements.task.value);
  // console.log(form.elements.category.value);
  // console.log(form.elements.Priority.value);
  // console.log(event.type);
  // console.log(event.target);

  const objectTask = {
    task: form.elements.task.value,
    category: form.elements.category.value,
    Priority: form.elements.Priority.value,
    duedate: form.elements.duedate.value,
    description: form.elements.description.value,
    id: Date.now(),
    status: "PENDING",
  };
  // ساخت لیست کارها
  if (editId === null) {
    tasks.push(objectTask);
    render();
    updateReport();
    form.reset();
  } else {
    const editfinall = tasks.findIndex(function editcard(item) {
      return item.id === editId;
    });
    console.log(editId);
    tasks[editfinall].task = form.elements.task.value;
    tasks[editfinall].category = form.elements.category.value;
    tasks[editfinall].Priority = form.elements.Priority.value;
    tasks[editfinall].duedate = form.elements.duedate.value;
    tasks[editfinall].description = form.elements.description.value;
    console.log(tasks);
    render();
    updateReport();
    form.reset();
    editId = null;
    const submitbtn = document.querySelector("#btn");
    submitbtn.value = "ایجاد";
  }
});

// حذف و ویرایش

const tablelist = document.querySelector(".card-items");
// console.dir(tablelist);
tablelist.addEventListener("change", (event) => {
  const selection = event.target;
  const row = selection.parentElement.parentElement.dataset.id;

  if (selection.name === "changes" && selection.value === "deleted") {
    const delet = tasks.findIndex(function (remove) {
      return remove.id === +row;
    });

    tasks.splice(delet, 1);
    render();
    updateReport();
    editId = null;
  } else if (
    event.target.name === "changes" &&
    event.target.value === "edited"
  ) {
    const edit = tasks.findIndex(function (edititem) {
      return edititem.id === +row;
    });
    editId = Number(row);
    const taskedited = document.querySelector("#task");
    taskedited.value = tasks[edit].task;
    const categoryedited = document.querySelector("#category");
    categoryedited.value = tasks[edit].category;
    const Priorityedited = document.querySelector("#Priority");
    Priorityedited.value = tasks[edit].Priority;
    const descriptionedited = document.querySelector("#description");
    descriptionedited.value = tasks[edit].description;
    const submitbtn = document.querySelector("#btn");
    submitbtn.value = "ویرایش";
  } else if (event.target.name === "statement") {
    const statement = tasks.findIndex(function statuscard(stat) {
      return stat.id === +row;
    });
    tasks[statement].status = event.target.value;
    render();
    updateReport();
  }
});

// اعتبارسنجی فرم
for (let valid of form.elements) {
  if (
    valid.name === "Priority" ||
    valid.name === "category" ||
    valid.name === "task" ||
    valid.name === "description" ||
    valid.name === "duedate"
  ) {
    valid.addEventListener("blur", () => {
      if (valid.checkValidity()) {
        valid.style.border = "0.1rem solid green";
      } else {
        valid.style.border = "0.1rem solid red";
      }
    });
  }
}
// گزارش آماری

function updateReport() {
  const dones = tasks.filter(function filterdone(doneitem) {
    return doneitem.status === "DONE";
  }).length;
  const donereport = (document.querySelector("#totaldone").textContent = dones);

  const pendings = tasks.filter(function filterpending(penditem) {
    return penditem.status === "PENDING";
  }).length;
  const pendreport = (document.querySelector("#totalpending").textContent =
    pendings);

  const stops = tasks.filter(function filterstop(stopitem) {
    return stopitem.status === "stop";
  }).length;
  const stopreport = (document.querySelector("#totalstop").textContent = stops);
}
