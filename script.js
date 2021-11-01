const addBtn = document.querySelector(".addBtn");
const title = document.getElementById("title");
const description = document.getElementById("description");
const table = document.querySelector("#table");
let removeBtn = document.querySelectorAll(".removeBtn");
let editBtn = document.querySelectorAll(".editBtn");

// Verifying if "dbName" exists on localStorage
let db = localStorage.getItem("dbName")
	? [...JSON.parse(localStorage.getItem("dbName"))]
	: [];


// Allows user to see the elements stored in localStorage
db.forEach(element => {
	const newRow = table.insertRow();
	newRow.innerHTML = `
	<tr>
		<th class="titleth down">${element.Title}</th>
		<th class="descriptionth down">${element.Description}</th>
		<td class="modify_td">
			<div class="editSection">
				<img src="./Images/edit.png" class="editBtn" alt="editBtn" role="button">
			</div>
			<div class="removeSection">
				<img src="./Images/trash.png" class="removeBtn" alt="removeBtn" role="button">
			</div>
		</td>
	<tr/>
    `;
});

// Add Method
function addElement() {
	// In case of empty inputs
	if (title.value === "" || description.value === "") {
		Swal.fire({
			icon: 'warning',
			iconColor: '#ad8c7b',
			title: 'Oops...',
			text: 'Title and Description are required',
			focusConfirm: false,
			confirmButtonText: 'Continue',
			confirmButtonColor: '#131c46',
		  });
		return;
	}

	// Inserting new element
	const newRow = table.insertRow();
	newRow.innerHTML = `
	<tr>
		<th class="titleth down">${title.value}</th>
		<th class="descriptionth down">${description.value}</th>
		<td class="modify_td">
			<div class="editSection">
				<img src="./Images/edit.png" class="editBtn" alt="editBtn" role="button">
			</div>
			<div class="removeSection">
				<img src="./Images/trash.png" class="removeBtn" alt="removeBtn" role="button">
			</div>
		</td>
	<tr/>
    `;

	// Asigning the "remove" and "edit" functionality to the icons (img)
	removeBtn = document.querySelectorAll(".removeBtn");
	removeBtn[removeBtn.length - 1].addEventListener("click", deleteElement);
	editBtn = document.querySelectorAll(".editBtn");
	editBtn[editBtn.length - 1].addEventListener("click", editElement);

	// Row content
	let content = {
		Title: title.value,
		Description: description.value,
	};
	db.push(content);
	localStorage.setItem("dbName", JSON.stringify(db));

	// Made to delete input values when user wants add another element
	title.value = "";
	description.value = "";
}

// Delete Function
function deleteElement(e){
	Swal.fire({
		title: 'Are you sure?',
		text: "Think twice before doing something stupid!",
		icon: 'warning',
		iconColor: '#ad8c7b',
		showCancelButton: true,
		focusConfirm: false,
		confirmButtonColor: '#131c46',
		cancelButtonColor: '#ba0000',
		confirmButtonText: 'Confirm'

	}).then((result) => {
		if (result.isConfirmed){
			Swal.fire({
				title: 'Deleted!',
				text: 'Your ToDo has been deleted.',
				icon: 'success',
				confirmButtonColor: '#131c46',
				confirmButtonText: 'Continue',
				focusConfirm: false
			})
			
			let title = e.target.parentElement.parentElement.parentElement.children[0].innerHTML;
			let description = e.target.parentElement.parentElement.parentElement.children[1].innerHTML;	

			// Get index location of title and description (same usage as filter and indexOf)
			let i = 0;
			while (true) {
				if (db[i].Title === title && db[i].Description === description) {
					break;
				}
				i++;
			}

			db.splice(i,1);

			e.target.parentElement.parentElement.parentElement.parentElement.removeChild(
				e.target.parentElement.parentElement.parentElement,
			);

			localStorage.setItem("dbName", JSON.stringify(db));
		}
	})	
}


// Update or Edit Function
function editElement(e){
	// Access to actual value of title and description
	let title = e.target.parentElement.parentElement.parentElement.children[0].innerHTML;
	let description = e.target.parentElement.parentElement.parentElement.children[1].innerHTML;	

	// Get index location of title and description (same usage as filter and indexOf)
	let i = 0;
	while (true) {
		if (db[i].Title === title && db[i].Description === description) {
			break;
		}
		i++;
	}
	
	Swal.fire({
		title: 'Edit ToDo',
		html:
		  '<hr/>' +
		  '<input id="newTitle" class="swal2-input" placeholder="Title">' +
		  '<input id="newDescription" class="swal2-input" placeholder="Description">'+
		  '<br/>' +
		  '<br/>',
		  
		focusConfirm: false,
		showCancelButton: true,
		cancelButtonColor: '#ba0000',
		confirmButtonText: 'Confirm',
		confirmButtonColor: '#131c46',
		returnInputValueOnDeny: true,
		preConfirm: () => {
			return [
			  document.getElementById('newTitle').value,
			  document.getElementById('newDescription').value
			]
		  }
	  }).then((result) => {
			if (result.isConfirmed && result != null){
				Swal.fire({
					title: 'Content Updated',
					icon: 'success',
					confirmButtonText: 'Confirm',
					confirmButtonColor: '#131c46'
				})
				
				// Changing values by reference
				e.target.parentElement.parentElement.parentElement.children[0].innerHTML =
				result.value[0];

				e.target.parentElement.parentElement.parentElement.children[1].innerHTML =
				result.value[1]

				db[i].Title = result.value[0];
				db[i].Description = result.value[1];

				localStorage.setItem('dbName', JSON.stringify(db));
			}
	  })	
}


// Clicks
addBtn.onclick = addElement;
removeBtn = document.querySelectorAll(".removeBtn");
removeBtn.forEach(e => {
	e.addEventListener("click", deleteElement);
});
editBtn = document.querySelectorAll(".editBtn");
editBtn.forEach(e =>{
	e.addEventListener("click", editElement);
});
