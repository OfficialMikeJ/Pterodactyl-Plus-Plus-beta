<?php

namespace Pterodactyl\Services\Touchdown;

use Carbon\Carbon;
use Pterodactyl\Models\User;
use Illuminate\Support\Facades\DB;

class TrophyService
{
    /**
     * Advances the user's counter for an activity event and awards any trophies
     * whose thresholds have now been met.
     *
     * @return string[] keys of newly awarded trophies
     */
    public function handleEvent(User $user, string $event): array
    {
        $candidates = TrophyRegistry::forEvent($event);
        if (empty($candidates)) {
            return [];
        }

        $count = $this->incrementCounter($user, $event);

        $earned = $this->earnedKeys($user);
        $awarded = [];

        foreach ($candidates as $trophy) {
            if ($count >= $trophy['threshold'] && !in_array($trophy['key'], $earned, true)) {
                if ($this->award($user, $trophy)) {
                    $awarded[] = $trophy['key'];
                    $earned[] = $trophy['key'];
                }
            }
        }

        // Completionist: owning every other trophy unlocks the final platinum.
        if (!empty($awarded) && !in_array(TrophyRegistry::COMPLETIONIST_KEY, $earned, true)) {
            $completionist = TrophyRegistry::find(TrophyRegistry::COMPLETIONIST_KEY);
            if ($completionist && count($earned) >= $completionist['threshold']) {
                if ($this->award($user, $completionist)) {
                    $awarded[] = $completionist['key'];
                }
            }
        }

        return $awarded;
    }

    /**
     * @return array{exp: int, level: int, currentLevelExp: int, nextLevelExp: int}
     */
    public function progressFor(User $user): array
    {
        $exp = (int) ($user->exp ?? 0);
        $level = TrophyRegistry::levelFromExp($exp);

        return [
            'exp' => $exp,
            'level' => $level,
            'currentLevelExp' => TrophyRegistry::expForLevel($level),
            'nextLevelExp' => TrophyRegistry::expForLevel($level + 1),
        ];
    }

    /**
     * @return string[]
     */
    public function earnedKeys(User $user): array
    {
        return DB::table('user_trophies')->where('user_id', $user->id)->pluck('trophy_key')->all();
    }

    /**
     * @return array<string, int> map of activity event => count for this user
     */
    public function counters(User $user): array
    {
        return DB::table('user_action_counters')
            ->where('user_id', $user->id)
            ->pluck('count', 'event')
            ->map(fn ($count) => (int) $count)
            ->all();
    }

    private function incrementCounter(User $user, string $event): int
    {
        DB::table('user_action_counters')->upsert(
            [['user_id' => $user->id, 'event' => $event, 'count' => 1]],
            ['user_id', 'event'],
            ['count' => DB::raw('count + 1')],
        );

        return (int) DB::table('user_action_counters')
            ->where('user_id', $user->id)
            ->where('event', $event)
            ->value('count');
    }

    private function award(User $user, array $trophy): bool
    {
        $inserted = DB::table('user_trophies')->insertOrIgnore([
            'user_id' => $user->id,
            'trophy_key' => $trophy['key'],
            'earned_at' => Carbon::now(),
            'seen' => false,
        ]);

        if ($inserted > 0) {
            User::query()->whereKey($user->id)->increment('exp', TrophyRegistry::expFor($trophy));

            return true;
        }

        return false;
    }
}
