import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AuthController::register
 * @see app/Http/Controllers/Api/AuthController.php:28
 * @route '/api/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/api/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::register
 * @see app/Http/Controllers/Api/AuthController.php:28
 * @route '/api/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::register
 * @see app/Http/Controllers/Api/AuthController.php:28
 * @route '/api/register'
 */
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::register
 * @see app/Http/Controllers/Api/AuthController.php:28
 * @route '/api/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: register.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::register
 * @see app/Http/Controllers/Api/AuthController.php:28
 * @route '/api/register'
 */
        registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url(options),
            method: 'post',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\Api\AuthController::login
 * @see app/Http/Controllers/Api/AuthController.php:50
 * @route '/api/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/api/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::login
 * @see app/Http/Controllers/Api/AuthController.php:50
 * @route '/api/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::login
 * @see app/Http/Controllers/Api/AuthController.php:50
 * @route '/api/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::login
 * @see app/Http/Controllers/Api/AuthController.php:50
 * @route '/api/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: login.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::login
 * @see app/Http/Controllers/Api/AuthController.php:50
 * @route '/api/login'
 */
        loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url(options),
            method: 'post',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\Api\AuthController::forgotPassword
 * @see app/Http/Controllers/Api/AuthController.php:133
 * @route '/api/forgot-password'
 */
export const forgotPassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forgotPassword.url(options),
    method: 'post',
})

forgotPassword.definition = {
    methods: ["post"],
    url: '/api/forgot-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::forgotPassword
 * @see app/Http/Controllers/Api/AuthController.php:133
 * @route '/api/forgot-password'
 */
forgotPassword.url = (options?: RouteQueryOptions) => {
    return forgotPassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::forgotPassword
 * @see app/Http/Controllers/Api/AuthController.php:133
 * @route '/api/forgot-password'
 */
forgotPassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forgotPassword.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::forgotPassword
 * @see app/Http/Controllers/Api/AuthController.php:133
 * @route '/api/forgot-password'
 */
    const forgotPasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: forgotPassword.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::forgotPassword
 * @see app/Http/Controllers/Api/AuthController.php:133
 * @route '/api/forgot-password'
 */
        forgotPasswordForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: forgotPassword.url(options),
            method: 'post',
        })
    
    forgotPassword.form = forgotPasswordForm
/**
* @see \App\Http\Controllers\Api\AuthController::resetPassword
 * @see app/Http/Controllers/Api/AuthController.php:153
 * @route '/api/reset-password'
 */
export const resetPassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(options),
    method: 'post',
})

resetPassword.definition = {
    methods: ["post"],
    url: '/api/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::resetPassword
 * @see app/Http/Controllers/Api/AuthController.php:153
 * @route '/api/reset-password'
 */
resetPassword.url = (options?: RouteQueryOptions) => {
    return resetPassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::resetPassword
 * @see app/Http/Controllers/Api/AuthController.php:153
 * @route '/api/reset-password'
 */
resetPassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::resetPassword
 * @see app/Http/Controllers/Api/AuthController.php:153
 * @route '/api/reset-password'
 */
    const resetPasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resetPassword.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::resetPassword
 * @see app/Http/Controllers/Api/AuthController.php:153
 * @route '/api/reset-password'
 */
        resetPasswordForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resetPassword.url(options),
            method: 'post',
        })
    
    resetPassword.form = resetPasswordForm
/**
* @see \App\Http\Controllers\Api\AuthController::logout
 * @see app/Http/Controllers/Api/AuthController.php:71
 * @route '/api/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/api/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::logout
 * @see app/Http/Controllers/Api/AuthController.php:71
 * @route '/api/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::logout
 * @see app/Http/Controllers/Api/AuthController.php:71
 * @route '/api/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::logout
 * @see app/Http/Controllers/Api/AuthController.php:71
 * @route '/api/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::logout
 * @see app/Http/Controllers/Api/AuthController.php:71
 * @route '/api/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:83
 * @route '/api/user'
 */
export const user = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})

user.definition = {
    methods: ["get","head"],
    url: '/api/user',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:83
 * @route '/api/user'
 */
user.url = (options?: RouteQueryOptions) => {
    return user.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:83
 * @route '/api/user'
 */
user.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:83
 * @route '/api/user'
 */
user.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: user.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:83
 * @route '/api/user'
 */
    const userForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: user.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:83
 * @route '/api/user'
 */
        userForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: user.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:83
 * @route '/api/user'
 */
        userForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: user.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    user.form = userForm
/**
* @see \App\Http\Controllers\Api\AuthController::updateProfile
 * @see app/Http/Controllers/Api/AuthController.php:93
 * @route '/api/user/profile'
 */
export const updateProfile = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProfile.url(options),
    method: 'put',
})

updateProfile.definition = {
    methods: ["put"],
    url: '/api/user/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\AuthController::updateProfile
 * @see app/Http/Controllers/Api/AuthController.php:93
 * @route '/api/user/profile'
 */
updateProfile.url = (options?: RouteQueryOptions) => {
    return updateProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::updateProfile
 * @see app/Http/Controllers/Api/AuthController.php:93
 * @route '/api/user/profile'
 */
updateProfile.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProfile.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::updateProfile
 * @see app/Http/Controllers/Api/AuthController.php:93
 * @route '/api/user/profile'
 */
    const updateProfileForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateProfile.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::updateProfile
 * @see app/Http/Controllers/Api/AuthController.php:93
 * @route '/api/user/profile'
 */
        updateProfileForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateProfile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateProfile.form = updateProfileForm
/**
* @see \App\Http\Controllers\Api\AuthController::updatePassword
 * @see app/Http/Controllers/Api/AuthController.php:119
 * @route '/api/user/password'
 */
export const updatePassword = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePassword.url(options),
    method: 'put',
})

updatePassword.definition = {
    methods: ["put"],
    url: '/api/user/password',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\AuthController::updatePassword
 * @see app/Http/Controllers/Api/AuthController.php:119
 * @route '/api/user/password'
 */
updatePassword.url = (options?: RouteQueryOptions) => {
    return updatePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::updatePassword
 * @see app/Http/Controllers/Api/AuthController.php:119
 * @route '/api/user/password'
 */
updatePassword.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePassword.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::updatePassword
 * @see app/Http/Controllers/Api/AuthController.php:119
 * @route '/api/user/password'
 */
    const updatePasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePassword.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::updatePassword
 * @see app/Http/Controllers/Api/AuthController.php:119
 * @route '/api/user/password'
 */
        updatePasswordForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePassword.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePassword.form = updatePasswordForm
const AuthController = { register, login, forgotPassword, resetPassword, logout, user, updateProfile, updatePassword }

export default AuthController