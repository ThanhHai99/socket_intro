----- Simple Chat and Clock server -----

1. Xem, research về Nodejs + Socket + Websocket.

2. Phân tích và viết 1 Server với các yêu cầu sau:

+ Có thể kết nối bằng 2 port Socket và WebSocket.
+ World clock (1s trả data thời gian hiện tại về các client connect vào server).
+ Chat giữa user A --> user B
+ Chat room > 2 người.

3. Tham khảo:

+ Socket framwork: const Net = require('net');
+ Websocket: const ws = require('ws');

4. Cài đặt:

+ Nodejs 16
+ Visual Studio Code + JavaScript (ES6) code snippets(extension)

# Note

Server có thể kết nối bằng 2 port Socket (raw Socket) và WebSocket
   - Cần tạo 2 server để handle 2 loại socket
    + Raw Socket : port 3001
    + Web Socket : port 3000
   - Test connect
   - Tạo function xử lý khi có socket connect vào server
     + Push vào ds socket
     + Trả msg thông báo connect thành công
     + 

Client
