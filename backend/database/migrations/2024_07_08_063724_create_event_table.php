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
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id');
            $table->text('name');
            $table->text('description');
            $table->text('address')->default(0);
            $table->float('longitude')->default(0);
            $table->float('latitude')->default(0);
            $table->integer('views')->unsigned()->default(0);;
            $table->timestampTz('start_time');
            $table->timestampTz('end_time');
            $table->timestampsTz();

            $table->integer('author_id')->unsigned();
            $table->foreign('author_id')->references('id')->on('user_login_data')->onDelete('cascade');
            
            $table->integer('project_id')->unsigned()->nullable();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
