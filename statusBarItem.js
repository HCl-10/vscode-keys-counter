const vscode = require("vscode");

class statusBarItem {
	constructor() {
		this.str = ""
		this.act = false
		this.config = {};
        this.activate = () => {
            if (this.statusBarItem) {
                return;
            }
            this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            this.statusBarItem.show();
        };
        this.dispose = () => {
            if (!this.statusBarItem) {
                return;
            }
            this.statusBarItem.dispose();
            this.statusBarItem = null;
		};
		this.updateStatusBar = (count) => {
            if (!this.statusBarItem) {
                return;
			}
            this.statusBarItem.text = this.str.replace("{count}", count);
		};
		this.onDidChangeTextDocument = (count, event) => {
            this.updateStatusBar(count);
		};
		this.onDidChangeConfiguration = (count, config) => {
			if(this.act) {
				this.dispose();
			}
			this.str = config.get("customString")
			this.act = true
			this.activate();
			this.updateStatusBar(count);
        };
	}
}

exports.statusBarItem = statusBarItem;