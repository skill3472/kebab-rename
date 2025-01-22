import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.renameFileKebabCase', async (uri: vscode.Uri) => {
        try {
            const filePath = uri.fsPath;
            const fileName = path.basename(filePath);
            const dirName = path.dirname(filePath);

			const match = fileName.match(/^(.*)\.([a-zA-Z]+)$/);

			// If no extension, just work with the base name
			if (!match) {
				// Handle files with no extension
				const kebabCaseName = fileName
					.replace(/([a-z])([A-Z])/g, '$1-$2')  // Handle camelCase
					.replace(/[\s_]+/g, '-')              // Replace spaces and underscores with dashes
					.toLowerCase();

				const newFilePath = path.join(dirName, kebabCaseName); 

				// Rename the file
				await fs.promises.rename(filePath, newFilePath);

				vscode.window.showInformationMessage(`Renamed to: ${kebabCaseName}`);
				return; 
			}

			// If it has an extension, proceed with the normal process
			const [_, baseName, ext] = match;
			const kebabCaseName = baseName
				.replace(/([a-z])([A-Z])/g, '$1-$2')
				.replace(/[\s_]+/g, '-')
				.toLowerCase();

			const newFileName = `${kebabCaseName}.${ext}`;
			const newFilePath = path.join(dirName, newFileName);

			await fs.promises.rename(filePath, newFilePath);

			vscode.window.showInformationMessage(`Renamed to: ${newFileName}`);
        } catch (error) {
    if (error instanceof Error) {
        vscode.window.showErrorMessage(`Failed to rename file: ${error.message}`);
    } else {
        vscode.window.showErrorMessage('Failed to rename file: An unknown error occurred.');
    }
}
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
