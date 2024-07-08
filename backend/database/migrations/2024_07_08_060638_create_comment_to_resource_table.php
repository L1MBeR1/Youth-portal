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
        Schema::create('comment_to_resource', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('podkast_id')->unsigned();
            $table->integer('blog_id')->unsigned();
            $table->integer('news_id')->unsigned();
            $table->bigInteger('comment_id')->unsigned()->nullable(false);

            $table->foreign('podkast_id')->references('id')->on('podkast')->onDelete('cascade');
            $table->foreign('blog_id')->references('id')->on('blog')->onDelete('cascade');
            $table->foreign('news_id')->references('id')->on('news')->onDelete('cascade');
            $table->foreign('comment_id')->references('id')->on('comments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comment_to_resource');
    }
};
