import { NextResponse } from 'next/server';
import { Project } from '@/models/Project';

export async function GET() {
  try {
    const projects = await Project.findAll();
    return NextResponse.json({
      success: true,
      count: projects.length,
      projects: projects.map(p => ({
        _id: p._id,
        customerName: p.customerName,
        jobNumber: p.jobNumber,
        jobName: p.jobName,
        holesCount: p.holes?.length || 0,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

