var notify_config = {
    config: {
        debug:false,
        enable:true,
        defaultHandler: "networkOnly",
        navigationFallback: '/offline',
        cache: {
            name: "notify-2", //@ string
            maxAge: 604800, //@ number in sec
            maxLimit: 10000 //@ number in sec
        },
        urls: {
            '/(.*)': {
                handler: 'networkFirst', // @ string
            }
        },
        staticFiles: [
            {
                origin: 'https://ajax.googleapis.com',
                urlPattern: '/ajax/libs/jqueryui/(.*)'

            },
            {
                origin: 'https://maxcdn.bootstrapcdn.com',
                urlPattern: '/font-awesome/4.5.0/(.*)'
            },
            {
                origin: 'https://anijs.github.io',
                urlPattern: '/lib/anicollection/anicollection.css'
            }
        ],
        preCache: [
            "/home",
            "/offline",
            "/home?webapp=1",
        ],
    }
};