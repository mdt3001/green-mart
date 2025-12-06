<?php

namespace App\Services;

use App\Models\ChatIntent;
use App\Models\ChatMessage;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;

class ChatService
{
    /**
     * Process user message and generate bot response
     */
    public function processMessage(string $message, ?int $userId, string $sessionId): array
    {
        // Detect intent
        $intentData = $this->detectIntent($message);
        
        // Generate response based on intent
        $response = $this->generateResponse($intentData, $message, $userId);
        
        // Save message to database
        $chatMessage = ChatMessage::create([
            'user_id' => $userId,
            'session_id' => $sessionId,
            'sender_type' => 'user',
            'message' => $message,
            'bot_response' => $response['message'],
            'intent' => $intentData['intent'],
            'confidence' => $intentData['confidence'],
            'metadata' => $response['metadata'] ?? null,
        ]);

        return [
            'message' => $response['message'],
            'intent' => $intentData['intent'],
            'confidence' => $intentData['confidence'],
            'suggestions' => $response['suggestions'] ?? [],
            'metadata' => $response['metadata'] ?? null,
        ];
    }

    /**
     * Detect intent from user message
     */
    private function detectIntent(string $message): array
    {
        $message = strtolower(trim($message));
        $intents = ChatIntent::active()->get();
        
        $bestMatch = [
            'intent' => 'unknown',
            'confidence' => 0.0,
        ];

        foreach ($intents as $intent) {
            $patterns = $intent->patterns;
            
            foreach ($patterns as $pattern) {
                // Check if pattern matches
                $confidence = $this->calculateConfidence($message, $pattern);
                
                if ($confidence > $bestMatch['confidence']) {
                    $bestMatch = [
                        'intent' => $intent->intent_name,
                        'confidence' => $confidence,
                        'intent_data' => $intent,
                    ];
                }
            }
        }

        return $bestMatch;
    }

    /**
     * Calculate confidence score for pattern matching
     */
    private function calculateConfidence(string $message, string $pattern): float
    {
        // Check if pattern is regex
        if (strpos($pattern, '/') === 0) {
            return preg_match($pattern, $message) ? 0.9 : 0.0;
        }
        
        // Keyword matching
        $keywords = explode('|', strtolower($pattern));
        $matchCount = 0;
        
        foreach ($keywords as $keyword) {
            if (strpos($message, trim($keyword)) !== false) {
                $matchCount++;
            }
        }
        
        return $matchCount > 0 ? ($matchCount / count($keywords)) : 0.0;
    }

    /**
     * Generate response based on detected intent
     */
    private function generateResponse(array $intentData, string $message, ?int $userId): array
    {
        $intent = $intentData['intent'];
        
        return match($intent) {
            'greeting' => $this->handleGreeting($intentData),
            'order_status' => $this->handleOrderStatus($message, $userId),
            'product_search' => $this->handleProductSearch($message),
            'store_info' => $this->handleStoreInfo($message),
            'shipping_info' => $this->handleShippingInfo(),
            'payment_info' => $this->handlePaymentInfo(),
            'return_policy' => $this->handleReturnPolicy(),
            'contact_support' => $this->handleContactSupport(),
            'check_stock' => $this->handleCheckStock($message),
            'price_inquiry' => $this->handlePriceInquiry($message),
            'recommendation' => $this->handleRecommendation($userId),
            'flash_sale' => $this->handleFlashSale(),
            'goodbye' => $this->handleGoodbye(),
            default => $this->handleUnknown(),
        };
    }

    private function handleGreeting(array $intentData): array
    {
        $responses = $intentData['intent_data']->responses ?? [
            "Xin chào! Tôi là trợ lý ảo của Green Mart. Tôi có thể giúp gì cho bạn?",
            "Chào bạn! Bạn cần hỗ trợ gì hôm nay?",
            "Hi! Tôi ở đây để giúp bạn. Bạn muốn tìm hiểu về sản phẩm hay đơn hàng?",
        ];
        
        return [
            'message' => $responses[array_rand($responses)],
            'suggestions' => [
                'Tìm sản phẩm',
                'Kiểm tra đơn hàng',
                'Thông tin vận chuyển',
                'Chính sách đổi trả',
            ],
        ];
    }

    private function handleOrderStatus(string $message, ?int $userId): array
    {
        if (!$userId) {
            return [
                'message' => 'Bạn cần đăng nhập để kiểm tra trạng thái đơn hàng. Vui lòng đăng nhập và thử lại.',
                'suggestions' => ['Đăng nhập', 'Đăng ký'],
            ];
        }

        // Extract order code if present
        preg_match('/#?(\w+)/', $message, $matches);
        $orderCode = $matches[1] ?? null;

        if ($orderCode) {
            $order = Order::with(['orderItems.product'])
                ->where('user_id', $userId)
                ->where('order_code', $orderCode)
                ->first();

            if ($order) {
                $itemCount = $order->orderItems->count();
                $statusText = match($order->status) {
                    'pending' => 'Chờ xác nhận',
                    'confirmed' => 'Đã xác nhận',
                    'processing' => 'Đang xử lý',
                    'shipping' => 'Đang giao hàng',
                    'delivered' => 'Đã giao hàng',
                    'cancelled' => 'Đã hủy',
                    default => $order->status,
                };

                $itemsList = $order->orderItems->take(3)->map(fn($item) => 
                    "• {$item->product->name} (x{$item->quantity})"
                )->join("\n");

                $message = "📦 Đơn hàng #{$order->order_code}\n" .
                    "🔖 Trạng thái: {$statusText}\n" .
                    "💰 Tổng tiền: " . number_format($order->total_amount) . " VNĐ\n" .
                    "📅 Ngày đặt: " . $order->created_at->format('d/m/Y H:i') . "\n\n" .
                    "Sản phẩm:\n{$itemsList}";

                if ($itemCount > 3) {
                    $message .= "\n...và " . ($itemCount - 3) . " sản phẩm khác";
                }

                return [
                    'message' => $message,
                    'metadata' => [
                        'order_id' => $order->id,
                        'order_code' => $order->order_code,
                        'status' => $order->status,
                        'total_amount' => $order->total_amount,
                        'items' => $order->orderItems->map(fn($item) => [
                            'product_name' => $item->product->name,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                        ])->toArray(),
                    ],
                    'suggestions' => ['Xem chi tiết đơn hàng', 'Các đơn hàng khác', 'Hủy đơn hàng'],
                ];
            } else {
                return [
                    'message' => "Không tìm thấy đơn hàng #{$orderCode}. Vui lòng kiểm tra lại mã đơn hàng.",
                    'suggestions' => ['Xem tất cả đơn hàng', 'Liên hệ hỗ trợ'],
                ];
            }
        }

        // Show recent orders with statistics
        $totalOrders = Order::where('user_id', $userId)->count();
        $pendingOrders = Order::where('user_id', $userId)
            ->whereIn('status', ['pending', 'confirmed', 'processing', 'shipping'])
            ->count();

        $recentOrders = Order::where('user_id', $userId)
            ->with('orderItems')
            ->latest()
            ->take(3)
            ->get();

        if ($recentOrders->isEmpty()) {
            return [
                'message' => 'Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm những sản phẩm tuyệt vời của chúng tôi!',
                'suggestions' => ['Xem sản phẩm mới', 'Xem flash sale', 'Sản phẩm bán chạy'],
            ];
        }

        $orderList = $recentOrders->map(function($o) {
            $statusEmoji = match($o->status) {
                'pending' => '⏳',
                'confirmed' => '✅',
                'processing' => '📦',
                'shipping' => '🚚',
                'delivered' => '✨',
                'cancelled' => '❌',
                default => '📋',
            };
            return "{$statusEmoji} #{$o->order_code} - " . number_format($o->total_amount) . "đ ({$o->orderItems->count()} sản phẩm)";
        })->join("\n");
        
        $message = "📊 Tổng quan đơn hàng:\n" .
            "• Tổng số đơn: {$totalOrders}\n" .
            "• Đơn đang xử lý: {$pendingOrders}\n\n" .
            "Đơn hàng gần nhất:\n{$orderList}\n\n" .
            "Nhập mã đơn hàng để xem chi tiết (VD: #ORD123)";

        return [
            'message' => $message,
            'metadata' => [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'recent_orders' => $recentOrders->map(fn($o) => [
                    'order_code' => $o->order_code,
                    'status' => $o->status,
                    'total_amount' => $o->total_amount,
                    'item_count' => $o->orderItems->count(),
                ])->toArray(),
            ],
            'suggestions' => $recentOrders->pluck('order_code')->map(fn($code) => "#{$code}")->toArray(),
        ];
    }

    private function handleProductSearch(string $message): array
    {
        // Extract product keywords and price range
        $keywords = preg_replace('/tìm|kiếm|sản phẩm|mua|có|không|dưới|trên|giá|từ/i', '', $message);
        $keywords = trim($keywords);

        // Extract price range
        preg_match('/(\d+)k?\s*(đến|tới|-)\s*(\d+)k?/i', $message, $priceRange);
        preg_match('/dưới\s*(\d+)k?/i', $message, $maxPrice);
        preg_match('/trên\s*(\d+)k?/i', $message, $minPrice);

        if (strlen($keywords) < 2 && empty($priceRange) && empty($maxPrice) && empty($minPrice)) {
            return [
                'message' => 'Bạn đang tìm sản phẩm gì? Hãy cho tôi biết tên, loại sản phẩm hoặc khoảng giá bạn muốn.',
                'suggestions' => ['Sản phẩm mới', 'Sản phẩm bán chạy', 'Flash sale', 'Sản phẩm dưới 500k'],
            ];
        }

        // Build query
        $query = Product::with(['store:id,name,logo', 'category:id,name'])
            ->where('in_stock', true)
            ->withCount('ratings')
            ->withAvg('ratings', 'rating');

        // Search by keywords
        if (strlen($keywords) >= 2) {
            $query->where(function($q) use ($keywords) {
                $q->where('name', 'like', "%{$keywords}%")
                  ->orWhere('description', 'like', "%{$keywords}%")
                  ->orWhereHas('category', function($q2) use ($keywords) {
                      $q2->where('name', 'like', "%{$keywords}%");
                  });
            });
        }

        // Apply price filters
        if (!empty($priceRange)) {
            $min = intval($priceRange[1]) * 1000;
            $max = intval($priceRange[3]) * 1000;
            $query->whereBetween('price', [$min, $max]);
        } elseif (!empty($maxPrice)) {
            $max = intval($maxPrice[1]) * 1000;
            $query->where('price', '<=', $max);
        } elseif (!empty($minPrice)) {
            $min = intval($minPrice[1]) * 1000;
            $query->where('price', '>=', $min);
        }

        $products = $query->orderByDesc('ratings_avg_rating')
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        if ($products->isEmpty()) {
            $fallbackProducts = Product::with(['store:id,name,logo'])
                ->where('in_stock', true)
                ->withCount('ratings')
                ->withAvg('ratings', 'rating')
                ->orderByDesc('ratings_avg_rating')
                ->take(3)
                ->get();

            if ($fallbackProducts->isEmpty()) {
                return [
                    'message' => "Xin lỗi, hiện tại không có sản phẩm phù hợp. Hãy thử tìm kiếm với từ khóa khác!",
                    'suggestions' => ['Xem tất cả sản phẩm', 'Sản phẩm mới', 'Flash sale'],
                ];
            }

            return [
                'message' => "Không tìm thấy sản phẩm phù hợp. Đây là một số gợi ý cho bạn:",
                'metadata' => [
                    'products' => $fallbackProducts->map(fn($p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'price' => number_format($p->price),
                        'in_stock' => $p->in_stock,
                        'rating' => round($p->ratings_avg_rating ?? 0, 1),
                        'store_name' => $p->store->name ?? 'N/A',
                        'image' => $p->image,
                    ])->toArray(),
                ],
                'suggestions' => ['Xem tất cả sản phẩm', 'Danh mục sản phẩm'],
            ];
        }

        $productList = $products->map(function($p) {
            $rating = $p->ratings_avg_rating ? round($p->ratings_avg_rating, 1) . '⭐' : 'Chưa có đánh giá';
            return "• {$p->name} - " . number_format($p->price) . "đ ({$rating})";
        })->take(3)->join("\n");
        
        $message = "Tôi tìm thấy {$products->count()} sản phẩm phù hợp:\n\n{$productList}";
        
        if ($products->count() > 3) {
            $message .= "\n\n...và " . ($products->count() - 3) . " sản phẩm khác.";
        }

        return [
            'message' => $message,
            'metadata' => [
                'products' => $products->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => number_format($p->price),
                    'in_stock' => $p->in_stock,
                    'rating' => round($p->ratings_avg_rating ?? 0, 1),
                    'rating_count' => $p->ratings_count,
                    'store_name' => $p->store->name ?? 'N/A',
                    'category_name' => $p->category->name ?? 'N/A',
                    'image' => $p->image,
                ])->toArray(),
            ],
            'suggestions' => ['Xem chi tiết', 'Tìm sản phẩm khác', 'So sánh giá'],
        ];
    }

    private function handleStoreInfo(string $message): array
    {
        // Extract store name if present
        $keywords = preg_replace('/shop|cửa hàng|store|thông tin/i', '', $message);
        $keywords = trim($keywords);

        if (strlen($keywords) < 2) {
            // Show top stores
            $topStores = Store::where('is_active', true)
                ->withCount('products')
                ->orderByDesc('products_count')
                ->take(5)
                ->get();

            if ($topStores->isEmpty()) {
                return [
                    'message' => 'Hiện tại chưa có cửa hàng nào hoạt động.',
                    'suggestions' => ['Xem sản phẩm', 'Liên hệ hỗ trợ'],
                ];
            }

            $storeList = $topStores->map(fn($s) => 
                "🏪 {$s->name} ({$s->products_count} sản phẩm)"
            )->join("\n");

            return [
                'message' => "Các cửa hàng nổi bật:\n\n{$storeList}\n\nNhập tên cửa hàng để xem chi tiết.",
                'metadata' => [
                    'stores' => $topStores->map(fn($s) => [
                        'id' => $s->id,
                        'name' => $s->name,
                        'product_count' => $s->products_count,
                        'logo' => $s->logo,
                    ])->toArray(),
                ],
                'suggestions' => $topStores->take(3)->pluck('name')->toArray(),
            ];
        }

        $stores = Store::where('name', 'like', "%{$keywords}%")
            ->where('is_active', true)
            ->withCount('products')
            ->take(3)
            ->get();

        if ($stores->isEmpty()) {
            return [
                'message' => "Không tìm thấy cửa hàng '{$keywords}'. Bạn có thể xem danh sách tất cả các cửa hàng.",
                'suggestions' => ['Xem tất cả cửa hàng', 'Cửa hàng nổi bật'],
            ];
        }

        $store = $stores->first();
        
        // Get store products
        $productCount = $store->products_count;
        $topProducts = Product::where('store_id', $store->id)
            ->where('in_stock', true)
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->orderByDesc('ratings_avg_rating')
            ->take(3)
            ->get();

        $productList = $topProducts->map(fn($p) => 
            "• {$p->name} - " . number_format($p->price) . "đ"
        )->join("\n");

        $message = "🏪 {$store->name}\n\n" .
            "📝 Mô tả: {$store->description}\n" .
            "📍 Địa chỉ: {$store->address}\n" .
            "📦 Số sản phẩm: {$productCount}\n";

        if ($topProducts->isNotEmpty()) {
            $message .= "\n🔥 Sản phẩm nổi bật:\n{$productList}";
        }

        return [
            'message' => $message,
            'metadata' => [
                'store_id' => $store->id,
                'store_name' => $store->name,
                'product_count' => $productCount,
                'logo' => $store->logo,
                'top_products' => $topProducts->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'rating' => round($p->ratings_avg_rating ?? 0, 1),
                ])->toArray(),
            ],
            'suggestions' => ['Xem sản phẩm của cửa hàng', 'Cửa hàng khác', 'Liên hệ cửa hàng'],
        ];
    }

    private function handleShippingInfo(): array
    {
        return [
            'message' => 'Green Mart hỗ trợ vận chuyển toàn quốc. Phí vận chuyển từ 15.000đ - 50.000đ tùy khu vực. Thời gian giao hàng: 2-5 ngày làm việc. Miễn phí ship cho đơn hàng trên 500.000đ.',
            'suggestions' => ['Tính phí ship', 'Theo dõi đơn hàng', 'Liên hệ hỗ trợ'],
        ];
    }

    private function handlePaymentInfo(): array
    {
        return [
            'message' => 'Chúng tôi chấp nhận các hình thức thanh toán: COD (thanh toán khi nhận hàng), Chuyển khoản ngân hàng, Ví điện tử (MoMo, ZaloPay), Thẻ ATM/Credit Card.',
            'suggestions' => ['Hướng dẫn thanh toán', 'Chính sách hoàn tiền'],
        ];
    }

    private function handleReturnPolicy(): array
    {
        return [
            'message' => 'Chính sách đổi trả: Đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả. Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng. Chúng tôi sẽ hoàn tiền hoặc đổi sản phẩm mới.',
            'suggestions' => ['Yêu cầu đổi trả', 'Điều kiện đổi trả', 'Liên hệ hỗ trợ'],
        ];
    }

    private function handleContactSupport(): array
    {
        return [
            'message' => 'Bạn có thể liên hệ với chúng tôi qua: Email: support@greenmart.com, Hotline: 1900-xxxx (8:00 - 22:00), hoặc chat trực tiếp tại website.',
            'suggestions' => ['Gửi email hỗ trợ', 'FAQ', 'Trung tâm trợ giúp'],
        ];
    }

    private function handleGoodbye(): array
    {
        $responses = [
            "Cảm ơn bạn đã liên hệ! Chúc bạn một ngày tốt lành!",
            "Hẹn gặp lại bạn! Mua sắm vui vẻ!",
            "Tạm biệt! Nếu cần gì hãy quay lại nhé!",
        ];
        
        return [
            'message' => $responses[array_rand($responses)],
            'suggestions' => [],
        ];
    }

    private function handleUnknown(): array
    {
        return [
            'message' => 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể diễn đạt lại hoặc chọn một trong các chủ đề sau?',
            'suggestions' => [
                'Tìm sản phẩm',
                'Kiểm tra đơn hàng',
                'Thông tin vận chuyển',
                'Chính sách đổi trả',
                'Liên hệ hỗ trợ',
            ],
        ];
    }

    /**
     * Handle stock availability check
     */
    private function handleCheckStock(string $message): array
    {
        // Extract product name from message
        $keywords = trim(preg_replace('/còn|hàng|không|kiểm tra|check|stock|tồn kho/ui', '', $message));
        
        if (strlen($keywords) < 2) {
            return [
                'message' => 'Bạn muốn kiểm tra tồn kho sản phẩm nào? Vui lòng cho tôi biết tên sản phẩm.',
                'suggestions' => ['Sản phẩm mới', 'Sản phẩm bán chạy'],
            ];
        }

        $product = Product::with('store:id,name')
            ->where('name', 'like', "%{$keywords}%")
            ->first();

        if (!$product) {
            return [
                'message' => "Xin lỗi, tôi không tìm thấy sản phẩm \"{$keywords}\" trong hệ thống. Bạn có thể thử tìm với từ khóa khác không?",
                'suggestions' => ['Tìm sản phẩm khác', 'Sản phẩm mới nhất'],
            ];
        }

        $status = $product->in_stock ? '✅ Còn hàng' : '❌ Hết hàng';
        $stockInfo = $product->stock_quantity > 0 
            ? " (Còn {$product->stock_quantity} sản phẩm)"
            : '';

        $message = "🔍 Thông tin tồn kho:\n\n" .
            "📦 Sản phẩm: {$product->name}\n" .
            "🏪 Cửa hàng: {$product->store->name}\n" .
            "📊 Trạng thái: {$status}{$stockInfo}\n" .
            "💰 Giá: " . number_format($product->price, 0, ',', '.') . "đ";

        return [
            'message' => $message,
            'metadata' => [
                'product_id' => $product->id,
                'in_stock' => $product->in_stock,
                'stock_quantity' => $product->stock_quantity,
                'price' => $product->price,
            ],
        ];
    }

    /**
     * Handle price inquiry
     */
    private function handlePriceInquiry(string $message): array
    {
        // Extract product name
        $keywords = trim(preg_replace('/giá|bao nhiêu|price|cost|얼마/ui', '', $message));
        
        if (strlen($keywords) < 2) {
            return [
                'message' => 'Bạn muốn biết giá sản phẩm nào? Hãy cho tôi biết tên sản phẩm.',
                'suggestions' => ['Sản phẩm mới', 'Flash sale'],
            ];
        }

        $products = Product::with(['store:id,name', 'category:id,name'])
            ->where('name', 'like', "%{$keywords}%")
            ->where('in_stock', true)
            ->withAvg('ratings', 'rating')
            ->withCount('ratings')
            ->take(3)
            ->get();

        if ($products->isEmpty()) {
            return [
                'message' => "Xin lỗi, tôi không tìm thấy sản phẩm \"{$keywords}\". Bạn có thể thử tìm với từ khóa khác không?",
                'suggestions' => ['Tìm sản phẩm khác', 'Sản phẩm bán chạy'],
            ];
        }

        $message = "💰 Thông tin giá:\n\n";
        
        foreach ($products as $product) {
            $rating = $product->ratings_avg_rating 
                ? '⭐ ' . number_format($product->ratings_avg_rating, 1) . '/5'
                : 'Chưa có đánh giá';
            
            $message .= "📦 {$product->name}\n" .
                "🏪 {$product->store->name}\n" .
                "💵 Giá: " . number_format($product->price, 0, ',', '.') . "đ\n" .
                "{$rating}\n\n";
        }

        $message .= "Bạn có muốn xem thêm thông tin chi tiết?";

        return [
            'message' => $message,
            'metadata' => [
                'products' => $products->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'rating' => $p->ratings_avg_rating,
                    'store' => $p->store->name,
                ])->toArray(),
            ],
        ];
    }

    /**
     * Handle product recommendation
     */
    private function handleRecommendation(?int $userId): array
    {
        // Get top-rated products
        $topRated = Product::with(['store:id,name', 'category:id,name'])
            ->where('in_stock', true)
            ->withAvg('ratings', 'rating')
            ->withCount(['ratings', 'orderItems'])
            ->having('ratings_avg_rating', '>=', 4.0)
            ->orderByDesc('ratings_avg_rating')
            ->orderByDesc('order_items_count')
            ->take(5)
            ->get();

        if ($topRated->isEmpty()) {
            // Fallback to newest products
            $topRated = Product::with(['store:id,name', 'category:id,name'])
                ->where('in_stock', true)
                ->orderByDesc('created_at')
                ->take(5)
                ->get();
        }

        $message = "🌟 Gợi ý sản phẩm cho bạn:\n\n";
        
        foreach ($topRated as $index => $product) {
            $rating = $product->ratings_avg_rating 
                ? '⭐ ' . number_format($product->ratings_avg_rating, 1) . '/5 (' . $product->ratings_count . ' đánh giá)'
                : '🆕 Sản phẩm mới';
            
            $sales = $product->order_items_count 
                ? "🔥 Đã bán {$product->order_items_count}"
                : '';

            $message .= ($index + 1) . ". 📦 {$product->name}\n" .
                "   🏪 {$product->store->name}\n" .
                "   💰 " . number_format($product->price, 0, ',', '.') . "đ\n" .
                "   {$rating}\n";
            
            if ($sales) {
                $message .= "   {$sales}\n";
            }
            
            $message .= "\n";
        }

        $message .= "Bạn có muốn xem chi tiết sản phẩm nào không?";

        return [
            'message' => $message,
            'metadata' => [
                'recommendations' => $topRated->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'rating' => $p->ratings_avg_rating,
                    'rating_count' => $p->ratings_count,
                    'sales' => $p->order_items_count,
                    'store' => $p->store->name,
                    'category' => $p->category->name ?? null,
                ])->toArray(),
            ],
        ];
    }

    /**
     * Handle flash sale inquiry
     */
    private function handleFlashSale(): array
    {
        $now = now();
        
        // Get active flash sales
        $flashSales = \App\Models\FlashSale::with(['products' => function($query) {
            $query->with(['product.store:id,name'])
                  ->where('quantity', '>', 0);
        }])
        ->where('start_time', '<=', $now)
        ->where('end_time', '>=', $now)
        ->where('is_active', true)
        ->get();

        if ($flashSales->isEmpty()) {
            return [
                'message' => '⚡ Hiện tại không có chương trình Flash Sale nào đang diễn ra.\n\nVui lòng quay lại sau hoặc theo dõi các chương trình khuyến mãi khác!',
                'suggestions' => ['Sản phẩm bán chạy', 'Sản phẩm mới'],
            ];
        }

        $message = "⚡ Flash Sale đang diễn ra:\n\n";
        
        foreach ($flashSales as $sale) {
            $endTime = $sale->end_time->format('H:i d/m/Y');
            $message .= "🎉 {$sale->name}\n" .
                "⏰ Kết thúc: {$endTime}\n" .
                "📦 Sản phẩm:\n\n";

            foreach ($sale->products as $flashProduct) {
                if ($flashProduct->product) {
                    $originalPrice = $flashProduct->product->price;
                    $discount = number_format($flashProduct->discount_percentage, 0);
                    $salePrice = $originalPrice * (1 - $flashProduct->discount_percentage / 100);
                    
                    $message .= "   • {$flashProduct->product->name}\n" .
                        "     🏪 {$flashProduct->product->store->name}\n" .
                        "     💸 Giá gốc: " . number_format($originalPrice, 0, ',', '.') . "đ\n" .
                        "     🔥 Giảm {$discount}%: " . number_format($salePrice, 0, ',', '.') . "đ\n" .
                        "     📊 Còn lại: {$flashProduct->quantity} sản phẩm\n\n";
                }
            }
        }

        $message .= "Nhanh tay đặt hàng trước khi hết!";

        return [
            'message' => $message,
            'metadata' => [
                'flash_sales' => $flashSales->map(fn($sale) => [
                    'id' => $sale->id,
                    'name' => $sale->name,
                    'end_time' => $sale->end_time->toIso8601String(),
                    'products' => $sale->products->map(fn($fp) => [
                        'product_id' => $fp->product_id,
                        'name' => $fp->product->name ?? null,
                        'original_price' => $fp->product->price ?? 0,
                        'discount_percentage' => $fp->discount_percentage,
                        'quantity' => $fp->quantity,
                    ])->toArray(),
                ])->toArray(),
            ],
        ];
    }

    /**
     * Get chat history for a session
     */
    public function getChatHistory(string $sessionId, ?int $userId, int $limit = 50): array
    {
        $query = ChatMessage::bySession($sessionId);
        
        if ($userId) {
            $query->orWhere('user_id', $userId);
        }

        return $query->latest()
            ->take($limit)
            ->get()
            ->reverse()
            ->map(fn($msg) => [
                'sender_type' => $msg->sender_type,
                'message' => $msg->sender_type === 'user' ? $msg->message : $msg->bot_response,
                'created_at' => $msg->created_at->toIso8601String(),
                'intent' => $msg->intent,
            ])
            ->toArray();
    }
}
