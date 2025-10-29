<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_subscription_id',
        'amount',
        'currency',
        'status',                   // e.g. 'completed', 'failed', 'refunded'
        'payment_method',           // e.g. 'stripe'
        'stripe_payment_intent_id', // nullable
        'stripe_response',          // json
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'stripe_response' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscription()
    {
        return $this->belongsTo(UserSubscription::class, 'user_subscription_id');
    }
}
