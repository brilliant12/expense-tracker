<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
       Schema::create('login_history', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->unsignedBigInteger('user_id')->nullable();
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

    $table->timestamp('login_time')->useCurrent();
    $table->timestamp('logout_time')->nullable();

    $table->string('ip_address', 45)->nullable();
    $table->text('user_agent')->nullable();

    $table->enum('status', ['SUCCESS','FAILURE']);
    $table->string('failure_reason')->nullable();

    // New fields for geo info
    $table->string('country')->nullable();
    $table->string('region')->nullable();
    $table->string('city')->nullable();

    $table->timestamps();
});

    }



    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('login_history');
    }
};
