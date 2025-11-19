<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;


class CloudinaryService
{
    /**
     * Upload single image to Cloudinary
     */
    public function uploadImage(UploadedFile $file, string $folder = 'uploads'): string
    {
        // Dùng cloudinary()->uploadApi()->upload() thay vì Cloudinary::upload()
        $uploadedFile = cloudinary()->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder' => "green-mart/{$folder}",
                'resource_type' => 'image',
                'transformation' => [
                    'quality' => 'auto',
                    'fetch_format' => 'auto'
                ]
            ]
        );

        return $uploadedFile['secure_url'];
    }

    /**
     * Upload multiple images to Cloudinary
     */
    public function uploadImages(array $files, string $folder = 'uploads'): array
    {
        $urls = [];
        foreach ($files as $file) {
            $urls[] = $this->uploadImage($file, $folder);
        }
        return $urls;
    }

    /**
     * Delete image from Cloudinary by URL
     */
    public function deleteImage(string $url): bool
    {
        try {
            $publicId = $this->getPublicIdFromUrl($url);
            cloudinary()->uploadApi()->destroy($publicId);
            return true;
        } catch (\Exception $e) {
            Log::error('Cloudinary delete error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Extract public_id from Cloudinary URL
     * Example: https://res.cloudinary.com/demo/image/upload/v1234/green-mart/stores/logos/abc.jpg
     * Returns: green-mart/stores/logos/abc
     */
    private function getPublicIdFromUrl(string $url): string
    {
        $parts = explode('/', $url);

        // Find 'upload' index
        $uploadIndex = array_search('upload', $parts);

        if ($uploadIndex === false) {
            throw new \Exception('Invalid Cloudinary URL');
        }

        // Get folder path and filename
        $folderParts = array_slice($parts, $uploadIndex + 2, -1);
        $filename = pathinfo(end($parts), PATHINFO_FILENAME);

        return implode('/', $folderParts) . '/' . $filename;
    }

    /**
     * Get optimized image URL with transformations
     */
    public function getOptimizedUrl(string $url, array $transformations = []): string
    {
        $publicId = $this->getPublicIdFromUrl($url);

        return cloudinary()->image($publicId)
            ->addTransformation($transformations)
            ->toUrl();
    }
}
