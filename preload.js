const { contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  readFile: (filePath) => {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  },
  writeFile: (filePath, content) => {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      return false;
    }
  },
  // File dialog
  selectFile: async (extensions) => {
    const { dialog } = require('electron').remote;
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: extensions || ['jpg', 'jpeg', 'png', 'gif'] }
      ]
    });
    return result.filePaths[0] || null;
  }
});
