<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class UserSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_plan_id',
        'status',
        'starts_at',
        'ends_at',
        'stripe_subscription_id',
        'stripe_customer_id',
        'stripe_data',
        'cancelled_at'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'stripe_data' => 'array'
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($subscription) {
            if (empty($subscription->starts_at)) {
                $subscription->starts_at = now();
            }
            
            if (empty($subscription->ends_at) && $subscription->subscriptionPlan) {
                $subscription->ends_at = Carbon::parse($subscription->starts_at)
                    ->addDays($subscription->subscriptionPlan->days);
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

    public function subscriptionPlan()
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    public function transactions()
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where('ends_at', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('ends_at', '<', now())
                    ->orWhere('status', 'expired');
    }

    /**
     * Check if subscription is active
     */
    public function isActive()
    {
        return $this->status === 'active' && $this->ends_at > now();
    }

    /**
     * Check if subscription is expired
     */
    public function isExpired()
    {
        return $this->ends_at < now() || $this->status === 'expired';
    }

    /**
     * Cancel subscription
     */
    public function cancel()
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now()
        ]);
    }

    /**
     * Get days remaining
     */
    public function getDaysRemainingAttribute()
    {
        if (!$this->isActive()) {
            return 0;
        }

        return max(0, Carbon::now()->diffInDays($this->ends_at, false));
    }

    /**
     * Get formatted status
     */
    public function getFormattedStatusAttribute()
    {
        $status = ucfirst($this->status);
        
        if ($this->isExpired() && $this->status !== 'expired') {
            return 'Expired';
        }
        
        return $status;
    }
}