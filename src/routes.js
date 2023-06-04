import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {      
      const { title, description } = req.body;
      if(!title || !description) {
        return res.writeHead(400).end(JSON.stringify({ 
          message: 'Title or description is missing'
        }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        updated_at: new Date(),
        completed_at: null
      }
  
      database.insert('tasks', task);
  
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const id = req.params.id;
      const { title, description } = req.body

      const result = database.update('tasks', id, { title, description })
      
      return res.writeHead(result.status).end(JSON.stringify({ message: result.message }));

    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const id = req.params.id;
      const completed_at = new Date();
      const result = database.update('tasks', id, { completed_at })
      
      return res.writeHead(result.status).end(JSON.stringify({ message: result.message }));
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const id = req.params.id;

      const result = database.delete('tasks', id)

      return res.writeHead(result.status).end(JSON.stringify({ message: result.message }));
    }
  }
]