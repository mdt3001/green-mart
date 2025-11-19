<p>Xin chào {{ $user->name }},</p>

<p>Rất tiếc, cửa hàng <strong>{{ $store->name }}</strong> chưa thể được phê duyệt.</p>

<p><strong>Lý do:</strong> {{ $store->reject_reason ?? 'Không được cung cấp.' }}</p>

<p>Bạn có thể cập nhật thông tin và gửi lại yêu cầu bất kỳ lúc nào.</p>

<p>Cảm ơn bạn đã quan tâm đến Green Mart!</p>

