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
        Schema::create('user_login_data', function (Blueprint $table) {
            $table->increments('id');
            $table->text('password');
            $table->text('email')->nullable()->unique();
            $table->timestampTz('email_verified_at')->nullable();
            $table->text('phone')->nullable()->unique();
            $table->timestampTz('phone_verified_at')->nullable();
            // $table->timestamp('phone_verified_at')->nullable();
            $table->rememberToken();
            // $table->timestamps();
            $table->timestampsTz();
            $table->timestampTz('blocked_at')->nullable();
            $table->timestampTz('deleted_at')->nullable();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->unsignedInteger('user_id')->primary();
            // $table->string('email')->primary();
            $table->text('token');
            $table->timestampTz('created_at')->nullable();

            $table->foreign('user_id')
                ->references('id')
                ->on('user_login_data')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            // $table->foreign('email')
            //     ->references('email')
            //     ->on('user_login_data')
            //     ->onUpdate('cascade')
            //     ->onDelete('cascade');
        });

        // Schema::create('password_reset_tokens', function (Blueprint $table) {
        //     $table->string('email')->primary();
        //     $table->string('token');
        //     $table->timestamp('created_at')->nullable();
        // });
        


        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();

            $table->foreign('user_id')
                ->references('id')
                ->on('user_login_data')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::create('user_metadata', function (Blueprint $table) {
            // $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->primary('user_id');

            $table->text('first_name')->nullable();
            $table->text('last_name')->nullable();
            $table->text('patronymic')->nullable();
            $table->text('nickname')->unique()->nullable();
            $table->text('profile_image_uri')->nullable();
            $table->text('city')->nullable();
            $table->enum('gender', ['m', 'f'])->nullable();
            $table->date('birthday')->nullable();

            $table->foreign('user_id')
                ->references('id')
                ->on('user_login_data')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::create('social_accounts_auth', function (Blueprint $table) { //для авторизации через сторонние сервисы (Vk, Google)
            $table->id();
            $table->foreignId('user_id')->constrained('user_login_data')->onDelete('cascade');
            $table->string('provider');
            $table->string('provider_user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_metadata');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('social_accounts_auth');
        Schema::dropIfExists('user_login_data');
    }
};
