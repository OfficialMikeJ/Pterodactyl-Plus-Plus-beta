<?php

namespace Pterodactyl\Listeners;

use Pterodactyl\Models\User;
use Pterodactyl\Events\ActivityLogged;
use Pterodactyl\Services\Touchdown\TrophyService;

class TrophyListener
{
    public function __construct(private TrophyService $service)
    {
    }

    /**
     * Every activity log entry the panel writes flows through here; if the actor
     * is a user, the Touch Down Hosting trophy system gets a chance to award.
     * Trophies must never break the underlying request, so failures (including
     * running before the trophy migration has been applied) are swallowed.
     */
    public function handle(ActivityLogged $event): void
    {
        $actor = $event->model->actor;
        if (!$actor instanceof User) {
            return;
        }

        try {
            $this->service->handleEvent($actor, $event->model->event);
        } catch (\Throwable $exception) {
            logger()->warning('Touch Down Hosting trophy system failed to process an event.', [
                'event' => $event->model->event,
                'exception' => $exception->getMessage(),
            ]);
        }
    }
}
