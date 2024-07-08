<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->increments('id');
            $table->text('title')->nullable(false);
            $table->text('description');
            $table->text('content')->nullable(false);
            $table->text('cover');
            $table->enum('status', ['moderating', 'published', 'archived'])->nullable(false);
            $table->integer('views')->unsigned();
            $table->integer('likes')->unsigned();
            $table->integer('reposts')->unsigned();
            $table->timestamps();
            $table->integer('author_id')->unsigned()->nullable(false);

            $table->foreign('author_id')->references('id')->on('user_login_data')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
