import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useToken } from '../../api/Token';
import { motion } from 'framer-motion';

const Head: React.FC = () => {
  const theme = useTheme();
  const iconBlue = theme.palette.primary.main;
  const iconBoxInside = theme.palette.common.white;
  const textColor = theme.palette.text.primary;
  const secondaryTextColor = theme.palette.text.secondary;

  const { accessToken } = useToken();

  const [patients, setPatients] = useState<number>(0);
  const [patientChange, setPatientChange] = useState<string>("");
  const [appointments, setAppointments] = useState<number>(0);
  const [appointmentChange, setAppointmentChange] = useState<string>("");
  const [totalPrescriptions, setTotalPrescriptions] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [prescriptionChange, setPrescriptionChange] = useState<string>("");
  const [earningsChange, setEarningsChange] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsResponse, appointmentsResponse, recordsResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/v1/patients', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get('http://localhost:8080/api/v1/appointments', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get('http://localhost:8080/api/v1/medical-records', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        // Process patients data
        const patientsData = patientsResponse.data;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const patientsThisMonth = patientsData.filter((patient: any) => {
          const createdDate = new Date(patient.createdDate);
          return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
        }).length;

        const patientsLastMonth = patientsData.filter((patient: any) => {
          const createdDate = new Date(patient.createdDate);
          return createdDate.getMonth() === previousMonth && createdDate.getFullYear() === previousYear;
        }).length;

        setPatients(patientsThisMonth);

        const changePercentage =
          patientsLastMonth === 0
            ? NaN
            : ((patientsThisMonth - patientsLastMonth) / patientsLastMonth) * 100;

        setPatientChange(
          isNaN(changePercentage) ? "N/A" : `${changePercentage.toFixed(2)}%`
        );

        // Process appointments data
        const appointmentsData = appointmentsResponse.data;

        const appointmentsThisMonth = appointmentsData.filter((appointment: any) => {
          const dateOfVisit = new Date(appointment.startTime);
          return dateOfVisit.getMonth() === currentMonth && dateOfVisit.getFullYear() === currentYear;
        }).length;

        const appointmentsLastMonth = appointmentsData.filter((appointment: any) => {
          const dateOfVisit = new Date(appointment.startTime);
          return dateOfVisit.getMonth() === previousMonth && dateOfVisit.getFullYear() === previousYear;
        }).length;

        setAppointments(appointmentsThisMonth);

        const appointmentChangePercentage =
          appointmentsLastMonth === 0
            ? NaN
            : ((appointmentsThisMonth - appointmentsLastMonth) / appointmentsLastMonth) * 100;

        setAppointmentChange(
          isNaN(appointmentChangePercentage) ? "N/A" : `${appointmentChangePercentage.toFixed(2)}%`
        );

        // Process medical records data for current and previous month
        const recordsData = recordsResponse.data;

        const currentMonthRecords = recordsData.filter((record: any) => {
          const visitDate = new Date(record.visitDate);
          return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
        });

        const previousMonthRecords = recordsData.filter((record: any) => {
          const visitDate = new Date(record.visitDate);
          return visitDate.getMonth() === previousMonth && visitDate.getFullYear() === previousYear;
        });

        const totalPrescriptionsCount = currentMonthRecords.length;
        const totalEarningsAmount = currentMonthRecords.reduce((acc: number, record: any) => acc + record.amount, 0);

        const totalPrescriptionsLastMonth = previousMonthRecords.length;
        const totalEarningsLastMonth = previousMonthRecords.reduce((acc: number, record: any) => acc + record.amount, 0);

        setTotalPrescriptions(totalPrescriptionsCount);
        setTotalEarnings(totalEarningsAmount);

        const prescriptionChangePercentage =
          totalPrescriptionsLastMonth === 0
            ? NaN
            : ((totalPrescriptionsCount - totalPrescriptionsLastMonth) / totalPrescriptionsLastMonth) * 100;

        const earningsChangePercentage =
          totalEarningsLastMonth === 0
            ? NaN
            : ((totalEarningsAmount - totalEarningsLastMonth) / totalEarningsLastMonth) * 100;

        setPrescriptionChange(
          isNaN(prescriptionChangePercentage) ? "N/A" : `${prescriptionChangePercentage.toFixed(2)}%`
        );

        setEarningsChange(
          isNaN(earningsChangePercentage) ? "N/A" : `${earningsChangePercentage.toFixed(2)}%`
        );

      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, [accessToken]);

  const cardData = [
    { title: "Patients", value: patients.toString(), icon: <PeopleIcon sx={{ color: iconBoxInside }} />, change: patientChange },
    { title: "Appointments", value: appointments.toString(), icon: <ReceiptIcon sx={{ color: iconBoxInside }} />, change: appointmentChange },
    { title: "Prescriptions", value: totalPrescriptions.toString(), icon: <WalletIcon sx={{ color: iconBoxInside }} />, change: prescriptionChange },
    { title: "Total Earnings", value: `$${totalEarnings}`, icon: <AttachMoneyIcon sx={{ color: iconBoxInside }} />, change: earningsChange },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: index < 2 ? -100 : 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.5, type: 'spring', stiffness: 400 }}
            >
              <Card sx={{ minHeight: '125px', borderRadius: 5 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box>
                      <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 5 }}
                      >
                        <Typography variant="subtitle2" color={secondaryTextColor} fontWeight="bold">
                          {card.title}
                        </Typography>
                      </motion.div>
                      <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 5 }}
                      >
                        <Typography variant="h6" color={textColor} fontWeight="bold">
                          {card.value}
                        </Typography>
                      </motion.div>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 45,
                        width: 45,
                        borderRadius: '50%',
                        bgcolor: iconBlue,
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography variant="body2" color={secondaryTextColor}>
                    <span style={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                      {card.change}
                    </span>
                    {index < 2 ? ' from last month' : ' from last month'}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Head;
