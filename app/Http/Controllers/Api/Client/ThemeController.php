<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Illuminate\Http\JsonResponse;
use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;

class ThemeController extends ClientApiController
{
    /**
     * Returns every Touch Down Hosting theme available on this panel. Themes are
     * plain JSON documents in `public/themes/` — drop a new `.json` file in that
     * directory at any time and it is picked up here automatically.
     */
    public function __invoke(ClientApiRequest $request): JsonResponse
    {
        $themes = [];

        foreach (glob(public_path('themes/*.json')) ?: [] as $path) {
            $contents = @file_get_contents($path);
            if ($contents === false) {
                continue;
            }

            $theme = json_decode($contents, true);
            if (!is_array($theme) || empty($theme['id']) || empty($theme['name']) || empty($theme['colors']['brand'])) {
                continue;
            }

            $themes[] = $theme;
        }

        return new JsonResponse(['data' => $themes]);
    }
}
