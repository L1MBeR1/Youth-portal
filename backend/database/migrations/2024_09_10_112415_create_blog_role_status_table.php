<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlogRoleStatusTable extends Migration
{
    public function up()
    {
        Schema::create('blog_role_status', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('status', ['review', 'approved', 'withdrawn']);
            $table->text('content');
            $table->timestampsTz();

            $table->unsignedInteger('moder_id')->nullable();
            $table->foreign('moder_id')->references('id')->on('user_login_data')->onDelete('cascade');
            $table->unsignedInteger('author_id');
            $table->foreign('author_id')->references('id')->on('user_login_data')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('blog_role_status');
    }
}

