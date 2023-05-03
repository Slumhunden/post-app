"use strict";
import { getPosts, updatePost, deletePost, createPost } from "./rest-service.js";
// const endpoint = "https://post-rest-api-default-rtdb.firebaseio.com";
import { compareBody, compareTitle } from "./helpers.js";
let posts;

async function updatePostsGrid() {
	posts = await getPosts(); // get posts from rest endpoint and save in variable
	showPosts(posts); // show all posts (append to the DOM) with posts as argument
}

window.addEventListener("load", initApp);

function initApp() {
	updatePostsGrid(); // update the grid of posts: get and show all posts

	// event listener
	document.querySelector("#btn-create-post").addEventListener("click", showCreatePostDialog);
	document.querySelector("#form-create-post").addEventListener("submit", createPostClicked);
	document.querySelector("#form-update-post").addEventListener("submit", updatePostClicked);
	document.querySelector("#form-delete-post").addEventListener("submit", deletePostClicked);
	document.querySelector("#form-delete-post .btn-cancel").addEventListener("click", deleteCancelClicked);
	document.querySelector("#select-sort-by").addEventListener("change", sortByChanged);
	document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
	document.querySelector("#input-search").addEventListener("search", inputSearchChanged);
}

// ============== events ============== //

function showCreatePostDialog() {
	document.querySelector("#dialog-create-post").showModal(); // show create dialog
}

async function createPostClicked(event) {
	const form = event.target; // or "this"
	// extract the values from inputs from the form
	const title = form.title.value;
	const body = form.body.value;
	const image = form.image.value;
	const response = await createPost(title, body, image); // use values to create a new post
	form.reset(); // reset the form (clears inputs)
	if (response.ok) {
		updatePostsGrid();
	}
}

async function updatePostClicked(event) {
	const form = event.target; // or "this"
	// extract the values from inputs in the form
	const title = form.title.value;
	const body = form.body.value;
	const image = form.image.value;
	// get id of the post to update - saved in data-id
	const id = form.getAttribute("data-id");
	const response = await updatePost(id, title, body, image);
	if (response.ok) {
		updatePost();
	} // call updatePost with arguments
}

async function deletePostClicked(event) {
	const id = event.target.getAttribute("data-id"); // event.target is the delete form
	const response = await deletePost(id);
	if (response.ok) {
		deletePost();
	} // call deletePost with id
}

function deleteCancelClicked() {
	document.querySelector("#dialog-delete-post").close(); // close dialog
}

function sortByChanged(event) {
	const selectedValue = event.target.value;

	if (selectedValue === "title") {
		posts.sort(compareTitle);
	} else if (selectedValue === "body") {
		posts.sort(compareBody);
	}

	showPosts(posts);
}

function inputSearchChanged(event) {
	const value = event.target.value;
	const postsToShow = searchPosts(value);
	showPosts(postsToShow);
}

// ============== posts ============== //

function showPosts(listOfPosts) {
	document.querySelector("#posts").innerHTML = ""; // reset the content of section#posts

	for (const post of listOfPosts) {
		showPost(post); // for every post object in listOfPosts, call showPost
	}
}

function showPost(postObject) {
	const html = /*html*/ `
        <article class="grid-item">
            <img src="${postObject.image}" />
            <h3>${postObject.title}</h3>
            <p>${postObject.body}</p>
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </div>
        </article>
    `; // html variable to hold generated html in backtick
	document.querySelector("#posts").insertAdjacentHTML("beforeend", html); // append html to the DOM - section#posts

	// add event listeners to .btn-delete and .btn-update
	document.querySelector("#posts article:last-child .btn-delete").addEventListener("click", () => deleteClicked(post));
	document.querySelector("#posts article:last-child .btn-update").addEventListener("click", () => updateClicked(post));

	// called when delete button is clicked

	// called when update button is clicked
}
function deleteClicked(post) {
	// show title of post you want to delete
	document.querySelector("#dialog-delete-post-title").textContent = post.title;
	// set data-id attribute of post you want to delete (... to use when delete)
	document.querySelector("#form-delete-post").setAttribute("data-id", post.id);
	// show delete dialog
	document.querySelector("#dialog-delete-post").showModal();
}
function updateClicked(post) {
	const updateForm = document.querySelector("#form-update-post"); // reference to update form in dialog
	updateForm.title.value = post.title; // set title input in update form from post title
	updateForm.body.value = post.body; // set body input in update form post body
	updateForm.image.value = post.image; // set image input in update form post image
	updateForm.setAttribute("data-id", post.id); // set data-id attribute of post you want to update (... to use when update)
	document.querySelector("#dialog-update-post").showModal(); // show update modal
}

function searchPosts(searchValue) {
	searchValue = searchValue.toLowerCase();

	return posts.filter((post) => post.title.toLowerCase().includes(searchValue));

	// function checkTitle(post) {
	//     const title = post.title.toLowerCase();
	//     return title.includes(searchValue);
	// }
}

// Create a new post - HTTP Method: POST

// ============== helper function ============== //

// convert object of objects til an array of objects
