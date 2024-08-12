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
        Schema::create('organizations', function (Blueprint $table) {
            $table->increments('id');
            $table->timestampsTz();
            $table->text('name');
            $table->enum('status', ['moderating', 'approved', 'rejected']);
            $table->text('address')->nullable();      
        });

        Schema::create('organizations_has_users', function (Blueprint $table) {
            $table->integer('organization_id')->unsigned();
            $table->integer('user_id')->unsigned();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('user_login_data')->onDelete('cascade');

            $table->primary(['organization_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
        Schema::dropIfExists('organizations_has_users');
    }
};
