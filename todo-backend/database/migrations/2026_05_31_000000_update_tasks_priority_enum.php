<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement("ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;");
        DB::statement("ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check CHECK (priority IN ('Low', 'Moderate', 'High', 'Extreme'));");
    }

    public function down()
    {
        DB::statement("ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;");
        DB::statement("ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check CHECK (priority IN ('Low', 'Moderate', 'Extreme'));");
    }
};
