import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:104
 * @route '/admin/users'
 */
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:104
 * @route '/admin/users'
 */
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:104
 * @route '/admin/users'
 */
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:104
 * @route '/admin/users'
 */
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:104
 * @route '/admin/users'
 */
    const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: users.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:104
 * @route '/admin/users'
 */
        usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:104
 * @route '/admin/users'
 */
        usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    users.form = usersForm
/**
 * @see routes/web.php:108
 * @route '/admin/categories'
 */
export const categories = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: categories.url(options),
    method: 'get',
})

categories.definition = {
    methods: ["get","head"],
    url: '/admin/categories',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:108
 * @route '/admin/categories'
 */
categories.url = (options?: RouteQueryOptions) => {
    return categories.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:108
 * @route '/admin/categories'
 */
categories.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: categories.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:108
 * @route '/admin/categories'
 */
categories.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: categories.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:108
 * @route '/admin/categories'
 */
    const categoriesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: categories.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:108
 * @route '/admin/categories'
 */
        categoriesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: categories.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:108
 * @route '/admin/categories'
 */
        categoriesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: categories.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    categories.form = categoriesForm
/**
 * @see routes/web.php:112
 * @route '/admin/response-templates'
 */
export const responseTemplates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: responseTemplates.url(options),
    method: 'get',
})

responseTemplates.definition = {
    methods: ["get","head"],
    url: '/admin/response-templates',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:112
 * @route '/admin/response-templates'
 */
responseTemplates.url = (options?: RouteQueryOptions) => {
    return responseTemplates.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:112
 * @route '/admin/response-templates'
 */
responseTemplates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: responseTemplates.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:112
 * @route '/admin/response-templates'
 */
responseTemplates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: responseTemplates.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:112
 * @route '/admin/response-templates'
 */
    const responseTemplatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: responseTemplates.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:112
 * @route '/admin/response-templates'
 */
        responseTemplatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: responseTemplates.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:112
 * @route '/admin/response-templates'
 */
        responseTemplatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: responseTemplates.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    responseTemplates.form = responseTemplatesForm
const admin = {
    users: Object.assign(users, users),
categories: Object.assign(categories, categories),
responseTemplates: Object.assign(responseTemplates, responseTemplates),
}

export default admin