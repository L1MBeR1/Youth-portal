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
        Schema::create('podcasts', function (Blueprint $table) {
            $table->increments('id');
            $table->text('title');
            $table->text('description');
            //TODO: Посмотреть про хранение контента в 
            //      двоичной форме (binary)
            $table->text('content');
            $table->text('cover_uri');
            $table->enum('status', ['moderating', 'published', 'archived']);
            $table->integer('views')->unsigned();
            $table->integer('likes')->unsigned();
            $table->integer('reposts')->unsigned();
            $table->timestamps();
            $table->integer('author_id')->unsigned();

            $table->foreign('author_id')->references('id')->on('user_login_data')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('podcasts');
    }
};
