import { ipcMain } from 'electron';

// 渲染进程通信
ipcMain.on('quilt:hello', (event) => {
	event.returnValue = 'hello world';
});
