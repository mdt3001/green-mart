<?php

namespace Database\Seeders;

use App\Models\ChatIntent;
use Illuminate\Database\Seeder;

class ChatIntentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $intents = [
            [
                'intent_name' => 'greeting',
                'patterns' => [
                    'xin chào|chào|hi|hello|hey|chào bạn',
                    '/^(xin )?chào/i',
                    '/^hi+$/i',
                ],
                'responses' => [
                    'Xin chào! Tôi là trợ lý ảo của Green Mart. Tôi có thể giúp gì cho bạn?',
                    'Chào bạn! Bạn cần hỗ trợ gì hôm nay?',
                    'Hi! Tôi ở đây để giúp bạn. Bạn muốn tìm hiểu về sản phẩm hay đơn hàng?',
                ],
                'description' => 'Greeting intent - when user says hello',
                'is_active' => true,
            ],
            [
                'intent_name' => 'goodbye',
                'patterns' => [
                    'tạm biệt|bye|goodbye|hẹn gặp lại|cảm ơn tạm biệt',
                    '/^(tạm )?biệt/i',
                    '/bye+$/i',
                ],
                'responses' => [
                    'Cảm ơn bạn đã liên hệ! Chúc bạn một ngày tốt lành!',
                    'Hẹn gặp lại bạn! Mua sắm vui vẻ!',
                    'Tạm biệt! Nếu cần gì hãy quay lại nhé!',
                ],
                'description' => 'Goodbye intent - when user wants to end conversation',
                'is_active' => true,
            ],
            [
                'intent_name' => 'order_status',
                'patterns' => [
                    'đơn hàng|kiểm tra đơn|order|theo dõi đơn|trạng thái đơn',
                    'đơn hàng của tôi|đơn của tôi|đơn mua',
                    '/đơn (hàng)?.*#?\w+/i',
                    '/kiểm tra.*đơn/i',
                ],
                'responses' => [
                    'Tôi sẽ giúp bạn kiểm tra đơn hàng.',
                ],
                'description' => 'Order status inquiry',
                'is_active' => true,
            ],
            [
                'intent_name' => 'product_search',
                'patterns' => [
                    'tìm sản phẩm|tìm kiếm|search|sản phẩm|mua',
                    'có không|có bán|có sản phẩm',
                    '/tìm.*sản phẩm/i',
                    '/có (bán|không|sản phẩm)/i',
                ],
                'responses' => [
                    'Tôi sẽ giúp bạn tìm sản phẩm.',
                ],
                'description' => 'Product search and inquiry',
                'is_active' => true,
            ],
            [
                'intent_name' => 'store_info',
                'patterns' => [
                    'cửa hàng|shop|store|thông tin shop',
                    '/thông tin (cửa hàng|shop)/i',
                ],
                'responses' => [
                    'Tôi sẽ cung cấp thông tin về cửa hàng.',
                ],
                'description' => 'Store information',
                'is_active' => true,
            ],
            [
                'intent_name' => 'shipping_info',
                'patterns' => [
                    'vận chuyển|giao hàng|ship|phí ship|thời gian giao',
                    'bao lâu thì nhận được|khi nào nhận hàng',
                    '/thời gian (giao|vận chuyển)/i',
                    '/(phí|chi phí) (ship|vận chuyển|giao hàng)/i',
                ],
                'responses' => [
                    'Green Mart hỗ trợ vận chuyển toàn quốc. Phí vận chuyển từ 15.000đ - 50.000đ tùy khu vực.',
                ],
                'description' => 'Shipping and delivery information',
                'is_active' => true,
            ],
            [
                'intent_name' => 'payment_info',
                'patterns' => [
                    'thanh toán|payment|phương thức thanh toán|cách thanh toán',
                    'có thể thanh toán|hỗ trợ thanh toán',
                    '/thanh toán (bằng|qua|như thế nào)/i',
                ],
                'responses' => [
                    'Chúng tôi chấp nhận các hình thức thanh toán: COD, Chuyển khoản, Ví điện tử, Thẻ ATM/Credit Card.',
                ],
                'description' => 'Payment methods information',
                'is_active' => true,
            ],
            [
                'intent_name' => 'return_policy',
                'patterns' => [
                    'đổi trả|hoàn trả|return|chính sách đổi trả|bảo hành',
                    'có được đổi|có được trả|muốn đổi|muốn trả',
                    '/chính sách (đổi|trả|bảo hành)/i',
                    '/(đổi|trả) (hàng|sản phẩm)/i',
                ],
                'responses' => [
                    'Chính sách đổi trả: Đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả.',
                ],
                'description' => 'Return and refund policy',
                'is_active' => true,
            ],
            [
                'intent_name' => 'contact_support',
                'patterns' => [
                    'liên hệ|contact|hỗ trợ|support|hotline',
                    'gọi cho|số điện thoại|email',
                    '/liên (hệ|lạc)/i',
                    '/(số|điện thoại|hotline|email)/i',
                ],
                'responses' => [
                    'Bạn có thể liên hệ với chúng tôi qua Email: support@greenmart.com hoặc Hotline: 1900-xxxx',
                ],
                'description' => 'Contact and support information',
                'is_active' => true,
            ],
            [
                'intent_name' => 'check_stock',
                'patterns' => [
                    'còn hàng|hết hàng|tồn kho|stock|available',
                    'có sẵn không|còn không',
                    '/còn (hàng|không|sẵn)/i',
                ],
                'responses' => [
                    'Tôi sẽ kiểm tra tình trạng hàng cho bạn.',
                ],
                'description' => 'Check product stock availability',
                'is_active' => true,
            ],
            [
                'intent_name' => 'price_inquiry',
                'patterns' => [
                    'giá|bao nhiêu tiền|price|cost',
                    'giá bao nhiêu|giá cả',
                    '/giá.*bao nhiêu/i',
                ],
                'responses' => [
                    'Tôi sẽ tra cứu giá sản phẩm cho bạn.',
                ],
                'description' => 'Product price inquiry',
                'is_active' => true,
            ],
            [
                'intent_name' => 'recommendation',
                'patterns' => [
                    'gợi ý|recommend|đề xuất|tư vấn',
                    'nên mua|nên chọn|phù hợp',
                    '/gợi ý.*sản phẩm/i',
                ],
                'responses' => [
                    'Tôi sẽ gợi ý một số sản phẩm phù hợp cho bạn.',
                ],
                'description' => 'Product recommendations',
                'is_active' => true,
            ],
            [
                'intent_name' => 'flash_sale',
                'patterns' => [
                    'flash sale|giảm giá|khuyến mãi|sale|deal',
                    'ưu đãi|giảm giá sốc',
                    '/flash.?sale/i',
                ],
                'responses' => [
                    'Tôi sẽ kiểm tra các chương trình flash sale đang diễn ra.',
                ],
                'description' => 'Flash sale and promotion information',
                'is_active' => true,
            ],
        ];

        foreach ($intents as $intent) {
            ChatIntent::updateOrCreate(
                ['intent_name' => $intent['intent_name']],
                $intent
            );
        }

        $this->command->info('Chat intents seeded successfully!');
    }
}
