<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $table = 'subscription_plans';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'features',        // JSON
        'price',
        'currency',
        'interval',        // e.g., day|week|month|year|lifetime
        'duration',        // optional: if you prefer storing human label too
        'days',
        'stripe_price_id',
        'is_active',
    ];

    protected $casts = [
        'features'   => 'array',    // <-- key part for seeding arrays
        'is_active'  => 'boolean',
        'price'      => 'decimal:2',
        'days'       => 'integer',
    ];

    /**
     * Auto-generate slug from name if not provided.
     */
    protected static function booted()
    {
        static::saving(function ($model) {
            if (empty($model->slug) && !empty($model->name)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    /**
     * Relationships
     */
    public function userSubscriptions()
    {
        return $this->hasMany(UserSubscription::class, 'subscription_plan_id');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Accessors / Helpers
     */
    public function getFormattedPriceAttribute(): string
    {
        return sprintf('%s %.2f', strtoupper($this->currency ?? 'USD'), $this->price ?? 0);
    }

    public function getDurationTextAttribute(): string
    {
        // Prefer explicit 'duration' label if present (e.g. "week", "month")
        if (!empty($this->duration)) {
            if ($this->duration === 'lifetime') {
                return 'Lifetime Access';
            }
            return ($this->days ? "{$this->days} days" : ucfirst($this->duration)) . " ({$this->duration})";
        }

        // Fallback to interval + days combo
        if (($this->interval ?? null) === 'lifetime') {
            return 'Lifetime Access';
        }

        return ($this->days ? "{$this->days} days" : '—') . (isset($this->interval) ? " ({$this->interval})" : '');
    }
}
