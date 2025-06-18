import socket


def start_udp_server():
    # 创建 UDP socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    # 服务器地址和端口
    host = '0.0.0.0'  # 监听所有可用网络接口
    port = 8888

    try:
        # 绑定地址和端口
        server_socket.bind((host, port))
        print(f"UDP 服务器启动，监听在 {host}:{port}")

        while True:
            # 接收数据，最大缓冲区设为1024字节
            data, client_address = server_socket.recvfrom(1024)

            # 解码并打印接收到的数据
            message = data.decode('utf-8')
            print(f"从 {client_address} 接收到数据: {message}")

    except Exception as e:
        print(f"发生错误: {e}")
    finally:
        server_socket.close()


if __name__ == "__main__":
    start_udp_server()