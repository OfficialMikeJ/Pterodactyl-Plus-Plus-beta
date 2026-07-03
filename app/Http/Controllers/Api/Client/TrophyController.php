<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Services\Touchdown\TrophyService;
use Pterodactyl\Services\Touchdown\TrophyRegistry;
use Pterodactyl\Http\Requests\Api\Client\ClientApiRequest;

class TrophyController extends ClientApiController
{
    public function __construct(private TrophyService $service)
    {
        parent::__construct();
    }

    /**
     * Returns every trophy in the panel along with the user's earned state,
     * per-trophy progress, and their EXP / level standing.
     */
    public function index(ClientApiRequest $request): JsonResponse
    {
        $user = $request->user();

        $earned = DB::table('user_trophies')
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('trophy_key');

        $counters = $this->service->counters($user);
        $earnedCount = $earned->count();

        $trophies = array_map(function (array $trophy) use ($earned, $counters, $earnedCount) {
            $row = $earned->get($trophy['key']);
            $progress = $trophy['event'] === null
                ? $earnedCount
                : min($counters[$trophy['event']] ?? 0, $trophy['threshold']);

            return [
                'key' => $trophy['key'],
                'name' => $trophy['name'],
                'description' => $trophy['description'],
                'tier' => $trophy['tier'],
                'icon' => $trophy['icon'],
                'exp' => TrophyRegistry::expFor($trophy),
                'threshold' => $trophy['threshold'],
                'progress' => $row ? $trophy['threshold'] : min($progress, $trophy['threshold']),
                'earned' => $row !== null,
                'earned_at' => $row?->earned_at,
            ];
        }, TrophyRegistry::all());

        return new JsonResponse([
            'data' => [
                'trophies' => $trophies,
                'standing' => $this->service->progressFor($user),
            ],
        ]);
    }

    /**
     * Returns trophies earned but not yet shown to the user as a toast.
     */
    public function unseen(ClientApiRequest $request): JsonResponse
    {
        $rows = DB::table('user_trophies')
            ->where('user_id', $request->user()->id)
            ->where('seen', false)
            ->get();

        $trophies = [];
        foreach ($rows as $row) {
            $trophy = TrophyRegistry::find($row->trophy_key);
            if ($trophy !== null) {
                $trophies[] = [
                    'key' => $trophy['key'],
                    'name' => $trophy['name'],
                    'description' => $trophy['description'],
                    'tier' => $trophy['tier'],
                    'icon' => $trophy['icon'],
                    'exp' => TrophyRegistry::expFor($trophy),
                    'earned_at' => $row->earned_at,
                ];
            }
        }

        return new JsonResponse(['data' => $trophies]);
    }

    /**
     * Marks all of the user's unseen trophies as seen (toast displayed).
     */
    public function markSeen(ClientApiRequest $request): JsonResponse
    {
        DB::table('user_trophies')
            ->where('user_id', $request->user()->id)
            ->where('seen', false)
            ->update(['seen' => true]);

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }
}
