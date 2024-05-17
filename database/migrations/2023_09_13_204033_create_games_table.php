<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\EndReason;
use App\Enums\Teams;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->enum('winner', Teams::getArrayValues())->nullable();
            $table->enum('end_reason', EndReason::getArrayValues())->nullable();
            $table->integer('current_team')->default(Teams::White->value)->nullable();
            $table->foreignId('white_team')->on('users');
            $table->foreignId('black_team')->on('users');
            //$table->json('board');
            $table->string('init_fen');
            //$table->integer('white_king')->default(-1); // MAYBE REMOVE
            //$table->integer('black_king')->default(-1); // MAYBE REMOVE
            //$table->integer('ep_square')->default(-1);
            //$table->integer('half_move_clock')->default(0);
            //$table->integer('move_number'); // REMOVE
            //$table->integer('white_castling');
            //$table->integer('black_castling');
            $table->string('current_fen');
            $table->mediumText('pgn');
            $table->timestamp('ended_at', $precision = 0)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
