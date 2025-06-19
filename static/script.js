class UDPMonitor {
    constructor() {
        this.websocket = null;
        this.messageCount = 0;
        this.autoScroll = true;
        this.maxMessages = 1000;
        this.serverIP = localStorage.getItem('serverIP') || 'localhost';
        this.serverPort = localStorage.getItem('serverPort') || '8080';

        this.initElements();
        this.bindEvents();
        this.loadSettings();
        this.connect();
    }

    initElements() {
        this.dataList = document.getElementById('data-list');
        this.connectionStatus = document.getElementById('connection-status');
        this.messageCountEl = document.getElementById('message-count');
        this.clearBtn = document.getElementById('clear-btn');
        this.toggleScrollBtn = document.getElementById('toggle-auto-scroll');
        this.serverIPInput = document.getElementById('server-ip');
        this.serverPortInput = document.getElementById('server-port');
        this.maxMessagesInput = document.getElementById('max-messages');
        this.maxMessagesValue = document.getElementById('max-messages-value');
    }

    bindEvents() {
        this.clearBtn.addEventListener('click', () => this.clearData());
        this.toggleScrollBtn.addEventListener('click', () => this.toggleAutoScroll());
        this.serverIPInput.addEventListener('change', () => this.updateServerSettings());
        this.serverPortInput.addEventListener('change', () => this.updateServerSettings());
        this.maxMessagesInput.addEventListener('input', () => this.updateMaxMessages());

        // 页面关闭时断开连接
        window.addEventListener('beforeunload', () => {
            if (this.websocket) {
                this.websocket.close();
            }
        });
    }

    loadSettings() {
        this.serverIPInput.value = this.serverIP;
        this.serverPortInput.value = this.serverPort;
        this.maxMessagesInput.value = this.maxMessages;
        this.maxMessagesValue.textContent = this.maxMessages;
    }

    updateServerSettings() {
        const newIP = this.serverIPInput.value;
        const newPort = this.serverPortInput.value;
        
        if (newIP !== this.serverIP || newPort !== this.serverPort) {
            this.serverIP = newIP;
            this.serverPort = newPort;
            
            localStorage.setItem('serverIP', this.serverIP);
            localStorage.setItem('serverPort', this.serverPort);

            // 重新连接WebSocket
            if (this.websocket) {
                this.websocket.close();
            }
            this.connect();
        }
    }

    updateMaxMessages() {
        this.maxMessages = parseInt(this.maxMessagesInput.value);
        this.maxMessagesValue.textContent = this.maxMessages;
        
        // 如果当前消息数超过新的最大值，删除多余的消息
        while (this.dataList.children.length > this.maxMessages) {
            this.dataList.removeChild(this.dataList.firstChild);
        }
    }

    connect() {
        try {
            const wsUrl = `ws://${this.serverIP}:${this.serverPort}`;
            this.websocket = new WebSocket(wsUrl);

            this.websocket.onopen = () => {
                console.log('WebSocket连接已建立');
                this.updateConnectionStatus(true);
            };

            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.addDataItem(data);
            };

            this.websocket.onclose = () => {
                console.log('WebSocket连接已关闭');
                this.updateConnectionStatus(false);
                // 3秒后重新连接
                setTimeout(() => this.connect(), 3000);
            };

            this.websocket.onerror = (error) => {
                console.error('WebSocket错误:', error);
                this.updateConnectionStatus(false);
            };

        } catch (error) {
            console.error('连接失败:', error);
            this.updateConnectionStatus(false);
            setTimeout(() => this.connect(), 3000);
        }
    }

    updateConnectionStatus(connected) {
        if (connected) {
            this.connectionStatus.textContent = '已连接';
            this.connectionStatus.className = 'status-connected';
        } else {
            this.connectionStatus.textContent = '未连接';
            this.connectionStatus.className = 'status-disconnected';
        }
    }

    addDataItem(data) {
        // 限制消息数量
        if (this.dataList.children.length >= this.maxMessages) {
            this.dataList.removeChild(this.dataList.firstChild);
        }

        const item = document.createElement('div');
        item.className = 'data-item';

        const timestamp = new Date(data.timestamp).toLocaleString();

        item.innerHTML = `
            <div class="data-header">
                <span class="timestamp">${timestamp}</span>
                <span class="from-address">来自: ${data.from}</span>
                <span class="data-size">大小: ${data.size} bytes</span>
            </div>
            <div class="data-content">${this.escapeHtml(data.data)}</div>
        `;

        this.dataList.appendChild(item);

        // 更新消息计数
        this.messageCount++;
        this.messageCountEl.textContent = `消息数: ${this.messageCount}`;

        // 自动滚动到底部
        if (this.autoScroll) {
            this.dataList.scrollTop = this.dataList.scrollHeight;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearData() {
        this.dataList.innerHTML = '';
        this.messageCount = 0;
        this.messageCountEl.textContent = '消息数: 0';
    }

    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        this.toggleScrollBtn.textContent = `自动滚动: ${this.autoScroll ? '开' : '关'}`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new UDPMonitor();
});