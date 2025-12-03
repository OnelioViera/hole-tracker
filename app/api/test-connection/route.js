import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    const client = await clientPromise;
    console.log('MongoDB client connected');
    
    // Extract database name
    const uri = process.env.MONGODB_URI || '';
    let dbName = 'foam-tracker';
    try {
      const uriParts = uri.split('/');
      if (uriParts.length > 3) {
        const dbPart = uriParts[uriParts.length - 1].split('?')[0];
        if (dbPart && dbPart.length > 0 && dbPart !== '') {
          dbName = dbPart;
        }
      }
    } catch (error) {
      console.warn('Could not extract database name');
    }
    
    const db = client.db(dbName);
    console.log('Using database:', dbName);
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Try to insert a test document
    const testResult = await db.collection('test').insertOne({
      test: true,
      timestamp: new Date()
    });
    console.log('Test insert successful:', testResult.insertedId);
    
    // Clean up test document
    await db.collection('test').deleteOne({ _id: testResult.insertedId });
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: dbName,
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

