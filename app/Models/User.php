<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
    ];

    /**
     * Get user's subscriptions
     */
    public function subscriptions()
    {
        return $this->hasMany(UserSubscription::class);
    }

    /**
     * Get user's active subscription
     */
    public function activeSubscription()
    {
        return $this->hasOne(UserSubscription::class)->active();
    }

    /**
     * Check if user has active subscription
     */
    public function hasActiveSubscription()
    {
        return $this->activeSubscription()->exists();
    }

    /**
     * Get user's quiz attempts
     */
    public function quizAttempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Get user's payment transactions
     */
    public function paymentTransactions()
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    /**
     * Check if user can access premium content
     */
    public function canAccessPremium()
    {
        return $this->is_admin || $this->hasActiveSubscription();
    }

    /**
     * Get user's current subscription plan
     */
    public function currentSubscriptionPlan()
    {
        $subscription = $this->activeSubscription()->with('subscriptionPlan')->first();
        return $subscription ? $subscription->subscriptionPlan : null;
    }

    /**
     * Get quiz attempts for a specific quiz
     */
    public function getQuizAttempts($quizId)
    {
        return $this->quizAttempts()
            ->where('quiz_id', $quizId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get best score for a quiz
     */
    public function getBestScoreForQuiz($quizId)
    {
        return $this->quizAttempts()
            ->where('quiz_id', $quizId)
            ->completed()
            ->max('score');
    }

    /**
     * Check if user has attempted a quiz
     */
    public function hasAttemptedQuiz($quizId)
    {
        return $this->quizAttempts()
            ->where('quiz_id', $quizId)
            ->exists();
    }

    /**
     * Get total quizzes completed
     */
    public function getTotalQuizzesCompletedAttribute()
    {
        return $this->quizAttempts()
            ->completed()
            ->distinct('quiz_id')
            ->count('quiz_id');
    }

    /**
     * Get average quiz score
     */
    public function getAverageQuizScoreAttribute()
    {
        return $this->quizAttempts()
            ->completed()
            ->avg('score');
    }

    /**
     * Check if user is admin
     */
    public function isAdmin()
    {
        return $this->is_admin === true;
    }
}