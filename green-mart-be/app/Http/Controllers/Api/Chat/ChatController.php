<?php

namespace App\Http\Controllers\Api\Chat;

use App\Http\Controllers\Controller;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    protected ChatService $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Send a message to the chatbot
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'session_id' => 'nullable|string',
        ]);

        $userId = auth()->id();
        $sessionId = $request->input('session_id') ?? ($userId ? "user_{$userId}" : Str::uuid()->toString());
        $message = $request->input('message');

        try {
            $response = $this->chatService->processMessage($message, $userId, $sessionId);

            return response()->json([
                'success' => true,
                'data' => [
                    'response' => $response['message'],
                    'intent' => $response['intent'],
                    'confidence' => $response['confidence'],
                    'suggestions' => $response['suggestions'],
                    'metadata' => $response['metadata'],
                    'session_id' => $sessionId,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi xử lý tin nhắn. Vui lòng thử lại.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get chat history for current session
     */
    public function getHistory(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => 'required|string',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $userId = auth()->id();
        $sessionId = $request->input('session_id');
        $limit = $request->input('limit', 50);

        try {
            $history = $this->chatService->getChatHistory($sessionId, $userId, $limit);

            return response()->json([
                'success' => true,
                'data' => [
                    'messages' => $history,
                    'session_id' => $sessionId,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể tải lịch sử chat.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get quick suggestions for starting conversation
     */
    public function getQuickSuggestions(): JsonResponse
    {
        $suggestions = [
            [
                'text' => 'Xin chào',
                'icon' => '👋',
                'category' => 'greeting',
            ],
            [
                'text' => 'Tìm sản phẩm',
                'icon' => '🔍',
                'category' => 'product',
            ],
            [
                'text' => 'Kiểm tra đơn hàng',
                'icon' => '📦',
                'category' => 'order',
            ],
            [
                'text' => 'Thông tin vận chuyển',
                'icon' => '🚚',
                'category' => 'shipping',
            ],
            [
                'text' => 'Chính sách đổi trả',
                'icon' => '↩️',
                'category' => 'policy',
            ],
            [
                'text' => 'Liên hệ hỗ trợ',
                'icon' => '💬',
                'category' => 'support',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'suggestions' => $suggestions,
            ],
        ]);
    }

    /**
     * Clear chat history for current session
     */
    public function clearHistory(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => 'required|string',
        ]);

        $userId = auth()->id();
        $sessionId = $request->input('session_id');

        try {
            \App\Models\ChatMessage::bySession($sessionId)
                ->when($userId, fn($q) => $q->where('user_id', $userId))
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa lịch sử chat.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa lịch sử chat.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
