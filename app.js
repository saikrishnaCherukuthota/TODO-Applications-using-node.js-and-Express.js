let express = require('express')
let {open} = require('sqlite')
let {Database} = require('sqlite3')

let {join} = require('path')
const address = join(__dirname, 'todoApplication.db')

let app = express()
app.use(express.json())

let db = null
let kk = async function () {
  db = await open({
    filename: address,
    driver: Database,
  })
}
kk()

//API 1

app.get('/todos/', async function (request, response) {
  let query_obj = request.query
  let {status = '', search_q = '', priority = ''} = query_obj
  let qu = `select * from todo where todo like "%${search_q}%" and priority like "%${priority}%" and status like "%${status}%";`
  let arr = await db.all(qu)
  response.send(arr)
})

//API 2

app.get('/todos/:todoId/', async function (request, response) {
  let {todoId} = request.params
  let qu = `select * from todo where id="${todoId}";`
  let arr = await db.get(qu)
  response.send(arr)
})

//API 3

app.post('/todos/', async function (request, response) {
  let obj = request.body
  let {id, todo, priority, status} = obj
  let qu = `insert into todo(id,todo,priority,status) values("${id}","${todo}","${priority}","${status}");`
  await db.run(qu)
  response.send('Todo Successfully Added')
})

//API 4

app.put('/todos/:todoId/', async function (request, response) {
  let obj = request.body
  let {todoId} = request.params
  let key = Object.keys(obj)
  if (key[0] === 'status') {
    let qu = `update todo set status="${obj.status}"  where id="${todoId}";`
    await db.run(qu)
    response.send('Status Updated')
  } else if (key[0] === 'todo') {
    let qu = `update todo set todo="${obj.todo}"  where id="${todoId}";`
    await db.run(qu)
    response.send('Todo Updated')
  } else if (key[0] === 'priority') {
    let qu = `update todo set priority="${obj.priority}" where id="${todoId}";`
    await db.run(qu)
    response.send('Priority Updated')
  }
})

//API 5

app.delete('/todos/:todoId/', async function (request, response) {
  let {todoId} = request.params
  let qu = `delete from todo where id="${todoId}";`
  await db.run(qu)
  response.send('Todo Deleted')
})

app.listen(3000, function () {
  console.log('______________RUNNING AT PORT 3000___________________')
})

module.exports = app
