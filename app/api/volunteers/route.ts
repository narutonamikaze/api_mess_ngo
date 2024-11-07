import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const volunteerId = searchParams.get('volunteer_id');

  try {
    const response = await fetch(`http://localhost:5000/api/volunteers/${volunteerId}`);
    if (response.ok) {
      const volunteer = await response.json();
      return NextResponse.json(volunteer);
    } else {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching volunteer data:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const newVolunteer = await request.json();
  try {
    const response = await fetch('http://localhost:5000/api/volunteers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newVolunteer),
    });
    if (response.ok) {
      const volunteer = await response.json();
      return NextResponse.json(volunteer, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to register volunteer' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error registering volunteer:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
