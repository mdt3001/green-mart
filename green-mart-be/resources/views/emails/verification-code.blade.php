{{-- filepath: resources/views/emails/verification-code.blade.php --}}

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .content {
            padding: 40px 30px;
            text-align: center;
        }

        .code-box {
            background: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 10px;
            padding: 30px;
            margin: 30px 0;
        }

        .code {
            font-size: 48px;
            font-weight: bold;
            letter-spacing: 10px;
            color: #667eea;
            font-family: 'Courier New', monospace;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }

        .warning {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🌱 GreenMart</h1>
            <p>Xác thực tài khoản của bạn</p>
        </div>

        <div class="content">
            <h2>Xin chào {{ $user->name }}!</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại GreenMart.</p>
            <p>Vui lòng sử dụng mã xác thực dưới đây để kích hoạt tài khoản:</p>

            <div class="code-box">
                <div class="code">{{ $code }}</div>
            </div>

            <p>Mã này có hiệu lực trong <strong>10 phút</strong>.</p>
            <p>Nếu bạn không yêu cầu xác thực này, vui lòng bỏ qua email này.</p>

            <div class="warning">
                ⚠️ Không chia sẻ mã này với bất kỳ ai!
            </div>
        </div>

        <div class="footer">
            <p>&copy; 2025 GreenMart. All rights reserved.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>

</html>