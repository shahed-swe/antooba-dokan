import Toast from '../../../Toaster/Index'

export const ErrorHandeller = error => {
    const errorResponse = error && error.response ? error.response.data : null

    if (errorResponse) {
        if (errorResponse.message === 'unauthorized request') {
            Toast.fire({
                icon: 'success',
                title: errorResponse.message + ' Logging out...'
            })

            setTimeout(() => {
                localStorage.clear()
                window.location.reload()
            }, 2000)
        } else if (errorResponse.message === 'Token expired') {
            Toast.fire({
                icon: 'success',
                title: error.message + ' Logging out...'
            })

            setTimeout(() => {
                localStorage.clear()
                window.location.reload()
            }, 2000)
        } else {
            return Toast.fire({
                icon: 'success',
                title: errorResponse.message
            })
        }
    }
}