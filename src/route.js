// Main libraries
const express = require("express");
const path = require("path");

// TODO: change the "client-folder-name"
const client_folder = path.join(__dirname, "..\\client-folder-name\\", process.env.NODE_ENV === "development" ? "public" : "build");

// Get manifest
const manifest = require(`${client_folder}\\manifest.json`);

// Route function called by both http and https servers
module.exports = function route(app) {
	// Manifest API
	app.get("/manifest.json", (req, res) => {
		// Create a copy of the manifest
		const manifest_copy = { ...manifest };

		// Specify dev mode if needed
		if (process.env.NODE_ENV === "development") {
			manifest_copy.name += " Dev";
			manifest_copy.short_name += " Dev";
		}

		// Send manifest
		res.send(manifest_copy);
	});

	// Global
	app.use(client_folder, express.static());

	// 404
	// app.get("*", (req, res) => {
	// 	res.status(404).sendFile("404.html", { root: __dirname });
	// });
};
