import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToken } from '../../api/Token';
import { Navigate } from 'react-router-dom'; // import Navigate component

// Define interfaces for the Patient and Doctor data
interface Patient {
  id: number;
  name: string;
  patientToken: string;
  medicalHistory: string;
  doctorId: number;
  clinicId: number;
  branchId: number;
  bloodGroup: string;
  appointmentDate: string;
  phoneNumber: string;
  createdDate: string;
  image: string;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
}

const PreAppointment: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useToken();
  const [navigate, setNavigate] = useState<boolean>(false); // State to handle navigation

  // Fetch patient data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/patients', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient data');
        setLoading(false);
      }
    };

    fetchPatients();
  }, [accessToken]);

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/users/role/DOCTOR', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      }
    };

    fetchDoctors();
  }, [accessToken]);

  // Create a mapping of doctorId to doctor name
  const doctorMap = new Map<number, string>();
  doctors.forEach(doctor => {
    doctorMap.set(doctor.id, `${doctor.firstName} ${doctor.lastName}`);
  });

  // If data is still loading or there was an error
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Handle navigation to the Record page with data
  const handleRecordNavigation = (patientId: number, doctorId: number, medicalHistory: string) => {
    setNavigate(true);
    // You can store data in localStorage/sessionStorage if needed or pass directly via state
    localStorage.setItem('patientId', String(patientId));
    localStorage.setItem('doctorId', String(doctorId));
    localStorage.setItem('medicalHistory', medicalHistory);
  };

  // If navigate state is true, perform the navigation
  if (navigate) {
    return <Navigate to="/dashboard/record" />;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Pre-Appointment Information</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Patient Token</th>
            <th>Medical History</th>
            <th>Doctor</th>
            <th>Clinic ID</th>
            <th>Branch ID</th>
            <th>Blood Group</th>
            <th>Appointment Date</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.patientToken}</td>
              <td>{patient.medicalHistory}</td>
              <td>{doctorMap.get(patient.doctorId)}</td>
              <td>{patient.clinicId}</td>
              <td>{patient.branchId}</td>
              <td>{patient.bloodGroup}</td>
              <td>{new Date(patient.appointmentDate).toLocaleString()}</td>
              <td>{patient.phoneNumber}</td>
              <td>
                <button onClick={() => handleRecordNavigation(patient.id, patient.doctorId, patient.medicalHistory)}>
                  View Record
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    margin: '0 auto',
    maxWidth: '1200px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#4CAF50',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  th: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  tr: {
    backgroundColor: '#f9f9f9',
  },
  trEven: {
    backgroundColor: '#f2f2f2',
  },
};

export default PreAppointment;
