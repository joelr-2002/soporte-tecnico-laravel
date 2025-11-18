import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::index
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:19
 * @route '/api/response-templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/response-templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::index
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:19
 * @route '/api/response-templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::index
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:19
 * @route '/api/response-templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::index
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:19
 * @route '/api/response-templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::index
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:19
 * @route '/api/response-templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::index
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:19
 * @route '/api/response-templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::index
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:19
 * @route '/api/response-templates'
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
* @see \App\Http\Controllers\Api\ResponseTemplateController::store
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:64
 * @route '/api/response-templates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/response-templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::store
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:64
 * @route '/api/response-templates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::store
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:64
 * @route '/api/response-templates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::store
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:64
 * @route '/api/response-templates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::store
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:64
 * @route '/api/response-templates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::show
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:50
 * @route '/api/response-templates/{responseTemplate}'
 */
export const show = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/response-templates/{responseTemplate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::show
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:50
 * @route '/api/response-templates/{responseTemplate}'
 */
show.url = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { responseTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { responseTemplate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    responseTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        responseTemplate: typeof args.responseTemplate === 'object'
                ? args.responseTemplate.id
                : args.responseTemplate,
                }

    return show.definition.url
            .replace('{responseTemplate}', parsedArgs.responseTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::show
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:50
 * @route '/api/response-templates/{responseTemplate}'
 */
show.get = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::show
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:50
 * @route '/api/response-templates/{responseTemplate}'
 */
show.head = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::show
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:50
 * @route '/api/response-templates/{responseTemplate}'
 */
    const showForm = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::show
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:50
 * @route '/api/response-templates/{responseTemplate}'
 */
        showForm.get = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::show
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:50
 * @route '/api/response-templates/{responseTemplate}'
 */
        showForm.head = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\ResponseTemplateController::update
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:83
 * @route '/api/response-templates/{responseTemplate}'
 */
export const update = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/response-templates/{responseTemplate}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::update
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:83
 * @route '/api/response-templates/{responseTemplate}'
 */
update.url = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { responseTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { responseTemplate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    responseTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        responseTemplate: typeof args.responseTemplate === 'object'
                ? args.responseTemplate.id
                : args.responseTemplate,
                }

    return update.definition.url
            .replace('{responseTemplate}', parsedArgs.responseTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::update
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:83
 * @route '/api/response-templates/{responseTemplate}'
 */
update.put = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::update
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:83
 * @route '/api/response-templates/{responseTemplate}'
 */
    const updateForm = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::update
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:83
 * @route '/api/response-templates/{responseTemplate}'
 */
        updateForm.put = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\ResponseTemplateController::destroy
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:96
 * @route '/api/response-templates/{responseTemplate}'
 */
export const destroy = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/response-templates/{responseTemplate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::destroy
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:96
 * @route '/api/response-templates/{responseTemplate}'
 */
destroy.url = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { responseTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { responseTemplate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    responseTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        responseTemplate: typeof args.responseTemplate === 'object'
                ? args.responseTemplate.id
                : args.responseTemplate,
                }

    return destroy.definition.url
            .replace('{responseTemplate}', parsedArgs.responseTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ResponseTemplateController::destroy
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:96
 * @route '/api/response-templates/{responseTemplate}'
 */
destroy.delete = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::destroy
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:96
 * @route '/api/response-templates/{responseTemplate}'
 */
    const destroyForm = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ResponseTemplateController::destroy
 * @see app/Http/Controllers/Api/ResponseTemplateController.php:96
 * @route '/api/response-templates/{responseTemplate}'
 */
        destroyForm.delete = (args: { responseTemplate: number | { id: number } } | [responseTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ResponseTemplateController = { index, store, show, update, destroy }

export default ResponseTemplateController