import { ipcRenderer, contextBridge } from 'electron';

// 导出提供给渲染进程类型定义
export const api = {
	hello: () => ipcRenderer.sendSync('quilt:hello'),
};

// 暴露 API 到渲染进程
contextBridge.exposeInMainWorld('quilt', api);
