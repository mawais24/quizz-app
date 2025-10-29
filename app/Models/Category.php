<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'level',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Auto-generate slug if not provided.
     */
    protected static function booted()
    {
        static::saving(function (self $model) {
            if (empty($model->slug) && !empty($model->name)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    /**
     * RELATIONSHIPS
     */

    // Parent category (nullable)
    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    // Children categories
    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    // Quizzes under this category
    public function quizzes()
    {
        return $this->hasMany(Quiz::class, 'category_id');
    }

    /**
     * SCOPES
     */

    // Only active categories
    public function scopeActive($q)
    {
        return $q->where('is_active', true);
    }

    // Optional: only root (no parent) categories
    public function scopeRoot($q)
    {
        return $q->whereNull('parent_id');
    }

    /**
     * ACCESSORS / HELPERS
     */

    // Useful breadcrumb-ish path, e.g. "Parent > Child"
    public function getFullPathAttribute()
    {
        $path = [$this->name];
        $parent = $this->parent;

        while ($parent) {
            array_unshift($path, $parent->name);
            $parent = $parent->parent;
        }

        return implode(' > ', $path);
    }
}
