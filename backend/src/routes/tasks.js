import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/init.js';
import { validateTaskInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/tasks - Get all tasks with optional filtering
router.get('/', (req, res) => {
  const { status, sort = 'created_at', order = 'DESC' } = req.query;
  
  let query = 'SELECT * FROM tasks';
  const params = [];
  
  if (status && (status === 'pending' || status === 'complete')) {
    query += ' WHERE status = ?';
    params.push(status);
  }
  
  // Validate sort column
  const validSortColumns = ['created_at', 'updated_at', 'description', 'status'];
  const sortColumn = validSortColumns.includes(sort) ? sort : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  
  query += ` ORDER BY ${sortColumn} ${sortOrder}`;
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to retrieve tasks'
      });
    }
    
    res.json({
      tasks: rows || [],
      total: rows?.length || 0,
      filters: { status, sort: sortColumn, order: sortOrder }
    });
  });
});

// GET /api/tasks/:id - Get specific task
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to retrieve task'
      });
    }
    
    if (!row) {
      return res.status(404).json({ 
        error: 'Task not found',
        message: `Task with ID ${id} does not exist`
      });
    }
    
    res.json(row);
  });
});

// POST /api/tasks - Create new task
router.post('/', validateTaskInput, (req, res) => {
  const { description, status = 'pending' } = req.body;
  const id = uuidv4();
  
  db.run(
    'INSERT INTO tasks (id, description, status) VALUES (?, ?, ?)',
    [id, description, status],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Internal server error',
          message: 'Failed to create task'
        });
      }
      
      // Return the created task
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            error: 'Internal server error',
            message: 'Task created but failed to retrieve'
          });
        }
        
        res.status(201).json({
          message: 'Task created successfully',
          task: row
        });
      });
    }
  );
});

// PUT /api/tasks/:id - Update task
router.put('/:id', validateTaskInput, (req, res) => {
  const { id } = req.params;
  const { description, status } = req.body;
  
  // First check if task exists
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to retrieve task'
      });
    }
    
    if (!row) {
      return res.status(404).json({ 
        error: 'Task not found',
        message: `Task with ID ${id} does not exist`
      });
    }
    
    // Update task
    db.run(
      'UPDATE tasks SET description = ?, status = ? WHERE id = ?',
      [description, status, id],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to update task'
          });
        }
        
        // Return updated task
        db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, updatedRow) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
              error: 'Internal server error',
              message: 'Task updated but failed to retrieve'
            });
          }
          
          res.json({
            message: 'Task updated successfully',
            task: updatedRow
          });
        });
      }
    );
  });
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // First check if task exists
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to retrieve task'
      });
    }
    
    if (!row) {
      return res.status(404).json({ 
        error: 'Task not found',
        message: `Task with ID ${id} does not exist`
      });
    }
    
    // Delete task
    db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Internal server error',
          message: 'Failed to delete task'
        });
      }
      
      res.json({
        message: 'Task deleted successfully',
        deletedTask: row
      });
    });
  });
});

export default router;