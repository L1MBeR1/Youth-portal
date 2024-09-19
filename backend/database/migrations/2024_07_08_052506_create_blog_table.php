<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->increments('id');
            $table->text('title');
            $table->jsonb('description');
            $table->text('content');
            $table->text('cover_uri');
            $table->enum('status', ['moderating', 'published', 'archived', 'pending', 'unsaved']);
            $table->integer('views')->unsigned()->default(0);
            $table->integer('likes')->unsigned()->default(0);
            $table->integer('reposts')->unsigned()->default(0);
            $table->timestampsTz();
            $table->integer('author_id')->unsigned();
            $table->integer('draft_for')->unsigned()->nullable();

            $table->foreign('author_id')->references('id')->on('user_login_data')->onDelete('cascade');
        });

        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }

};
