"use client";
import React, { useState } from "react";
import "./signin.css";

interface StudentDetails {
  student_id: string;
  student_name: string;
  class: number;
  center_id: string;
}

interface VolunteerDetails {
  volunteer_id: string;
  volunteer_name: string;
  address: string;
  center_id: string;
}

const SignIn: React.FC = () => {
  const [userType, setUserType] = useState("volunteer");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [volunteerDetails, setVolunteerDetails] = useState<VolunteerDetails | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newStudent, setNewStudent] = useState<StudentDetails>({ student_id: "", student_name: "", class: 0, center_id: "" });
  const [newVolunteer, setNewVolunteer] = useState<VolunteerDetails>({ volunteer_id: "", volunteer_name: "", address: "", center_id: "" });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userType === "student") {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setStudentDetails(data);
          setVolunteerDetails(null);
        } else {
          alert("Student not found.");
          setStudentDetails(null);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    } else if (userType === "volunteer") {
      try {
        const response = await fetch(`http://localhost:5000/api/volunteers/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setVolunteerDetails(data);
          setStudentDetails(null);
        } else {
          alert("Volunteer not found.");
          setVolunteerDetails(null);
        }
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userType === "student") {
        const response = await fetch('http://localhost:5000/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newStudent),
        });
        if (response.ok) {
          const data = await response.json();
          alert("Student registered successfully!");
          setNewStudent({ student_id: "", student_name: "", class: 0, center_id: "" });
        } else {
          alert("Failed to register student.");
        }
      } else if (userType === "volunteer") {
        const response = await fetch('http://localhost:5000/api/volunteers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newVolunteer),
        });
        if (response.ok) {
          const data = await response.json();
          alert("Volunteer registered successfully!");
          setNewVolunteer({ volunteer_id: "", volunteer_name: "", address: "", center_id: "" });
        } else {
          alert("Failed to register volunteer.");
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{isRegistering ? "Register" : "Sign In"}</h2>
        <form onSubmit={isRegistering ? handleRegister : handleSignIn}>
          <div className="mb-4">
            <label htmlFor="userType" className="block text-gray-700 font-bold mb-2">User Type</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="volunteer">Volunteer</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-gray-700 font-bold mb-2">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your User ID"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          {isRegistering && userType === "student" && (
            <>
              <div className="mb-4">
                <label htmlFor="studentName" className="block text-gray-700 font-bold mb-2">Student Name</label>
                <input
                  type="text"
                  id="studentName"
                  value={newStudent.student_name}
                  onChange={(e) => setNewStudent({ ...newStudent, student_name: e.target.value })}
                  placeholder="Enter student name"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="class" className="block text-gray-700 font-bold mb-2">Class</label>
                <input
                  type="number"
                  id="class"
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({ ...newStudent, class: parseInt(e.target.value) })}
                  placeholder="Enter class"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="centerId" className="block text-gray-700 font-bold mb-2">Center ID</label>
                <input
                  type="text"
                  id="centerId"
                  value={newStudent.center_id}
                  onChange={(e) => setNewStudent({ ...newStudent, center_id: e.target.value })}
                  placeholder="Enter center ID"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </>
          )}
          {isRegistering && userType === "volunteer" && (
            <>
              <div className="mb-4">
                <label htmlFor="volunteerName" className="block text-gray-700 font-bold mb-2">Volunteer Name</label>
                <input
                  type="text"
                  id="volunteerName"
                  value={newVolunteer.volunteer_name}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, volunteer_name: e.target.value })}
                  placeholder="Enter volunteer name"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 font-bold mb-2">Address</label>
                <input
                  type="text"
                  id="address"
                  value={newVolunteer.address}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, address: e.target.value })}
                  placeholder="Enter address"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="centerId" className="block text-gray-700 font-bold mb-2">Center ID</label>
                <input
                  type="text"
                  id="centerId"
                  value={newVolunteer.center_id}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, center_id: e.target.value })}
                  placeholder="Enter center ID"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </>
          )}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition duration-300">
            {isRegistering ? "Register" : "Sign In"}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 text-blue-500 hover:underline"
        >
          {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Register"}
        </button>

        {studentDetails && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
            <h3 className="text-lg font-bold mb-2">Student Details</h3>
            <p><strong>ID:</strong> {studentDetails.student_id}</p>
            <p><strong>Name:</strong> {studentDetails.student_name}</p>
            <p><strong>Class:</strong> {studentDetails.class}</p>
            <p><strong>Center ID:</strong> {studentDetails.center_id}</p>
          </div>
        )}

        {volunteerDetails && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
            <h3 className="text-lg font-bold mb-2">Volunteer Details</h3>
            <p><strong>ID:</strong> {volunteerDetails.volunteer_id}</p>
            <p><strong>Name:</strong> {volunteerDetails.volunteer_name}</p>
            <p><strong>Address:</strong> {volunteerDetails.address}</p>
            <p><strong>Center ID:</strong> {volunteerDetails.center_id}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
