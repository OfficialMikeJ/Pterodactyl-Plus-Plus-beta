<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Touch Down Hosting trophy & EXP system. Trophy definitions themselves are
     * hardcoded in \Pterodactyl\Services\Touchdown\TrophyRegistry — the database
     * only tracks what each user has earned and their action counters.
     */
    public function up(): void
    {
        Schema::create('user_trophies', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->string('trophy_key');
            $table->timestamp('earned_at')->useCurrent();
            $table->boolean('seen')->default(false);

            $table->unique(['user_id', 'trophy_key']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::create('user_action_counters', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->string('event');
            $table->unsignedInteger('count')->default(0);

            $table->unique(['user_id', 'event']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('exp')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_trophies');
        Schema::dropIfExists('user_action_counters');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('exp');
        });
    }
};
