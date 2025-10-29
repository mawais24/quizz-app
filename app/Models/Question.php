<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id','question_text',
        'option_a','option_b','option_c','option_d',
        'correct_option','is_active','order', 'image_path'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function hasImage()
    {
        return !empty($this->image_path);
    }
}
