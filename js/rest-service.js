const endpoint = "https://rest-ovelser-default-rtdb.europe-west1.firebasedatabase.app/";

import { prepareData } from "./helpers.js";
// Get all posts - HTTP Method: GET
async function getPosts() {
	const response = await fetch(`${endpoint}/posts.json`); // fetch request, (GET)
	const data = await response.json(); // parse JSON to JavaScript
	const posts = prepareData(data); // convert object of object to array of objects
	return posts; // return posts
}
async function createPost(title, body, image) {
	const newPost = { title, body, image }; // create new post object
	const json = JSON.stringify(newPost); // convert the JS object to JSON string
	// POST fetch request with JSON in the body
	const response = await fetch(`${endpoint}/posts.json`, {
		method: "POST",
		body: json,
	});
	// check if response is ok - if the response is successful
	return response;
}

// Update an existing post - HTTP Method: DELETE
async function deletePost(id) {
	const response = await fetch(`${endpoint}/posts/${id}.json`, {
		method: "DELETE",
	});
	return response;
}

// Delete an existing post - HTTP Method: PUT
async function updatePost(id, title, body, image) {
	const postToUpdate = { title, body, image }; // post update to update
	const json = JSON.stringify(postToUpdate); // convert the JS object to JSON string
	// PUT fetch request with JSON in the body. Calls the specific element in resource
	const response = await fetch(`${endpoint}/posts/${id}.json`, {
		method: "PUT",
		body: json,
	});
	// check if response is ok - if the response is successful

	return response;
}
export { updatePost, deletePost, createPost, getPosts };
