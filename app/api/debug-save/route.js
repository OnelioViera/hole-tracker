import { NextResponse } from 'next/server';
import { Project } from '@/models/Project';

export async function POST(request) {
  try {
    console.log('=== DEBUG SAVE START ===');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI:', process.env.MONGODB_URI?.substring(0, 30) + '...');
    
    const data = await request.json();
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    console.log('Calling Project.create...');
    const project = await Project.create(data);
    console.log('Project created:', project._id);
    
    console.log('=== DEBUG SAVE SUCCESS ===');
    return NextResponse.json({
      success: true,
      project: project,
      message: 'Project saved successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('=== DEBUG SAVE ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

