module.exports = {
    apps: [{
        name: 'buckwheat-bot',
        script: 'bun',
        args: 'run start',
        watch: false,
        instances: 1,
        exec_mode: 'fork',
        time: true,
    }]
}
