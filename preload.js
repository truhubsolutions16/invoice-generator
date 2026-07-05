const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath) => {
    const fs = require('fs');
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  },
  writeFile: (filePath, content) => {
    const fs = require('fs');
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      return false;
    }
  },
  selectFile: async (options) => {
    // options example: { properties: ['openFile'], filters: [{ name: 'Images', extensions: ['png','jpg'] }] }
    const filePaths = await ipcRenderer.invoke('dialog:openFile', options);
    return filePaths && filePaths.length ? filePaths[0] : null;
  }
});
