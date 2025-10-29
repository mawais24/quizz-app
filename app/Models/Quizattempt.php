<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'guest_session_id',
        'quiz_id',
        'status',
        'started_at',
        'completed_at',
        'time_spent',
        'total_questions',
        'answered_questions',
        'correct_answers',
        'wrong_answers',
        'score',
        'points_earned',
        'passed',
        'meta_data'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'passed' => 'boolean',
        'score' => 'decimal:2',
        'meta_data' => 'array',
        'time_spent' => 'float',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($attempt) {
            if (empty($attempt->started_at)) {
                $attempt->started_at = now();
            }
            
            if (empty($attempt->status)) {
                $attempt->status = 'in_progress';
            }
        });
    }

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function answers()
    {
        return $this->hasMany(QuizAttemptAnswer::class);
    }

    /**
     * Scopes
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByGuest($query, $sessionId)
    {
        return $query->where('guest_session_id', $sessionId);
    }

    /**
     * Complete the quiz attempt
     */
    public function complete()
    {
        $this->status = 'completed';
        $this->completed_at = now();
        $this->time_spent = $this->started_at->diffInSeconds(now());
        
        // Calculate score
        if ($this->total_questions > 0) {
            $this->score = ($this->correct_answers / $this->total_questions) * 100;
            $this->passed = $this->score >= $this->quiz->passing_score;
        }
        
        $this->save();
    }

    /**
     * Abandon the quiz attempt
     */
    public function abandon()
    {
        $this->update([
            'status' => 'abandoned',
            'completed_at' => now(),
            'time_spent' => $this->started_at->diffInSeconds(now())
        ]);
    }

    /**
     * Get formatted time spent
     */
    public function getFormattedTimeSpentAttribute()
    {
        if (!$this->time_spent) {
            return 'N/A';
        }

        $hours = floor($this->time_spent / 3600);
        $minutes = floor(($this->time_spent % 3600) / 60);
        $seconds = $this->time_spent % 60;

        if ($hours > 0) {
            return sprintf('%dh %dm %ds', $hours, $minutes, $seconds);
        } elseif ($minutes > 0) {
            return sprintf('%dm %ds', $minutes, $seconds);
        } else {
            return sprintf('%ds', $seconds);
        }
    }

    /**
     * Get formatted score
     */
    public function getFormattedScoreAttribute()
    {
        return $this->score ? number_format($this->score, 1) . '%' : 'N/A';
    }

    /**
     * Check if attempt is in progress
     */
    public function isInProgress()
    {
        return $this->status === 'in_progress';
    }

    /**
     * Check if attempt is completed
     */
    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    /**
     * Get progress percentage
     */
    public function getProgressPercentageAttribute()
    {
        if ($this->total_questions == 0) {
            return 0;
        }
        
        return round(($this->answered_questions / $this->total_questions) * 100);
    }
}