{{-- filepath: resources/views/emails/password-reset-code.blade.php --}}

<!DOCTYPE html>
<html lang="vi">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		body {
			font-family: 'Segoe UI', Arial, sans-serif;
			background-color: #f4f7f6;
			margin: 0;
			padding: 0;
		}

		.email-container {
			max-width: 600px;
			margin: 40px auto;
			background: #ffffff;
			border-radius: 12px;
			overflow: hidden;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		}

		.header {
			background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
			color: white;
			padding: 40px 30px;
			text-align: center;
		}

		.header h1 {
			margin: 0;
			font-size: 28px;
			font-weight: 600;
		}

		.header p {
			margin: 10px 0 0;
			opacity: 0.9;
		}

		.content {
			padding: 40px 30px;
			color: #333;
		}

		.greeting {
			font-size: 18px;
			margin-bottom: 20px;
			color: #2c3e50;
		}

		.code-section {
			background: #fff3f3;
			border: 2px dashed #e74c3c;
			border-radius: 10px;
			padding: 30px;
			margin: 30px 0;
			text-align: center;
		}

		.code-label {
			font-size: 14px;
			color: #7f8c8d;
			margin-bottom: 15px;
			text-transform: uppercase;
			letter-spacing: 1px;
		}

		.code {
			font-size: 48px;
			font-weight: bold;
			letter-spacing: 12px;
			color: #e74c3c;
			font-family: 'Courier New', monospace;
			margin: 10px 0;
		}

		.expiry-notice {
			color: #e74c3c;
			font-size: 14px;
			margin-top: 15px;
			font-weight: 500;
		}

		.instructions {
			background: #ecf0f1;
			padding: 20px;
			border-radius: 8px;
			margin: 20px 0;
		}

		.instructions ol {
			margin: 10px 0;
			padding-left: 20px;
		}

		.instructions li {
			margin: 8px 0;
			line-height: 1.6;
		}

		.warning {
			background: #fff3cd;
			border-left: 4px solid #ffc107;
			padding: 15px;
			margin: 20px 0;
			border-radius: 4px;
		}

		.warning-icon {
			font-size: 20px;
			margin-right: 8px;
		}

		.security-notice {
			background: #e8f5e9;
			border-left: 4px solid #4CAF50;
			padding: 15px;
			margin: 20px 0;
			border-radius: 4px;
		}

		.footer {
			background: #2c3e50;
			color: #ecf0f1;
			padding: 25px;
			text-align: center;
			font-size: 14px;
		}

		.footer p {
			margin: 5px 0;
		}

		.footer a {
			color: #e74c3c;
			text-decoration: none;
		}
	</style>
</head>

<body>
	<div class="email-container">
		<!-- Header -->
		<div class="header">
			<h1>🔐 Green Mart</h1>
			<p>Đặt lại mật khẩu tài khoản</p>
		</div>

		<!-- Content -->
		<div class="content">
			<div class="greeting">
				Xin chào <strong>{{ $user->name }}</strong>,
			</div>

			<p>
				Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản
				<strong>{{ $user->email }}</strong>
			</p>

			<p>
				Để tiếp tục, vui lòng sử dụng mã xác thực dưới đây:
			</p>

			<!-- Code Section -->
			<div class="code-section">
				<div class="code-label">Mã đặt lại mật khẩu</div>
				<div class="code">{{ $code }}</div>
				<div class="expiry-notice">
					⏰ Mã này sẽ hết hạn sau <strong>10 phút</strong>
				</div>
			</div>

			<!-- Instructions -->
			<div class="instructions">
				<strong>Hướng dẫn đặt lại mật khẩu:</strong>
				<ol>
					<li>Quay lại trang đặt lại mật khẩu</li>
					<li>Nhập mã <strong>6 chữ số</strong> ở trên</li>
					<li>Nhập mật khẩu mới của bạn (tối thiểu 8 ký tự)</li>
					<li>Xác nhận mật khẩu và hoàn tất</li>
				</ol>
			</div>

			<!-- Security Notice -->
			<div class="security-notice">
				<span style="font-size: 20px; margin-right: 8px;">🛡️</span>
				<strong>Lưu ý bảo mật:</strong>
				<ul style="margin: 10px 0; padding-left: 20px;">
					<li>Sau khi đặt lại mật khẩu, tất cả phiên đăng nhập sẽ bị đăng xuất</li>
					<li>Bạn cần đăng nhập lại với mật khẩu mới</li>
				</ul>
			</div>

			<!-- Warning -->
			<div class="warning">
				<span class="warning-icon">⚠️</span>
				<strong>Nếu bạn không yêu cầu đặt lại mật khẩu:</strong>
				<ul style="margin: 10px 0; padding-left: 20px;">
					<li>Vui lòng bỏ qua email này</li>
					<li>Mật khẩu của bạn sẽ không thay đổi</li>
					<li>Nếu bạn nghi ngờ tài khoản bị xâm nhập, hãy liên hệ ngay với chúng tôi</li>
				</ul>
			</div>

			<p style="margin-top: 30px;">
				Nếu bạn gặp vấn đề, vui lòng liên hệ bộ phận hỗ trợ.
			</p>

			<p>
				Trân trọng,<br>
				<strong>Đội ngũ Green Mart</strong>
			</p>
		</div>

		<!-- Footer -->
		<div class="footer">
			<p>&copy; {{ date('Y') }} Green Mart. All rights reserved.</p>
			<p>
				<a href="{{ config('app.url') }}">Website</a> |
				<a href="mailto:support@greenmart.com">Hỗ trợ</a>
			</p>
			<p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
				Email này được gửi tự động, vui lòng không trả lời.
			</p>
		</div>
	</div>
</body>

</html>