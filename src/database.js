import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data);
    }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          console.log(row[key])
          return row[key].toLowerCase().includes(value.toLowerCase)
        })
      })
    }

    return data
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist();

    return data
  }

  update(table, id, data) {
    const task = this.#database[table].find(row => row.id === id);

    if(task) {
      task.title = data.title ? data.title : task.title;
      task.description = data.description ? data.description : task.description;
      task.updated_at = new Date();
      
      if(data.completed_at) {
        task.completed_at = task.completed_at ? null : data.completed_at
      }


      const rowIndex = this.#database[table].findIndex(row => row.id === id)
      this.#database[table][rowIndex] = task
      this.#persist()

      return {
        status: 200,
        message: "SUCCESS"
      }
    }

    return {
      status: 400,
      message: 'TASK_NOT_FOUND'
    }
  }

  delete(table, id) {
    const task = this.#database[table].find(row => row.id === id);

    if(task) {
      const rowIndex = this.#database[table].findIndex(row => row.id === id)

      this.#database[table].splice(rowIndex, 1)
      this.#persist()

      return {
        status: 200,
        message: "SUCCESS"
      }
    }

    return {
      status: 400,
      message: 'TASK_NOT_FOUND'
    }
  }
}