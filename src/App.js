import React, { useState, useEffect, useCallback, useReducer } from 'react';

// A single React component for the entire application.
const App = () => {
  // Main application state
  const [currentPage, setCurrentPage] = useState('Login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentForm, setCurrentForm] = useState('login'); // 'login' or 'signup'
  const [isLoading, setIsLoading] = useState(false); // No more loading state without database

  // Application Data state - Using local mock data
  const [teacherData, setTeacherData] = useState({
    name: 'Teacher',
    classes: [
      { id: 'math101', name: 'Math 101', students: ['stu_001', 'stu_002', 'stu_003'] },
      { id: 'sci202', name: 'Science 202', students: ['stu_004', 'stu_005', 'stu_006'] },
    ],
    assignments: [
      { id: 'assign_001', studentIds: ['stu_001', 'stu_002'], title: 'Algebra Worksheet', due: '2025-09-01', grades: {} },
      { id: 'assign_002', studentIds: ['stu_004', 'stu_005', 'stu_006'], title: 'Solar System Essay', due: '2025-09-05', grades: {} },
    ],
    timetable: [
      { title: 'Maths Lecture', time: '10:00 AM', joinLink: '#' },
      { title: 'Science Lab', time: '2:00 PM', joinLink: '#' },
    ],
  });

  const [studentsData, setStudentsData] = useState([
    { id: 'stu_001', name: 'Alice Johnson', email: 'alice.j@email.com', classId: 'math101', grades: {} },
    { id: 'stu_002', name: 'Bob Williams', email: 'bob.w@email.com', classId: 'math101', grades: {} },
    { id: 'stu_003', name: 'Charlie Brown', email: 'charlie.b@email.com', classId: 'math101', grades: {} },
    { id: 'stu_004', name: 'Diana Prince', email: 'diana.p@email.com', classId: 'sci202', grades: {} },
    { id: 'stu_005', name: 'Eric Foreman', email: 'eric.f@email.com', classId: 'sci202', grades: {} },
    { id: 'stu_006', name: 'Grace Hopper', email: 'grace.h@email.com', classId: 'sci202', grades: {} },
  ]);

  // Selected data for specific pages
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // --- Utility Functions ---
  const navigate = useCallback((page, data = null) => {
    setCurrentPage(page);
    if (page === 'StudentProfile') {
      setSelectedStudent(data);
    } else if (page === 'GradeAssignment') {
      setSelectedAssignment(data);
    } else {
      setSelectedStudent(null);
      setSelectedAssignment(null);
    }
  }, []);

  // --- Page Components ---

  // Login/Signup page component
  const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = (e) => {
      e.preventDefault();
      // Simple mock authentication
      if (email === 'teacher@example.com' && password === 'password') {
        setIsLoggedIn(true);
        setCurrentPage('Dashboard');
        setTeacherData(prev => ({...prev, name: 'Mr. Davis'}))
      } else {
        setMessage('Invalid credentials. For demonstration, use teacher@example.com and "password" to log in.');
      }
    };

    const handleSignup = (e) => {
        e.preventDefault();
        if (name && email && password) {
          setIsLoggedIn(true);
          setCurrentPage('Dashboard');
          setTeacherData(prev => ({...prev, name: name}));
          setMessage('Sign up successful! You are now logged in.');
        } else {
            setMessage('Please fill in all fields.');
        }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
        <div className="bg-white p-8 w-full max-w-sm rounded-3xl shadow-2xl flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Teacher Portal</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            {currentForm === 'login' ? 'Log in to manage your classes and students.' : 'Create an account to get started.'}
          </p>
          <form className="w-full space-y-4" onSubmit={currentForm === 'login' ? handleLogin : handleSignup}>
            {currentForm === 'signup' && (
                <div>
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    />
                </div>
            )}
            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
              {currentForm === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
            {message && <p className={`mt-2 text-center text-sm text-red-600`}>{message}</p>}
          </form>
          <button onClick={() => setCurrentForm(currentForm === 'login' ? 'signup' : 'login')} className="mt-4 text-blue-600 font-semibold hover:underline">
            {currentForm === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    );
  };

  // Main application layout
  const MainLayout = ({ children }) => (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar navigate={navigate} />
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">{currentPage === 'Dashboard' ? `Welcome, ${teacherData?.name || 'Teacher'}!` : currentPage}</h1>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors" onClick={() => setIsLoggedIn(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            <span>Log Out</span>
          </button>
        </header>
        <div className="bg-white p-6 rounded-3xl shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );

  // Sidebar navigation component
  const Sidebar = ({ navigate }) => (
    <div className="w-64 bg-gray-800 text-white p-6 flex flex-col h-screen rounded-r-3xl shadow-xl">
      <div className="flex items-center space-x-2 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M22 10v6m-4-6V6l-8-4-8 4v12l8 4 8-4v-6"/>
          <path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
          <path d="M12 2v20"/>
          <path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
        </svg>
        <span className="text-2xl font-bold font-inter tracking-wider">Teacher Portal</span>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-4">
          <NavItem name="Dashboard" navigate={navigate} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>} />
          <NavItem name="Students" navigate={navigate} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-2"><path d="M14 19a6 6 0 0 0-12 0"/><circle cx="8" cy="9" r="4"/><path d="M22 19a6 6 0 0 0-6-6h-2c-.23 0-.45.03-.67.09"/><circle cx="16" cy="7" r="4"/></svg>} />
          <NavItem name="Assignments" navigate={navigate} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>} />
          <NavItem
            name="Grades"
            navigate={navigate}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-check">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                <path d="m14 11 2 2 4-4"/>
              </svg>
            }
          />
          <NavItem name="Timetable" navigate={navigate} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>} />
        </ul>
      </nav>
      <div className="mt-auto text-sm text-gray-400">
        <p>Logged in as: {teacherData?.name || 'Unknown'}</p>
      </div>
    </div>
  );

  // A reusable component for navigation items
  const NavItem = ({ name, navigate, icon }) => (
    <li
      className={`flex items-center ${icon ? 'space-x-3' : ''} p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
        currentPage === name ? 'bg-gray-700 text-blue-400 font-semibold' : 'hover:bg-gray-700 text-gray-200'
      }`}
      onClick={() => navigate(name)}
    >
      {icon}
      <span>{name}</span>
    </li>
  );

  // Dashboard Page component
  const DashboardPage = () => {
    if (isLoading) return <p className="text-gray-500 italic">Loading dashboard data...</p>;

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Total Students" value={studentsData.length} description="Across all classes." />
          <Card title="Classes" value={(teacherData.classes || []).length} description="Your current teaching load." />
          <Card title="Upcoming Assignments" value={(teacherData.assignments || []).length} description="To be graded." />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Classes</h3>
          <ul className="space-y-4">
            {(teacherData.classes || []).map(c => (
              <li key={c.id} className="bg-gray-50 p-4 rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-800">{c.name}</span>
                  <p className="text-sm text-gray-500">{c.students.length} students enrolled</p>
                </div>
                <button onClick={() => navigate('Students')} className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors">
                  View Students
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Reusable Card component
  const Card = ({ title, value, description }) => (
    <div className="bg-blue-50 p-6 rounded-2xl shadow-md flex flex-col items-start space-y-2">
      <h4 className="text-sm font-medium text-blue-800">{title}</h4>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  // Students Page component
  const StudentsPage = () => {
    if (isLoading) return <p className="text-gray-500 italic">Loading students data...</p>;
    
    // Group students by class
    const studentsByClass = (teacherData?.classes || []).reduce((acc, cls) => {
      acc[cls.id] = studentsData.filter(s => s.classId === cls.id);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Student Roster</h2>
        {(teacherData?.classes || []).map(cls => (
          <div key={cls.id}>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{cls.name}</h3>
            <ul className="space-y-4">
              {(studentsByClass[cls.id] || []).map(s => (
                <li key={s.id} className="bg-gray-50 p-4 rounded-xl shadow-sm flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-gray-800">{s.name}</span>
                    <p className="text-sm text-gray-500">{s.email}</p>
                  </div>
                  <button onClick={() => navigate('StudentProfile', s)} className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors">
                    View Profile
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  // Student Profile Page component
  const StudentProfilePage = () => {
    if (!selectedStudent || isLoading) return <p className="text-gray-500 italic">Please select a student to view their profile, or data is loading.</p>;

    const studentClass = (teacherData?.classes || []).find(c => c.id === selectedStudent.classId);

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <img src={`https://placehold.co/80x80/4ade80/ffffff?text=${selectedStudent.name.charAt(0)}`} alt="Student Avatar" className="rounded-full border-4 border-green-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{selectedStudent.name}</h2>
            <p className="text-gray-500">{studentClass?.name}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Assignments & Grades</h3>
          <ul className="space-y-2">
            {(teacherData?.assignments || [])
              .filter(a => (a.studentIds || []).includes(selectedStudent.id))
              .map(a => (
                <li key={a.id} className="bg-gray-50 p-4 rounded-xl shadow-sm flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">{a.title}</span>
                    <p className="text-sm text-gray-500">Due: {a.due}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">
                      {studentsData.find(s => s.id === selectedStudent.id)?.grades[a.id] ? studentsData.find(s => s.id === selectedStudent.id)?.grades[a.id] : 'Not Graded'}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <button onClick={() => navigate('Students')} className="mt-4 text-blue-600 font-semibold hover:underline">
          &larr; Back to Students
        </button>
      </div>
    );
  };

  // Assignments Page component
  const AssignmentsPage = () => {
    const [newAssignment, setNewAssignment] = useState({ title: '', selectedStudentIds: [], due: '' });
    const [assignmentMessage, setAssignmentMessage] = useState('');

    const handleStudentChange = (e) => {
      const studentId = e.target.value;
      setNewAssignment(prev => {
        const isSelected = prev.selectedStudentIds.includes(studentId);
        if (isSelected) {
          return { ...prev, selectedStudentIds: prev.selectedStudentIds.filter(id => id !== studentId) };
        } else {
          return { ...prev, selectedStudentIds: [...prev.selectedStudentIds, studentId] };
        }
      });
    };

    const handleCreateAssignment = (e) => {
      e.preventDefault();
      if (!newAssignment.title || newAssignment.selectedStudentIds.length === 0 || !newAssignment.due) {
        setAssignmentMessage('Please fill all fields and select at least one student.');
        return;
      }

      const newAssignmentData = {
        id: `assign_${Date.now()}`,
        studentIds: newAssignment.selectedStudentIds,
        title: newAssignment.title,
        due: newAssignment.due,
        grades: {},
      };

      setTeacherData(prevData => ({
        ...prevData,
        assignments: [...(prevData.assignments || []), newAssignmentData],
      }));
      setNewAssignment({ title: '', selectedStudentIds: [], due: '' });
      setAssignmentMessage('Assignment created successfully!');
      
      setTimeout(() => setAssignmentMessage(''), 3000);
    };

    if (isLoading) return <p className="text-gray-500 italic">Loading assignments data...</p>;
    
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Manage Assignments</h2>
        <div className="bg-blue-50 p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Create New Assignment</h3>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Title</label>
              <input type="text" value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Students</label>
              <div className="mt-1 space-y-2 max-h-48 overflow-y-auto">
                {(teacherData?.classes || []).map(cls => (
                  <div key={cls.id}>
                    <h4 className="font-medium text-gray-800">{cls.name}</h4>
                    {studentsData.filter(s => s.classId === cls.id).map(s => (
                      <div key={s.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`student-${s.id}`}
                          value={s.id}
                          checked={newAssignment.selectedStudentIds.includes(s.id)}
                          onChange={handleStudentChange}
                          className="rounded-md text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`student-${s.id}`} className="text-gray-700 text-sm">{s.name}</label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Due Date</label>
              <input type="date" value={newAssignment.due} onChange={(e) => setNewAssignment({...newAssignment, due: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Attach Files</label>
              <input type="file" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"/>
              <p className="text-xs text-gray-400 mt-1">Note: This feature is for demonstration. Actual file storage requires a backend.</p>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Create Assignment
            </button>
            {assignmentMessage && <p className={`mt-2 text-center text-sm ${assignmentMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{assignmentMessage}</p>}
          </form>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Assignments</h3>
          <ul className="space-y-4">
            {(teacherData?.assignments || []).map(a => (
              <li key={a.id} className="bg-gray-50 p-4 rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-800">{a.title}</span>
                  <p className="text-sm text-gray-500">Assigned to {(a.studentIds || []).length} students</p>
                </div>
                <button onClick={() => navigate('GradeAssignment', a)} className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors">
                  Grade
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Grades Page component
  const GradesPage = () => {
    if (isLoading) return <p className="text-gray-500 italic">Loading grades data...</p>;
    
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Assignments to Grade</h2>
        <ul className="space-y-4">
          {(teacherData?.assignments || []).map(a => (
            <li key={a.id} className="bg-gray-50 p-4 rounded-xl shadow-sm flex justify-between items-center">
              <div>
                <span className="font-semibold text-gray-800">{a.title}</span>
                <p className="text-sm text-gray-500">Assigned to {(a.studentIds || []).length} students</p>
              </div>
              <button onClick={() => navigate('GradeAssignment', a)} className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors">
                Grade
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

    // Grade Assignment Page component
  const GradeAssignmentPage = () => {
    // A reducer to manage the local state of the grades
    const gradesReducer = (state, action) => {
        switch (action.type) {
            case 'UPDATE_GRADE':
                return { ...state, [action.studentId]: action.grade };
            case 'SET_INITIAL_GRADES':
                return action.grades;
            default:
                return state;
        }
    };

    // --- ALL HOOKS ARE NOW AT THE TOP, UNCONDITIONALLY ---
    const [localGrades, dispatch] = useReducer(gradesReducer, selectedAssignment?.grades || {});

    useEffect(() => {
        if (selectedAssignment) {
          dispatch({ type: 'SET_INITIAL_GRADES', grades: selectedAssignment.grades });
        }
    }, [selectedAssignment]);

    const handleUpdateGrade = useCallback((studentId, grade) => {
        if (!selectedAssignment) return; // Guard clause
        setTeacherData(prevData => {
            const updatedAssignments = (prevData.assignments || []).map(a => {
                if (a.id === selectedAssignment.id) {
                    return {
                        ...a,
                        grades: { ...a.grades, [studentId]: grade }
                    };
                }
                return a;
            });
            return { ...prevData, assignments: updatedAssignments };
        });

        setStudentsData(prevStudents => (prevStudents || []).map(s => {
            if (s.id === studentId) {
                return {
                    ...s,
                    grades: { ...s.grades, [selectedAssignment.id]: grade }
                };
            }
            return s;
        }));
    }, [selectedAssignment]);
    // --- END OF HOOKS ---

    // This conditional return now happens AFTER the Hooks have run.
    if (!selectedAssignment || isLoading) {
      return <p className="text-gray-500 italic">Please select an assignment to grade, or data is loading.</p>;
    }

    const studentsInAssignment = studentsData.filter(s => (selectedAssignment.studentIds || []).includes(s.id));

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Grade: {selectedAssignment.title}</h2>
        <ul className="space-y-4">
          {studentsInAssignment.map(s => (
            <li key={s.id} className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div className="flex-1">
                <span className="font-semibold text-gray-800">{s.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Grade"
                  value={localGrades?.[s.id] || ''}
                  onChange={(e) => {
                    dispatch({ type: 'UPDATE_GRADE', studentId: s.id, grade: e.target.value });
                  }}
                  onBlur={(e) => {
                    handleUpdateGrade(s.id, e.target.value);
                  }}
                  className="w-24 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('Grades')} className="mt-4 text-blue-600 font-semibold hover:underline">
          &larr; Back to Grades
        </button>
      </div>
    );
  };
  
  // Timetable Page component
  const TimetablePage = () => {
    if (isLoading) return <p className="text-gray-500 italic">Loading timetable data...</p>;
    
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Upcoming Classes</h2>
        <ul className="space-y-4">
            {(teacherData?.timetable || []).map((t, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                        <span className="font-semibold text-gray-800">{t.title}</span>
                        <p className="text-sm text-gray-500">Time: {t.time}</p>
                    </div>
                    <button onClick={() => window.open(t.joinLink, '_blank')} className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors">
                        Join Class
                    </button>
                </li>
            ))}
            {(teacherData?.timetable || []).length === 0 && <p className="text-gray-500 italic">No upcoming classes scheduled.</p>}
        </ul>
      </div>
    );
  };

  // Renders the correct page based on the state
  const renderPageContent = () => {
    if (!isLoggedIn) {
      return <AuthPage />;
    }
    
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Students':
        return <StudentsPage />;
      case 'Assignments':
        return <AssignmentsPage />;
      case 'Grades':
        return <GradesPage />;
      case 'StudentProfile':
        return <StudentProfilePage />;
      case 'GradeAssignment':
        return <GradeAssignmentPage />;
      case 'Timetable':
        return <TimetablePage />;
      default:
        return <DashboardPage />;
    }
  };

  // Main application structure
  return (
    <div className="font-sans">
      {isLoggedIn ? (
        <MainLayout>
          {renderPageContent()}
        </MainLayout>
      ) : (
        <AuthPage />
      )}
    </div>
  );
};

export default App;
