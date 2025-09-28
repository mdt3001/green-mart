<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Create a new user from Clerk webhook
     */
    public function createUser(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id' => 'required|string',
                'email_addresses' => 'required|array',
                'first_name' => 'nullable|string',
                'last_name' => 'nullable|string',
                'image_url' => 'nullable|string',
            ]);

            $primaryEmail = $validated['email_addresses'][0]['email_address'] ?? null;
            $firstName = $validated['first_name'] ?? '';
            $lastName = $validated['last_name'] ?? '';
            $fullName = trim($firstName . ' ' . $lastName);

            $user = User::create([
                'id' => $validated['id'],
                'name' => $fullName ?: 'User',
                'email' => $primaryEmail,
                'image' => $validated['image_url'],
                'cart' => json_encode([]),
            ]);

            Log::info('User created successfully', ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to create user', [
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user from Clerk webhook
     */
    public function updateUser(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'email_addresses' => 'sometimes|array',
                'first_name' => 'sometimes|string',
                'last_name' => 'sometimes|string',
                'image_url' => 'sometimes|string',
            ]);

            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $updateData = [];

            if (isset($validated['email_addresses'])) {
                $primaryEmail = $validated['email_addresses'][0]['email_address'] ?? null;
                if ($primaryEmail) {
                    $updateData['email'] = $primaryEmail;
                }
            }

            if (isset($validated['first_name']) || isset($validated['last_name'])) {
                $firstName = $validated['first_name'] ?? '';
                $lastName = $validated['last_name'] ?? '';
                $fullName = trim($firstName . ' ' . $lastName);
                $updateData['name'] = $fullName ?: $user->name;
            }

            if (isset($validated['image_url'])) {
                $updateData['image'] = $validated['image_url'];
            }

            $user->update($updateData);

            Log::info('User updated successfully', ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update user', [
                'user_id' => $id,
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user from Clerk webhook
     */
    public function deleteUser(string $id): JsonResponse
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $user->delete();

            Log::info('User deleted successfully', ['user_id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to delete user', [
                'user_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}