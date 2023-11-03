const fs = require('node:fs')
const { execSync } = require('node:child_process')

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }))

const BASE_COMAND = 'npm i '

const dependenciesName = Object.keys(pkg.dependencies).join('@latest ') + '@latest'
const devDependenciesName = Object.keys(pkg.devDependencies).join('@latest ') + '@latest'

function exec(command = '') {
    console.log('start command:', command)
    execSync(command, (error, stdout, stderr) => {
        if (error) {
            console.error(error)
            return
        }
        console.log(stdout)
        console.error(stderr)
    })

    console.log('COMPLETE\n')
}

dependenciesName.split(' ').forEach(cmd => {
    exec(BASE_COMAND + cmd)
})

devDependenciesName.split(' ').forEach(cmd => {
    exec(BASE_COMAND + ' -D ' + cmd)
})