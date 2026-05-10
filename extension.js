const vscode = require('vscode');

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	const presetWraps = [
		{ id: 'strong',      template: '#strong[$1]' },
		{ id: 'emph',        template: '#emph[$1]' },
		{ id: 'lower',       template: '#lower[$1]' },
		{ id: 'upper',       template: '#upper[$1]' },
		{ id: 'raw',         template: '#raw[$1]' },
		{ id: 'highlight',   template: '#highlight[$1]' },
		{ id: 'underline',   template: '#underline[$1]' },
		{ id: 'strike',      template: '#strike[$1]' },
		{ id: 'overline',    template: '#overline[$1]' },
		{ id: 'sub',         template: '#sub[$1]' },
		{ id: 'super',       template: '#super[$1]' },
		{ id: 'smallcaps',   template: '#smallcaps[$1]' },
		{ id: 'textRed',     template: '#text(fill: red)[$1]' },
		{ id: 'textBlue',    template: '#text(fill: blue)[$1]' },
		{ id: 'alignCenter', template: '#align(center)[$1]' },
		{ id: 'alignLeft',   template: '#align(left)[$1]' },
		{ id: 'alignRight',  template: '#align(right)[$1]' },
		{ id: 'box',         template: '#box[$1]' },
		{ id: 'block',       template: '#block(width: 100%)[$1]' },
		{ id: 'rect',        template: '#rect[$1]' },
		{ id: 'rectDashed',  template: '#rect(stroke: (paint: black, dash: "dashed", thickness: 1.6pt))[$1]' },
		{ id: 'pad',         template: '#pad(x: 5pt)[$1]' },
		{ id: 'columns',     template: '#columns(2)[$1]' },
		{ id: 'link',        template: '#link("")[$1]' },
		{ id: 'footnote',    template: '#footnote[$1]' },
		{ id: 'quote',       template: '#quote[$1]' },
	];

	for (const w of presetWraps) {
		context.subscriptions.push(
			vscode.commands.registerCommand(`typst-wrapper.${w.id}`, () => {
				wrapSelection(w.template);
			})
		);
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('typst-wrapper.userFunctions', () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) { return; }

			const funcs = detectUserFunctions(editor.document.getText());

			if (funcs.length === 0) {
				vscode.window.showInformationMessage('No user-defined functions found in this file.');
				return;
			}

			const items = funcs.map((f, i) => ({
				label: `#${f.name}`,
				description: f.signature || '',
				index: i,
			}));

			vscode.window.showQuickPick(items, {
				placeHolder: 'Select a user-defined function...',
				matchOnDescription: true,
			}).then(picked => {
				if (!picked) { return; }
				const fn = funcs[picked.index];
				const template = fn.signature.length > 0
					? `#${fn.name}()[$1]`
					: `#${fn.name}[$1]`;
				wrapSelection(template);
			});
		})
	);
}

function detectUserFunctions(source) {
	const builtins = new Set([
		'set', 'show', 'context', 'let', 'import', 'include', 'return',
		'if', 'else', 'for', 'while', 'break', 'continue', 'in',
		'and', 'or', 'not', 'none', 'auto', 'true', 'false',
	]);
	const funcs = [];
	const re = /^\s*#let\s+([a-zA-Z_][\w-]*)\s*(\([^)]*\))?\s*=/gm;
	let match;
	while ((match = re.exec(source)) !== null) {
		const name = match[1];
		const sig = match[2] || '';
		if (builtins.has(name)) { continue; }
		if (funcs.some(f => f.name === name)) { continue; }
		funcs.push({ name, signature: sig.trim() });
	}
	return funcs;
}

function wrapSelection(template) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { return; }

	editor.edit(editBuilder => {
		for (const selection of editor.selections) {
			const raw = editor.document.getText(selection);
			if (raw.length === 0) { continue; }

			if (/\r?\n/.test(raw)) {
				const indented = indentContent(raw, selection, editor.document);
				editBuilder.replace(selection, template.replace('$1', '\n' + indented + '\n'));
			} else {
				editBuilder.replace(selection, template.replace('$1', raw));
			}
		}
	});
}

function indentContent(raw, selection, doc) {
	const lines = raw.split(/\r?\n/);
	let minIndent = Infinity;
	for (const line of lines) {
		if (line.trim().length === 0) { continue; }
		const n = line.match(/^(\s*)/)[1].length;
		if (n < minIndent) { minIndent = n; }
	}
	if (minIndent === Infinity) { minIndent = 0; }

	const baseMatch = doc.lineAt(selection.start.line).text.match(/^(\s*)/);
	const baseIndent = baseMatch ? baseMatch[1] : '';

	return lines.map(line => {
		if (line.trim().length === 0) { return ''; }
		return baseIndent + '  ' + line.slice(Math.min(minIndent, line.length - line.trimStart().length));
	}).join('\n');
}

function deactivate() {}

module.exports = { activate, deactivate };
