<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Priority constants
     */
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_URGENT = 'urgent';

    /**
     * Status constants
     */
    public const STATUS_NEW = 'new';
    public const STATUS_OPEN = 'open';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_ON_HOLD = 'on_hold';
    public const STATUS_RESOLVED = 'resolved';
    public const STATUS_CLOSED = 'closed';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ticket_number',
        'user_id',
        'assigned_to',
        'category_id',
        'sla_id',
        'title',
        'description',
        'priority',
        'status',
        'first_response_at',
        'sla_response_due_at',
        'sla_resolution_due_at',
        'sla_response_breached',
        'sla_resolution_breached',
        'resolved_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'priority' => 'string',
            'status' => 'string',
            'first_response_at' => 'datetime',
            'sla_response_due_at' => 'datetime',
            'sla_resolution_due_at' => 'datetime',
            'sla_response_breached' => 'boolean',
            'sla_resolution_breached' => 'boolean',
            'resolved_at' => 'datetime',
        ];
    }

    /**
     * Bootstrap the model and its traits.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Ticket $ticket) {
            if (empty($ticket->ticket_number)) {
                $ticket->ticket_number = self::generateTicketNumber();
            }
        });
    }

    /**
     * Generate a unique ticket number.
     */
    protected static function generateTicketNumber(): string
    {
        $prefix = 'TKT';
        $timestamp = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -4));

        return "{$prefix}-{$timestamp}-{$random}";
    }

    /**
     * Get the user that created the ticket.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the agent assigned to the ticket.
     */
    public function assignedAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the category of the ticket.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the SLA associated with the ticket.
     */
    public function sla(): BelongsTo
    {
        return $this->belongsTo(Sla::class);
    }

    /**
     * Check if the SLA response time is breached.
     */
    public function isResponseBreached(): bool
    {
        if ($this->first_response_at) {
            return false;
        }

        return $this->sla_response_due_at && now()->isAfter($this->sla_response_due_at);
    }

    /**
     * Check if the SLA resolution time is breached.
     */
    public function isResolutionBreached(): bool
    {
        if ($this->resolved_at) {
            return false;
        }

        return $this->sla_resolution_due_at && now()->isAfter($this->sla_resolution_due_at);
    }

    /**
     * Get the remaining time for response SLA in minutes.
     */
    public function getResponseTimeRemainingAttribute(): ?int
    {
        if (!$this->sla_response_due_at || $this->first_response_at) {
            return null;
        }

        $remaining = now()->diffInMinutes($this->sla_response_due_at, false);
        return (int) $remaining;
    }

    /**
     * Get the remaining time for resolution SLA in minutes.
     */
    public function getResolutionTimeRemainingAttribute(): ?int
    {
        if (!$this->sla_resolution_due_at || $this->resolved_at) {
            return null;
        }

        $remaining = now()->diffInMinutes($this->sla_resolution_due_at, false);
        return (int) $remaining;
    }

    /**
     * Get the SLA status for the ticket.
     */
    public function getSlaStatusAttribute(): string
    {
        if ($this->sla_response_breached || $this->sla_resolution_breached) {
            return 'breached';
        }

        if ($this->isResponseBreached() || $this->isResolutionBreached()) {
            return 'breached';
        }

        $responseRemaining = $this->response_time_remaining;
        $resolutionRemaining = $this->resolution_time_remaining;

        // If no SLA assigned or all completed
        if ($responseRemaining === null && $resolutionRemaining === null) {
            return 'ok';
        }

        // Check if any is at risk (less than 30% time remaining)
        if ($responseRemaining !== null && $responseRemaining > 0) {
            $totalResponseTime = $this->sla?->response_time ?? 0;
            if ($totalResponseTime > 0 && ($responseRemaining / $totalResponseTime) < 0.3) {
                return 'at_risk';
            }
        }

        if ($resolutionRemaining !== null && $resolutionRemaining > 0) {
            $totalResolutionTime = $this->sla?->resolution_time ?? 0;
            if ($totalResolutionTime > 0 && ($resolutionRemaining / $totalResolutionTime) < 0.3) {
                return 'at_risk';
            }
        }

        return 'ok';
    }

    /**
     * Get the comments for the ticket.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the attachments for the ticket.
     */
    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to filter by priority.
     */
    public function scopeByPriority(Builder $query, string $priority): Builder
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory(Builder $query, int $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }
}
