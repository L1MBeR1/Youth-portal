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
        // Schema::create('users', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('email')->unique();
        //     $table->timestamp('email_verified_at')->nullable();
        //     $table->string('password');
        //     $table->rememberToken();
        //     $table->timestamps();
        // });

        Schema::create('user_login_data', function (Blueprint $table) {
            $table->id();
            $table->text('password')->nullable();
            $table->text('email')->nullable();
            $table->text('email_verified_at')->nullable();
            $table->text('phone')->nullable();
            $table->text('phone_verified_at')->nullable();
            $table->text('remember_token')->nullable();
            $table->timestamps();
            $table->timestamp('blocked_at')->nullable();
        });

        // Schema::create('password_reset_tokens', function (Blueprint $table) {
        //     $table->string('user_id')->primary();
        //     $table->string('token');
        //     $table->timestamp('created_at')->nullable();
        // });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->text('token');
            $table->timestamp('created_at')->nullable();

            $table->primary('user_id');
            $table->foreign('user_id')
                ->references('id')
                ->on('user_login_data')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        // Schema::create('sessions', function (Blueprint $table) {
        //     $table->string('id')->primary();
        //     $table->foreignId('user_id')->nullable()->index();
        //     $table->string('ip_address', 45)->nullable();
        //     $table->text('user_agent')->nullable();
        //     $table->longText('payload');
        //     $table->integer('last_activity')->index();
        // });

        Schema::create('sessions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->text('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->text('payload')->nullable();
            $table->timestamp('last_activity')->nullable();

            $table->foreign('user_id')
                ->references('id')
                ->on('user_login_data')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::create('user_metadata', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->text('first_name')->nullable();
            $table->text('last_name')->nullable();
            $table->text('patronymic')->nullable();
            $table->text('profile_image')->nullable();
            $table->text('nickname')->nullable();

            $table->foreign('user_id')
                ->references('id')
                ->on('user_login_data')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
