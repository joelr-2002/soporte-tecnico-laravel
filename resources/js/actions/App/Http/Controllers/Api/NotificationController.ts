import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:17
 * @route '/api/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:17
 * @route '/api/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:17
 * @route '/api/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:17
 * @route '/api/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:17
 * @route '/api/notifications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:17
 * @route '/api/notifications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:17
 * @route '/api/notifications'
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
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
 * @see app/Http/Controllers/Api/NotificationController.php:70
 * @route '/api/notifications/unread-count'
 */
export const unreadCount = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})

unreadCount.definition = {
    methods: ["get","head"],
    url: '/api/notifications/unread-count',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
 * @see app/Http/Controllers/Api/NotificationController.php:70
 * @route '/api/notifications/unread-count'
 */
unreadCount.url = (options?: RouteQueryOptions) => {
    return unreadCount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
 * @see app/Http/Controllers/Api/NotificationController.php:70
 * @route '/api/notifications/unread-count'
 */
unreadCount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
 * @see app/Http/Controllers/Api/NotificationController.php:70
 * @route '/api/notifications/unread-count'
 */
unreadCount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unreadCount.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
 * @see app/Http/Controllers/Api/NotificationController.php:70
 * @route '/api/notifications/unread-count'
 */
    const unreadCountForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: unreadCount.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
 * @see app/Http/Controllers/Api/NotificationController.php:70
 * @route '/api/notifications/unread-count'
 */
        unreadCountForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unreadCount.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::unreadCount
 * @see app/Http/Controllers/Api/NotificationController.php:70
 * @route '/api/notifications/unread-count'
 */
        unreadCountForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unreadCount.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    unreadCount.form = unreadCountForm
/**
* @see \App\Http\Controllers\Api\NotificationController::readAll
 * @see app/Http/Controllers/Api/NotificationController.php:0
 * @route '/api/notifications/read-all'
 */
export const readAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

readAll.definition = {
    methods: ["post"],
    url: '/api/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::readAll
 * @see app/Http/Controllers/Api/NotificationController.php:0
 * @route '/api/notifications/read-all'
 */
readAll.url = (options?: RouteQueryOptions) => {
    return readAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::readAll
 * @see app/Http/Controllers/Api/NotificationController.php:0
 * @route '/api/notifications/read-all'
 */
readAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::readAll
 * @see app/Http/Controllers/Api/NotificationController.php:0
 * @route '/api/notifications/read-all'
 */
    const readAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: readAll.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::readAll
 * @see app/Http/Controllers/Api/NotificationController.php:0
 * @route '/api/notifications/read-all'
 */
        readAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: readAll.url(options),
            method: 'post',
        })
    
    readAll.form = readAllForm
/**
* @see \App\Http\Controllers\Api\NotificationController::read
 * @see app/Http/Controllers/Api/NotificationController.php:0
 * @route '/api/notifications/{notification}/read'
 */
export const read = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

read.definition = {
    methods: ["post"],
    url: '/api/notifications/{notification}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::read
 * @see app/Http/Controllers/Api/NotificationController.php:0
 * @route '/api/notifications/{notification}/read'
 */
read.url = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: args.notification,
                }

    return read.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::read
 * @see app/Http/Controllers/Api/NotificationController.php:0
 * @route '/api/notifications/{notification}/read'
 */
read.post = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::read
 * @see app/Http/Controllers/Api/NotificationController.php:0
 * @route '/api/notifications/{notification}/read'
 */
    const readForm = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: read.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::read
 * @see app/Http/Controllers/Api/NotificationController.php:0
 * @route '/api/notifications/{notification}/read'
 */
        readForm.post = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: read.url(args, options),
            method: 'post',
        })
    
    read.form = readForm
const NotificationController = { index, unreadCount, readAll, read }

export default NotificationController