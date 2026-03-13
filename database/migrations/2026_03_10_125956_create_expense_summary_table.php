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
        Schema::create('expense_summary', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('user_id');
            $table->date('month');
            $table->decimal('total_amount', 10, 2);
            
            $table->unique(['group_id', 'user_id', 'month']);

          
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('expense_summary');
    }
};
