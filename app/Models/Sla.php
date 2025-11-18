<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sla extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'priority',
        'response_time',
        'resolution_time',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'response_time' => 'integer',
            'resolution_time' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the tickets associated with this SLA.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Scope a query to only include active SLAs.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by priority.
     */
    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Get the response time in hours.
     */
    public function getResponseTimeHoursAttribute(): float
    {
        return $this->response_time / 60;
    }

    /**
     * Get the resolution time in hours.
     */
    public function getResolutionTimeHoursAttribute(): float
    {
        return $this->resolution_time / 60;
    }

    /**
     * Format the response time for display.
     */
    public function getFormattedResponseTimeAttribute(): string
    {
        return $this->formatMinutes($this->response_time);
    }

    /**
     * Format the resolution time for display.
     */
    public function getFormattedResolutionTimeAttribute(): string
    {
        return $this->formatMinutes($this->resolution_time);
    }

    /**
     * Format minutes to a human-readable string.
     */
    protected function formatMinutes(int $minutes): string
    {
        if ($minutes < 60) {
            return "{$minutes} min";
        }

        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;

        if ($remainingMinutes === 0) {
            return "{$hours}h";
        }

        return "{$hours}h {$remainingMinutes}min";
    }
}
