<!doctype html>
<html>
	<body>
		<p>Xin chào {{ $user->name }},</p>
		<p>Nhấn vào liên kết sau để đặt lại mật khẩu của bạn:</p>
		<p><a href="{{ $resetUrl }}">{{ $resetUrl }}</a></p>
		<p>Liên kết sẽ hết hạn sau 1 giờ.</p>
	</body>
</html>