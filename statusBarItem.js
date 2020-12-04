const vscode = require("vscode");

class statusBarItem {
	constructor() {
		this.str = ""
		this.act = false
		this.arr = new Array(100)
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
			var mod100 = count % 100
			var speed
			var time = (new Date()).getTime()
			if(this.arr[mod100] != undefined) {
				speed = 6e6 / (time - this.arr[mod100])
				this.arr[mod100] = time
			} else {
				var bg = (mod100 + 99) % 100
				while(this.arr[bg] != undefined) {
					bg = (bg + 99) % 100
				}
				if(bg == (mod100 + 99) % 100) {
					speed = .0
				} else {
					speed = (mod100 + 99 - bg) % 100 * 6e4 / (time - this.arr[(bg + 1) % 100])
				}
				this.arr[mod100] = time
			}
            this.statusBarItem.text = this.str.replace("{count}", count).replace("{speed}", speed.toFixed(2))
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