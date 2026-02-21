module.exports = {
    apps: [{
        name: 'buckwheat-bot',
        script: 'src/app/index.ts',
        interpreter: 'bun',
        watch: false,
        instances: 1,
        exec_mode: 'fork',
        env_prod: {
            MODE: 'prod'
        },
        env: {
            MODE: 'dev'
        },
        time: true,
    }]
}