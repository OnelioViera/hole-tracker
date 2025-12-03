import { NextResponse } from 'next/server';
import { Project } from '@/models/Project';

export async function GET() {
  try {
    const projects = await Project.findAll();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Received data:', JSON.stringify(data, null, 2));
    const project = await Project.create(data);
    console.log('Project created successfully:', project._id);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('API POST error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}

