<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    public function run()
    {
        $plans = [
            [
                'name' => 'Weekly Premium',
                'slug' => 'weekly-premium',
                'duration' => 'week',
                'price' => 20.00,
                'days' => 7,
                'description' => 'Access all premium quizzes for 1 week',
                'features' => [
                    'Unlimited premium quiz access',
                    'Detailed performance analytics',
                    'Priority support',
                    'No ads'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Monthly Premium',
                'slug' => 'monthly-premium',
                'duration' => 'month',
                'price' => 35.00,
                'days' => 30,
                'description' => 'Access all premium quizzes for 1 month',
                'features' => [
                    'Unlimited premium quiz access',
                    'Detailed performance analytics',
                    'Priority support',
                    'No ads',
                    'Certificate generation'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Yearly Premium',
                'slug' => 'yearly-premium',
                'duration' => 'year',
                'price' => 100.00,
                'days' => 365,
                'description' => 'Access all premium quizzes for 1 year - Best Value!',
                'features' => [
                    'Unlimited premium quiz access',
                    'Detailed performance analytics',
                    'Priority support',
                    'No ads',
                    'Certificate generation',
                    'Early access to new quizzes',
                    'Exclusive content'
                ],
                'is_active' => true
            ]
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::create($plan);
        }
    }
}