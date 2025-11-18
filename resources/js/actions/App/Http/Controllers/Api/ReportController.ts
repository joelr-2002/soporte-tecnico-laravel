import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPeriod
 * @see app/Http/Controllers/Api/ReportController.php:31
 * @route '/api/reports/tickets-by-period'
 */
export const ticketsByPeriod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ticketsByPeriod.url(options),
    method: 'get',
})

ticketsByPeriod.definition = {
    methods: ["get","head"],
    url: '/api/reports/tickets-by-period',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPeriod
 * @see app/Http/Controllers/Api/ReportController.php:31
 * @route '/api/reports/tickets-by-period'
 */
ticketsByPeriod.url = (options?: RouteQueryOptions) => {
    return ticketsByPeriod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPeriod
 * @see app/Http/Controllers/Api/ReportController.php:31
 * @route '/api/reports/tickets-by-period'
 */
ticketsByPeriod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ticketsByPeriod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPeriod
 * @see app/Http/Controllers/Api/ReportController.php:31
 * @route '/api/reports/tickets-by-period'
 */
ticketsByPeriod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ticketsByPeriod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPeriod
 * @see app/Http/Controllers/Api/ReportController.php:31
 * @route '/api/reports/tickets-by-period'
 */
    const ticketsByPeriodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ticketsByPeriod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPeriod
 * @see app/Http/Controllers/Api/ReportController.php:31
 * @route '/api/reports/tickets-by-period'
 */
        ticketsByPeriodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ticketsByPeriod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPeriod
 * @see app/Http/Controllers/Api/ReportController.php:31
 * @route '/api/reports/tickets-by-period'
 */
        ticketsByPeriodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ticketsByPeriod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ticketsByPeriod.form = ticketsByPeriodForm
/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByStatus
 * @see app/Http/Controllers/Api/ReportController.php:64
 * @route '/api/reports/tickets-by-status'
 */
export const ticketsByStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ticketsByStatus.url(options),
    method: 'get',
})

ticketsByStatus.definition = {
    methods: ["get","head"],
    url: '/api/reports/tickets-by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByStatus
 * @see app/Http/Controllers/Api/ReportController.php:64
 * @route '/api/reports/tickets-by-status'
 */
ticketsByStatus.url = (options?: RouteQueryOptions) => {
    return ticketsByStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByStatus
 * @see app/Http/Controllers/Api/ReportController.php:64
 * @route '/api/reports/tickets-by-status'
 */
ticketsByStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ticketsByStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByStatus
 * @see app/Http/Controllers/Api/ReportController.php:64
 * @route '/api/reports/tickets-by-status'
 */
ticketsByStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ticketsByStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByStatus
 * @see app/Http/Controllers/Api/ReportController.php:64
 * @route '/api/reports/tickets-by-status'
 */
    const ticketsByStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ticketsByStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByStatus
 * @see app/Http/Controllers/Api/ReportController.php:64
 * @route '/api/reports/tickets-by-status'
 */
        ticketsByStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ticketsByStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByStatus
 * @see app/Http/Controllers/Api/ReportController.php:64
 * @route '/api/reports/tickets-by-status'
 */
        ticketsByStatusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ticketsByStatus.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ticketsByStatus.form = ticketsByStatusForm
/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPriority
 * @see app/Http/Controllers/Api/ReportController.php:88
 * @route '/api/reports/tickets-by-priority'
 */
export const ticketsByPriority = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ticketsByPriority.url(options),
    method: 'get',
})

ticketsByPriority.definition = {
    methods: ["get","head"],
    url: '/api/reports/tickets-by-priority',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPriority
 * @see app/Http/Controllers/Api/ReportController.php:88
 * @route '/api/reports/tickets-by-priority'
 */
ticketsByPriority.url = (options?: RouteQueryOptions) => {
    return ticketsByPriority.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPriority
 * @see app/Http/Controllers/Api/ReportController.php:88
 * @route '/api/reports/tickets-by-priority'
 */
ticketsByPriority.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ticketsByPriority.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPriority
 * @see app/Http/Controllers/Api/ReportController.php:88
 * @route '/api/reports/tickets-by-priority'
 */
ticketsByPriority.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ticketsByPriority.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPriority
 * @see app/Http/Controllers/Api/ReportController.php:88
 * @route '/api/reports/tickets-by-priority'
 */
    const ticketsByPriorityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ticketsByPriority.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPriority
 * @see app/Http/Controllers/Api/ReportController.php:88
 * @route '/api/reports/tickets-by-priority'
 */
        ticketsByPriorityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ticketsByPriority.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByPriority
 * @see app/Http/Controllers/Api/ReportController.php:88
 * @route '/api/reports/tickets-by-priority'
 */
        ticketsByPriorityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ticketsByPriority.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ticketsByPriority.form = ticketsByPriorityForm
/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByCategory
 * @see app/Http/Controllers/Api/ReportController.php:112
 * @route '/api/reports/tickets-by-category'
 */
export const ticketsByCategory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ticketsByCategory.url(options),
    method: 'get',
})

ticketsByCategory.definition = {
    methods: ["get","head"],
    url: '/api/reports/tickets-by-category',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByCategory
 * @see app/Http/Controllers/Api/ReportController.php:112
 * @route '/api/reports/tickets-by-category'
 */
ticketsByCategory.url = (options?: RouteQueryOptions) => {
    return ticketsByCategory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByCategory
 * @see app/Http/Controllers/Api/ReportController.php:112
 * @route '/api/reports/tickets-by-category'
 */
ticketsByCategory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ticketsByCategory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportController::ticketsByCategory
 * @see app/Http/Controllers/Api/ReportController.php:112
 * @route '/api/reports/tickets-by-category'
 */
ticketsByCategory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ticketsByCategory.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByCategory
 * @see app/Http/Controllers/Api/ReportController.php:112
 * @route '/api/reports/tickets-by-category'
 */
    const ticketsByCategoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ticketsByCategory.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByCategory
 * @see app/Http/Controllers/Api/ReportController.php:112
 * @route '/api/reports/tickets-by-category'
 */
        ticketsByCategoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ticketsByCategory.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportController::ticketsByCategory
 * @see app/Http/Controllers/Api/ReportController.php:112
 * @route '/api/reports/tickets-by-category'
 */
        ticketsByCategoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ticketsByCategory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ticketsByCategory.form = ticketsByCategoryForm
/**
* @see \App\Http\Controllers\Api\ReportController::agentPerformance
 * @see app/Http/Controllers/Api/ReportController.php:137
 * @route '/api/reports/agent-performance'
 */
export const agentPerformance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agentPerformance.url(options),
    method: 'get',
})

agentPerformance.definition = {
    methods: ["get","head"],
    url: '/api/reports/agent-performance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportController::agentPerformance
 * @see app/Http/Controllers/Api/ReportController.php:137
 * @route '/api/reports/agent-performance'
 */
agentPerformance.url = (options?: RouteQueryOptions) => {
    return agentPerformance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportController::agentPerformance
 * @see app/Http/Controllers/Api/ReportController.php:137
 * @route '/api/reports/agent-performance'
 */
agentPerformance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agentPerformance.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportController::agentPerformance
 * @see app/Http/Controllers/Api/ReportController.php:137
 * @route '/api/reports/agent-performance'
 */
agentPerformance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: agentPerformance.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportController::agentPerformance
 * @see app/Http/Controllers/Api/ReportController.php:137
 * @route '/api/reports/agent-performance'
 */
    const agentPerformanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: agentPerformance.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportController::agentPerformance
 * @see app/Http/Controllers/Api/ReportController.php:137
 * @route '/api/reports/agent-performance'
 */
        agentPerformanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agentPerformance.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportController::agentPerformance
 * @see app/Http/Controllers/Api/ReportController.php:137
 * @route '/api/reports/agent-performance'
 */
        agentPerformanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agentPerformance.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    agentPerformance.form = agentPerformanceForm
/**
* @see \App\Http\Controllers\Api\ReportController::resolutionTime
 * @see app/Http/Controllers/Api/ReportController.php:0
 * @route '/api/reports/resolution-time'
 */
export const resolutionTime = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resolutionTime.url(options),
    method: 'get',
})

resolutionTime.definition = {
    methods: ["get","head"],
    url: '/api/reports/resolution-time',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportController::resolutionTime
 * @see app/Http/Controllers/Api/ReportController.php:0
 * @route '/api/reports/resolution-time'
 */
resolutionTime.url = (options?: RouteQueryOptions) => {
    return resolutionTime.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportController::resolutionTime
 * @see app/Http/Controllers/Api/ReportController.php:0
 * @route '/api/reports/resolution-time'
 */
resolutionTime.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resolutionTime.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportController::resolutionTime
 * @see app/Http/Controllers/Api/ReportController.php:0
 * @route '/api/reports/resolution-time'
 */
resolutionTime.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resolutionTime.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportController::resolutionTime
 * @see app/Http/Controllers/Api/ReportController.php:0
 * @route '/api/reports/resolution-time'
 */
    const resolutionTimeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resolutionTime.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportController::resolutionTime
 * @see app/Http/Controllers/Api/ReportController.php:0
 * @route '/api/reports/resolution-time'
 */
        resolutionTimeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resolutionTime.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportController::resolutionTime
 * @see app/Http/Controllers/Api/ReportController.php:0
 * @route '/api/reports/resolution-time'
 */
        resolutionTimeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resolutionTime.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resolutionTime.form = resolutionTimeForm
/**
* @see \App\Http\Controllers\Api\ReportController::exportCsv
 * @see app/Http/Controllers/Api/ReportController.php:217
 * @route '/api/reports/export-csv'
 */
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/api/reports/export-csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportController::exportCsv
 * @see app/Http/Controllers/Api/ReportController.php:217
 * @route '/api/reports/export-csv'
 */
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportController::exportCsv
 * @see app/Http/Controllers/Api/ReportController.php:217
 * @route '/api/reports/export-csv'
 */
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportController::exportCsv
 * @see app/Http/Controllers/Api/ReportController.php:217
 * @route '/api/reports/export-csv'
 */
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportController::exportCsv
 * @see app/Http/Controllers/Api/ReportController.php:217
 * @route '/api/reports/export-csv'
 */
    const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportController::exportCsv
 * @see app/Http/Controllers/Api/ReportController.php:217
 * @route '/api/reports/export-csv'
 */
        exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportController::exportCsv
 * @see app/Http/Controllers/Api/ReportController.php:217
 * @route '/api/reports/export-csv'
 */
        exportCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportCsv.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportCsv.form = exportCsvForm
const ReportController = { ticketsByPeriod, ticketsByStatus, ticketsByPriority, ticketsByCategory, agentPerformance, resolutionTime, exportCsv }

export default ReportController