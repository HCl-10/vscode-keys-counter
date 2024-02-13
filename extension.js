const vscode = require('vscode');
const StatusBarItem = require('./statusBarItem');
const fs = require('fs')
const os = require("os")

let statusBarItem = null;

let count = 0;
let documentChangeListenerDisposer = null;
let cacheFile = ""

function activate(context) {
	vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration);
	cacheFile = __dirname + "/.vscode-keys-counter"
	fs.readFile(cacheFile, "utf-8", (err, cont) => {
		if(err) count = 0
		else count = parseInt(cont)
		statusBarItem = new StatusBarItem.statusBarItem();
		const config = vscode.workspace.getConfiguration('vscode-keys-counter');
		statusBarItem.onDidChangeConfiguration(count, config)
		documentChangeListenerDisposer = vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument)
	})
}
exports.activate = activate;

function deactivate() {
	fs.writeFile(cacheFile, String(count), () => {})
}

function onDidChangeTextDocument(event) {
	++count;
	if(count % 10 == 0) {
		fs.writeFile(cacheFile, String(count), () => {})
	}
    statusBarItem.onDidChangeTextDocument(count, event);
}

function onDidChangeConfiguration(params) {
	const config = vscode.workspace.getConfiguration('vscode-keys-counter');
	statusBarItem.onDidChangeConfiguration(count, config)
}

module.exports = {
	activate,
	deactivate
}
