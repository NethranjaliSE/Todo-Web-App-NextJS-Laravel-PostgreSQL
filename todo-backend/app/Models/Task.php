<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // This is the list of columns Laravel is allowed to mass-assign.
    // We added 'user_id' here so the controller can save it.
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'priority',
        'status',
        'due_date',
        'category',
        'image_path',
    ];

    // This tells Laravel that a Task belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
