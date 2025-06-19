# UDP实时数据监控系统

一个基于Python的轻量级UDP数据包监控系统，提供Web界面实时显示和分析UDP数据包内容。本项目适用于网络调试、数据监控等场景。

## 功能特点

- 实时监听UDP数据包
- WebSocket实时推送数据
- 美观的Web界面实时展示
- 支持数据包详细信息显示
  - 时间戳
  - 来源地址
  - 数据大小
  - 原始内容
- 自动重连机制
- 可配置参数
  - 最大消息显示数量
  - 服务器IP和端口
  - 自动滚动控制

## 系统要求

- Python 3.6+
- 现代浏览器(支持WebSocket)

## 快速开始

1. 克隆仓库:
```bash
git clone https://github.com/cg8-5712/udp-listener.git
cd udp-listener
```

2. 安装依赖:
```bash
pip install -r requirements.txt
```

3. 配置服务器参数(可选):

编辑 `.env` 文件:
```ini
# Web Server Config
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# WebSocket Server Config
WS_HOST=0.0.0.0
WS_PORT=8080

# UDP Server Config
UDP_HOST=0.0.0.0
UDP_PORT=8888
```

4. 启动服务器:
```bash
python app.py
```

5. 打开浏览器访问:
```
http://localhost:5000
```

6. 测试UDP连接:
```bash
python udp_test.py
```

## 项目结构

```
├── app.py              # 主程序入口
├── static/            
│   ├── index.html     # Web界面
│   ├── script.js      # 前端脚本
│   └── style.css      # 样式表
├── utils/
│   └── udp_server.py  # UDP服务器实现
├── websocket_server.py # WebSocket服务器实现
├── udp_test.py        # UDP测试客户端
└── requirements.txt    # 项目依赖
```

## 端口说明

- 5000: Web服务器端口
- 8080: WebSocket服务器端口 
- 8888: UDP监听端口

## 开发说明

### 核心组件

1. UDP服务器([`UDPServer`](utils/udp_server.py))
   - 负责接收和处理UDP数据包
   - 支持回调函数处理数据

2. WebSocket服务器([`WebSocketServer`](websocket_server.py))
   - 管理客户端连接
   - 实时推送数据到Web客户端

3. Web界面
   - 使用原生JavaScript实现
   - 响应式设计
   - VS Code风格的暗色主题

### 自定义配置

- 服务器IP和端口可在Web界面实时修改
- 最大消息数量可通过滑块调整
- 自动滚动功能可随时开关

### 数据格式

UDP数据包格式:
```json
{
    "data": "数据内容",
    "from": "发送者IP:端口",
    "timestamp": "ISO格式时间戳",
    "size": "数据大小(字节)"
}
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 [GNU GPL v3](LICENSE) 许可证。

## 问题反馈

如果你发现任何问题或有改进建议，欢迎提交 Issue。