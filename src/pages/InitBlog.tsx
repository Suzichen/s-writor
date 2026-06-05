import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface Props {
  onComplete: (projectPath: string) => void;
  onCancel: () => void;
}

export function InitBlog({ onComplete, onCancel }: Props) {
  const [targetDir, setTargetDir] = useState("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const selectDir = async () => {
    const dir = await invoke<string | null>("select_directory");
    if (dir) setTargetDir(dir);
  };

  const handleInit = async () => {
    if (!targetDir || !projectName) return;
    setRunning(true);
    setLogs([]);

    const unlisten = await listen<string>("log_output", (e) => {
      setLogs((prev) => [...prev, e.payload]);
    });

    try {
      const result = await invoke<{ success: boolean; project_path: string }>("init_blog", {
        config: {
          target_dir: targetDir,
          project_name: projectName,
          description,
          author,
          site_url: null,
          timezone,
        },
      });
      if (result.success) {
        setTimeout(() => onComplete(result.project_path), 1000);
      }
    } catch (e: any) {
      setLogs((prev) => [...prev, `❌ 错误: ${e}`]);
    } finally {
      unlisten();
      setRunning(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <mdui-card class="w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">初始化新博客</h2>
          <mdui-button-icon icon="close" onClick={onCancel}></mdui-button-icon>
        </div>

        <div className="space-y-4">
          {/* 目标目录 */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">目标目录</label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={targetDir}
                readOnly
                placeholder="选择项目创建位置"
              />
              <mdui-button variant="tonal" onClick={selectDir}>浏览</mdui-button>
            </div>
          </div>

          {/* 项目名 */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">项目名称</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-blog"
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">描述</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="My awesome blog"
            />
          </div>

          {/* 作者 */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">作者</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          {/* 时区 */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">时区</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            />
          </div>

          {/* 日志输出 */}
          {logs.length > 0 && (
            <div className="bg-gray-900 text-green-400 text-xs p-3 rounded max-h-40 overflow-y-auto font-mono">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end gap-2 pt-2">
            <mdui-button variant="text" onClick={onCancel}>取消</mdui-button>
            <mdui-button
              variant="filled"
              disabled={!targetDir || !projectName || running || undefined}
              loading={running || undefined}
              onClick={handleInit}
            >
              创建
            </mdui-button>
          </div>
        </div>
      </mdui-card>
    </div>
  );
}
