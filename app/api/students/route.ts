// app/api/students/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('student_id');

  try {
    const response = await fetch(`http://localhost:5000/api/students/${studentId}`);
    if (response.ok) {
      const student = await response.json();
      return NextResponse.json(student);
    } else {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const newStudent = await request.json();
  try {
    const response = await fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent),
    });
    if (response.ok) {
      const student = await response.json();
      return NextResponse.json(student, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to register student' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error registering student:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
