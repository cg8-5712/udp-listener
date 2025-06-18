#!/usr/bin/env python3
"""
UDP测试客户端
用于测试UDP服务器是否正常工作
"""

import socket
import time
import random


def send_test_messages():
    # 创建UDP客户端socket
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    # 服务器地址
    server_address = ('127.0.0.1', 8888)

    try:
        print("开始发送测试消息到UDP服务器...")

        # 发送一些测试消息
        test_messages = [
            "Hello UDP Server!",
            "测试中文消息",
            "Message with timestamp: " + str(time.time()),
            "Random number: " + str(random.randint(1, 1000)),
            "JSON test: {\"name\": \"test\", \"value\": 123}",
            "Multi line\nmessage\ntest",
            "Special chars: !@#$%^&*()",
            "Long message: " + "A" * 200
        ]

        for i, message in enumerate(test_messages, 1):
            # 发送消息
            client_socket.sendto(message.encode('utf-8'), server_address)
            print(f"已发送消息 {i}: {message[:50]}{'...' if len(message) > 50 else ''}")

            # 等待一秒
            time.sleep(1)

        print("\n所有测试消息发送完成!")

        # 询问是否继续发送自定义消息
        while True:
            user_input = input("\n输入要发送的消息 (输入 'quit' 退出): ")
            if user_input.lower() == 'quit':
                break

            if user_input.strip():
                client_socket.sendto(user_input.encode('utf-8'), server_address)
                print(f"已发送: {user_input}")

    except Exception as e:
        print(f"发送消息时发生错误: {e}")

    finally:
        client_socket.close()
        print("UDP客户端已关闭")


if __name__ == "__main__":
    send_test_messages()