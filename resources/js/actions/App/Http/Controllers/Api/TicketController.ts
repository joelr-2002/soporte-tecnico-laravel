import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:23
 * @route '/api/tickets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/tickets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:23
 * @route '/api/tickets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:23
 * @route '/api/tickets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:23
 * @route '/api/tickets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:23
 * @route '/api/tickets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:23
 * @route '/api/tickets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:23
 * @route '/api/tickets'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\TicketController::store
 * @see app/Http/Controllers/Api/TicketController.php:111
 * @route '/api/tickets'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/tickets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::store
 * @see app/Http/Controllers/Api/TicketController.php:111
 * @route '/api/tickets'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::store
 * @see app/Http/Controllers/Api/TicketController.php:111
 * @route '/api/tickets'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::store
 * @see app/Http/Controllers/Api/TicketController.php:111
 * @route '/api/tickets'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::store
 * @see app/Http/Controllers/Api/TicketController.php:111
 * @route '/api/tickets'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\TicketController::statistics
 * @see app/Http/Controllers/Api/TicketController.php:257
 * @route '/api/tickets/statistics'
 */
export const statistics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

statistics.definition = {
    methods: ["get","head"],
    url: '/api/tickets/statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::statistics
 * @see app/Http/Controllers/Api/TicketController.php:257
 * @route '/api/tickets/statistics'
 */
statistics.url = (options?: RouteQueryOptions) => {
    return statistics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::statistics
 * @see app/Http/Controllers/Api/TicketController.php:257
 * @route '/api/tickets/statistics'
 */
statistics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::statistics
 * @see app/Http/Controllers/Api/TicketController.php:257
 * @route '/api/tickets/statistics'
 */
statistics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::statistics
 * @see app/Http/Controllers/Api/TicketController.php:257
 * @route '/api/tickets/statistics'
 */
    const statisticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: statistics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::statistics
 * @see app/Http/Controllers/Api/TicketController.php:257
 * @route '/api/tickets/statistics'
 */
        statisticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: statistics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::statistics
 * @see app/Http/Controllers/Api/TicketController.php:257
 * @route '/api/tickets/statistics'
 */
        statisticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: statistics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    statistics.form = statisticsForm
/**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:87
 * @route '/api/tickets/{ticket}'
 */
export const show = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/tickets/{ticket}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:87
 * @route '/api/tickets/{ticket}'
 */
show.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return show.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:87
 * @route '/api/tickets/{ticket}'
 */
show.get = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:87
 * @route '/api/tickets/{ticket}'
 */
show.head = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:87
 * @route '/api/tickets/{ticket}'
 */
    const showForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:87
 * @route '/api/tickets/{ticket}'
 */
        showForm.get = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:87
 * @route '/api/tickets/{ticket}'
 */
        showForm.head = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\TicketController::update
 * @see app/Http/Controllers/Api/TicketController.php:151
 * @route '/api/tickets/{ticket}'
 */
export const update = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/tickets/{ticket}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\TicketController::update
 * @see app/Http/Controllers/Api/TicketController.php:151
 * @route '/api/tickets/{ticket}'
 */
update.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return update.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::update
 * @see app/Http/Controllers/Api/TicketController.php:151
 * @route '/api/tickets/{ticket}'
 */
update.put = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::update
 * @see app/Http/Controllers/Api/TicketController.php:151
 * @route '/api/tickets/{ticket}'
 */
    const updateForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::update
 * @see app/Http/Controllers/Api/TicketController.php:151
 * @route '/api/tickets/{ticket}'
 */
        updateForm.put = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\TicketController::destroy
 * @see app/Http/Controllers/Api/TicketController.php:176
 * @route '/api/tickets/{ticket}'
 */
export const destroy = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/tickets/{ticket}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\TicketController::destroy
 * @see app/Http/Controllers/Api/TicketController.php:176
 * @route '/api/tickets/{ticket}'
 */
destroy.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return destroy.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::destroy
 * @see app/Http/Controllers/Api/TicketController.php:176
 * @route '/api/tickets/{ticket}'
 */
destroy.delete = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::destroy
 * @see app/Http/Controllers/Api/TicketController.php:176
 * @route '/api/tickets/{ticket}'
 */
    const destroyForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::destroy
 * @see app/Http/Controllers/Api/TicketController.php:176
 * @route '/api/tickets/{ticket}'
 */
        destroyForm.delete = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Api\TicketController::assign
 * @see app/Http/Controllers/Api/TicketController.php:190
 * @route '/api/tickets/{ticket}/assign'
 */
export const assign = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assign.url(args, options),
    method: 'post',
})

assign.definition = {
    methods: ["post"],
    url: '/api/tickets/{ticket}/assign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::assign
 * @see app/Http/Controllers/Api/TicketController.php:190
 * @route '/api/tickets/{ticket}/assign'
 */
assign.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return assign.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::assign
 * @see app/Http/Controllers/Api/TicketController.php:190
 * @route '/api/tickets/{ticket}/assign'
 */
assign.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assign.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::assign
 * @see app/Http/Controllers/Api/TicketController.php:190
 * @route '/api/tickets/{ticket}/assign'
 */
    const assignForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assign.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::assign
 * @see app/Http/Controllers/Api/TicketController.php:190
 * @route '/api/tickets/{ticket}/assign'
 */
        assignForm.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assign.url(args, options),
            method: 'post',
        })
    
    assign.form = assignForm
/**
* @see \App\Http\Controllers\Api\TicketController::updateStatus
 * @see app/Http/Controllers/Api/TicketController.php:0
 * @route '/api/tickets/{ticket}/status'
 */
export const updateStatus = (args: { ticket: string | number } | [ticket: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/api/tickets/{ticket}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::updateStatus
 * @see app/Http/Controllers/Api/TicketController.php:0
 * @route '/api/tickets/{ticket}/status'
 */
updateStatus.url = (args: { ticket: string | number } | [ticket: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: args.ticket,
                }

    return updateStatus.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::updateStatus
 * @see app/Http/Controllers/Api/TicketController.php:0
 * @route '/api/tickets/{ticket}/status'
 */
updateStatus.post = (args: { ticket: string | number } | [ticket: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::updateStatus
 * @see app/Http/Controllers/Api/TicketController.php:0
 * @route '/api/tickets/{ticket}/status'
 */
    const updateStatusForm = (args: { ticket: string | number } | [ticket: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::updateStatus
 * @see app/Http/Controllers/Api/TicketController.php:0
 * @route '/api/tickets/{ticket}/status'
 */
        updateStatusForm.post = (args: { ticket: string | number } | [ticket: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, options),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
const TicketController = { index, store, statistics, show, update, destroy, assign, updateStatus }

export default TicketController