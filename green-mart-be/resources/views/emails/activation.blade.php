<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực tài khoản - {{ $appName }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Chào mừng đến với {{ $appName }}!</h1>
    </div>
    
    <div class="content">
        <h2>Xin chào {{ $user->name }}!</h2>
        
        <p>Cảm ơn bạn đã đăng ký tài khoản tại {{ $appName }}. Để hoàn tất quá trình đăng ký, vui lòng xác thực email của bạn.</p>
        
        <p>Click vào nút bên dưới để xác thực tài khoản:</p>
        
        <div style="text-align: center;">
            <a href="{{ $activationUrl }}" class="button">Xác thực tài khoản</a>
        </div>
        
        <p><strong>Lưu ý:</strong></p>
        <ul>
            <li>Link xác thực sẽ hết hạn sau 24 giờ</li>
            <li>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này</li>
            <li>Nếu nút không hoạt động, copy link sau vào trình duyệt: <br>
                <a href="{{ $activationUrl }}">{{ $activationUrl }}</a>
            </li>
        </ul>
        
        <p>Chúc bạn có trải nghiệm mua sắm tuyệt vời!</p>
    </div>
    
    <div class="footer">
        <p>© {{ date('Y') }} {{ $appName }}. Tất cả quyền được bảo lưu.</p>
        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
    </div>
</body>
</html>