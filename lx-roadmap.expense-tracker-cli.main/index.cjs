const { program } = require('commander')

const fs = require('fs')
const { console } = require('inspector')
let DATAPATH = './data.json'
if (!fs.existsSync(DATAPATH)) {
  fs.writeFileSync(DATAPATH, '[]')
}
fs.readFile(DATAPATH, (err_, data) => {
  data = JSON.parse(data)
  let funcs = {
    save: () => fs.writeFileSync(DATAPATH, JSON.stringify(data)),
    query: (x) => data
      .map((v, i) => ({...v, _idx: i}))
      .filter(v => {
        for (let k in x) {
          if (x[k] && x[k] !== v[k]) {
            return false
          }
        }
        return true
      })
  }

  program
    .name('test-cli')
    .description('test description')
    .version('0.0.1')

  // (1) add
  program.command('add')
    .option('-d --description <description>', 'expense description')
    .option('-a --amount <amount>', 'expense amount')

    .action(({ description, amount }) => {
      let stamp = new Date().getTime()
      data.push({ id: stamp, date: stamp, description, amount: amount ? parseInt(amount) : 0 })
      funcs.save()
    })
  // (2) update
  program.command('update')
    .requiredOption('-i --id <id>', 'expense id')
    .option('-d --description <description>', 'expense description')
    .option('-a --amount <amount>', 'expense amount')

    .action(({id, description, amount}) => {
      for (let v of funcs.query({ id: parseInt(id) })) {
        data[v._idx].description = description || data[v._idx].description
        data[v._idx].amount = amount || data[v._idx].amount
      }
      funcs.save()
    })
  // (3) delete
  program.command('delete')
    .requiredOption('-i --id <id>', 'expense id')

    .action(({id}) => {
      for (let v of funcs.query({ id: parseInt(id) })) {
        data = data.filter((w, i) => v._idx !== i)
      }
      funcs.save()
    })

  // (4) retrive
  program.command('list')
    .action(() => {
      console.log(`ID\tDate\tDescription\tAmount`)
    })

  program.command('summary')
    .option('-m --month <id>', 'summary expense by month')
    
    .action(({month}) => {
      
    })
  
  })
program.parse()



