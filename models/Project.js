import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export class Project {
  constructor(data) {
    this.customerName = data.customerName || '';
    this.jobNumber = data.jobNumber || '';
    this.jobName = data.jobName || '';
    this.holes = data.holes || [];
    // Ensure dates are Date objects, not strings
    this.createdAt = data.createdAt 
      ? (data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt))
      : new Date();
    this.updatedAt = data.updatedAt 
      ? (data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt))
      : new Date();
  }

  static async create(data) {
    try {
      console.log('Project.create called with data:', JSON.stringify(data, null, 2));
      const db = await Project.getDb();
      console.log('Database connection established');
      const project = new Project(data);
      console.log('Project object created:', JSON.stringify(project, null, 2));
      const result = await db.collection('projects').insertOne(project);
      console.log('Insert result:', result);
      return { ...project, _id: result.insertedId };
    } catch (error) {
      console.error('Error creating project:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  static getDb() {
    // Extract database name from URI or use default
    const uri = process.env.MONGODB_URI || '';
    let dbName = 'foam-tracker'; // default database name
    
    // Try to extract database name from URI
    // Format: mongodb+srv://user:pass@cluster/dbname?options
    // or: mongodb://localhost:27017/dbname
    try {
      const uriParts = uri.split('/');
      if (uriParts.length > 3) {
        const dbPart = uriParts[uriParts.length - 1].split('?')[0];
        if (dbPart && dbPart.length > 0 && dbPart !== '') {
          dbName = dbPart;
        }
      }
      console.log('Extracted database name:', dbName);
    } catch (error) {
      console.warn('Could not extract database name from URI, using default:', dbName);
    }
    
    return clientPromise
      .then(client => {
        console.log('MongoDB client connected');
        return client.db(dbName);
      })
      .catch(error => {
        console.error('Error getting database:', error);
        throw error;
      });
  }

  static async findById(id) {
    try {
      const db = await Project.getDb();
      const objectId = typeof id === 'string' ? new ObjectId(id) : id;
      return await db.collection('projects').findOne({ _id: objectId });
    } catch (error) {
      console.error('Error finding project:', error);
      throw new Error(`Failed to find project: ${error.message}`);
    }
  }

  static async findAll() {
    try {
      const db = await Project.getDb();
      return await db.collection('projects').find({}).sort({ updatedAt: -1 }).toArray();
    } catch (error) {
      console.error('Error finding all projects:', error);
      throw new Error(`Failed to find projects: ${error.message}`);
    }
  }

  static async update(id, data) {
    try {
      const db = await Project.getDb();
      const objectId = typeof id === 'string' ? new ObjectId(id) : id;
      const result = await db.collection('projects').updateOne(
        { _id: objectId },
        { $set: { ...data, updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) {
        throw new Error('Project not found');
      }
      return result;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const db = await Project.getDb();
      const objectId = typeof id === 'string' ? new ObjectId(id) : id;
      return await db.collection('projects').deleteOne({ _id: objectId });
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }
}

