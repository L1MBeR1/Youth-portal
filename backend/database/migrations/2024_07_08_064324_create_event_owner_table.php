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
        Schema::create('event_owner', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_owner_id')->unsigned();
            $table->integer('project_owner_id')->unsigned();
            $table->integer('event_id')->unsigned();

            $table->foreign('user_owner_id')->references('id')->on('user_login_data')->onDelete('cascade');
            $table->foreign('project_owner_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_owner');
    }
};
