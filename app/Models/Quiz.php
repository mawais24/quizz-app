<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title','description','category_id','type',
        'time_limit','passing_score','max_attempts',
        'is_active','shuffle_questions','show_correct_answers',
        'points_per_question',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order')->orderBy('id');
    }

    // helpers
    public function scopeActive($q) { return $q->where('is_active', true); }
}
