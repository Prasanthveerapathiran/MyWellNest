import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Typography,
  Paper,
  Container,
  CssBaseline,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useToken } from '../../api/Token';
import { motion } from 'framer-motion';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Appointment } from '../Doctors/DoctorAppointment/DoctorAppointment';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
const CreateAppointment: React.FC = () => {
 

  const [appointments, setAppointments] = useState<Event[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<string>('regular check up');
  const [shareWithPatient, setShareWithPatient] = useState<string>('whatsapp');
  const [descriptions, setDescriptions] = useState<string>('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const location = useLocation();
  const { accessToken } = useToken();
  const [openDropConfirmDialog, setOpenDropConfirmDialog] = useState<boolean>(false);
  const { id,doctorId, patientId, clinicId, branchId, patientName, doctorName } = location.state || {};
  useEffect(() => {
    if (id && patientId && doctorId) {
      // Log for debugging
      console.log("Rescheduling appointment for patientId:", patientId);
      console.log("With doctorId:", doctorId);
      console.log("With appointmentId:", id);
  
      // Set initial details for editing the existing appointment
      const existingAppointment = existingAppointments.find(
        (appointment) => appointment.id === id
      );
      if (existingAppointment) {
        setAppointmentDetails({
          start: new Date(existingAppointment.startTime),
          end: new Date(existingAppointment.endTime),
          newAppointment: {
            doctorId,
            patientId,
            startTime: existingAppointment.startTime,
            endTime: existingAppointment.endTime,
            status: existingAppointment.status || 'regular check up',
            descriptions: existingAppointment.descriptions || '',
            shareWithPatient: existingAppointment.shareWithPatient || 'whatsapp',
            clinicId,
            branchId,
          },
          appointmentId: id, // Use this for PUT requests
        });
      }
    }
  }, [id, patientId, doctorId, existingAppointments]);
  

  const checkForConflicts = (newStartTime: string, newEndTime: string) => {
    const newStart = new Date(newStartTime);
    const newEnd = new Date(newEndTime);
  
    return existingAppointments.some(appointment => {
      const appointmentStart = new Date(appointment.startTime);
      const appointmentEnd = new Date(appointment.endTime);
  
      if (appointment.clinicId !== clinicId || appointment.doctorId !== doctorId || appointment.branchId !== branchId) {
        return false;
      }
      return (
        (newStart < appointmentEnd && newEnd > appointmentStart)
      );
    });
  };

  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/appointments', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const formattedAppointments = response.data.map((appointment: any) => ({
          ...appointment,
          start: new Date(appointment.startTime),
          end: new Date(appointment.endTime),
          patientName: appointment.patientName
        }));

        setExistingAppointments(formattedAppointments);

        const patientAppointments = formattedAppointments.filter((appointment: any) => appointment.patientId === patientId);
        setAppointments(patientAppointments);

      } catch (err) {
        console.error('Failed to fetch appointments', err);
      }
    };

    fetchAppointments();
  }, [accessToken, doctorId, patientId]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const localStartDateTime = moment(start).format('YYYY-MM-DDTHH:mm');
    const localEndDateTime = moment(end).format('YYYY-MM-DDTHH:mm');

    if (checkForConflicts(localStartDateTime, localEndDateTime)) {
      setOpenAlertDialog(true);
      return;
    }

    setAppointmentDetails({
      start,
      end,
      newAppointment: {
        doctorId,
        patientId,
        startTime: localStartDateTime,
        endTime: localEndDateTime,
        status,
        descriptions,
        shareWithPatient,
        clinicId,
        branchId,
      },
    });
    setOpenConfirmDialog(true);
  };

  const handleConfirmAppointment = () => {
    if (appointmentDetails) {
      const { newAppointment } = appointmentDetails;

      setAppointments([...appointments, { ...newAppointment, start: appointmentDetails.start, end: appointmentDetails.end }]);

      axios.post(
        'http://localhost:8080/api/v1/appointments',
        newAppointment,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then(response => {
          console.log('Appointment created:', response.data);
          setSuccessMessage(true);
        })
        .catch(err => {
          console.error('Failed to create appointment', err);
        });

      setOpenConfirmDialog(false);
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  const handleEventResize = (event: Event, newEnd: Date) => {
    console.log('Resized event:', event, "date : ", newEnd);
    
  };

  const handleEventDrop = async (event: Event) => {
    console.log('Dropped event:', JSON.stringify(event.event.id));
    const start= new Date(event.start);
    const end = new Date(event.end);
    const localStartDateTime = moment(event.start).format('YYYY-MM-DDTHH:mm');
    const localEndDateTime = moment(event.end).format('YYYY-MM-DDTHH:mm');
    const appointmentId = event.event.id;
    // console.log(localStartDateTime, localEndDateTime);
    // console.log(appointments);

    setAppointmentDetails({
      start,
      end,
      newAppointment: {
        doctorId,
        patientId,
        startTime: localStartDateTime,
        endTime: localEndDateTime,
        status,
        descriptions,
        shareWithPatient,
        clinicId,
        branchId,
      },
      appointmentId
    });
    setOpenDropConfirmDialog(true);
  };

  const handleConfirmDropEvent = () => {
    if (appointmentDetails) {
      const { newAppointment, appointmentId } = appointmentDetails;
      console.log(newAppointment,"id = ",appointmentId);

      //update local information
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...newAppointment, start: appointmentDetails.start, end: appointmentDetails.end } 
            : appointment
        )
      );
  
      axios.put(
        `http://localhost:8080/api/v1/appointments/updateappointment/${appointmentId}`,
        newAppointment,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then(response => {
          console.log('Appointment updated:', response.data);
          setSuccessMessage(true);
        })
        .catch(err => {
          console.error('Failed to update appointment', err);
        });

      setOpenDropConfirmDialog(false);
    }
  };

  const handleCloseDropConfirmDialog = () => {
    setOpenDropConfirmDialog(false);
  };
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value);
  };

  const handleShareWithPatientChange = (event: SelectChangeEvent<string>) => {
    setShareWithPatient(event.target.value as string);
  };

  const handleDescriptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptions(event.target.value);
  };

  const eventStyleGetter = (event: Event) => {
    let backgroundColor = '#3174ad'; // default color
    let borderColor = '#3174ad';
  
    
    if (event.status === 'emergency' ) {
      backgroundColor = '#d9534f'; // red color for emergency
      borderColor = '#d9534f';
    
    } else if (event.status === 'regular check up') {
      backgroundColor = '#5bc0de'; // blue color for regular check up
      borderColor = '#5bc0de';
    }
    
  
    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'black',
        
        borderRadius: '10px',
      },
    };
  };

  


  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="lg"
        component={motion.div}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: '#f0f8ff', borderRadius: '15px', padding: '20px', marginTop: '20px' }}
      >
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: '20px' }}
          >
            Create Appointment
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Typography
                variant="body1"
                align="left"
                style={{ color: '#1976d2', marginBottom: '10px' }}
              >
                Patient Name: {patientName}
              </Typography>
              <Typography
                variant="body1"
                align="left"
                style={{ color: '#1976d2', marginBottom: '10px' }}
              >
                Doctor Name: {doctorName}
              </Typography>
              {/* <Typography
                variant="body1"
                align="left"
                style={{ color: '#1976d2', marginBottom: '20px' }}
              >
                Treatment: {treatment}
              </Typography> */}
            </Grid>

            <Grid item xs={6}>
              <FormControl component="fieldset" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                {/* <FormControlLabel
                  control={<Checkbox checked={status === 'New'} onChange={handleStatusChange} value="New" />}
                  label="New"
                /> */}
                <FormControlLabel
                  control={<Checkbox checked={status === 'Follow-up'} onChange={handleStatusChange} value="Follow-up" />}
                  label="Follow-up"
                />
                 <FormControlLabel
                  control={<Checkbox checked={status === 'emergency'} onChange={handleStatusChange} value="emergency" />}
                  label="Emergency"
                />
               
              </FormControl>
              
              <FormControl style={{ marginBottom: '20px', width: '100%' }}>
                <InputLabel id="share-with-patient-label">Share with Patient</InputLabel>
                <Select
                  labelId="share-with-patient-label"
                  value={shareWithPatient}
                  onChange={handleShareWithPatientChange}
                >
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  <MenuItem value="facebook">Facebook</MenuItem>
                  <MenuItem value="phone">Phone</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Descriptions"
                variant="outlined"
                multiline
                rows={4}
                value={descriptions}
                onChange={handleDescriptionsChange}
                style={{ marginBottom: '20px' }}
              />
            </Grid>
          </Grid>

          <DnDCalendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onEventResize={handleEventResize}
            onEventDrop={handleEventDrop}
            eventPropGetter={eventStyleGetter}
            
            style={{ height: 600}}
          />

          <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Do you want to confirm the appointment with {patientName} on {moment(appointmentDetails?.start).format('YYYY-MM-DD')} from {moment(appointmentDetails?.start).format('HH:mm')} to {moment(appointmentDetails?.end).format('HH:mm')}?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmAppointment} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openAlertDialog} onClose={handleCloseAlertDialog}>
            <DialogTitle>Appointment Conflict</DialogTitle>
            <DialogContent>
              <Alert severity="warning">
                The selected time slot conflicts with an existing appointment. Please choose a different time.
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAlertDialog} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openDropConfirmDialog} onClose={handleCloseDropConfirmDialog}>
            <DialogTitle>Confirm Event Drop</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                Do you want to update this appointment?
              </Typography>
              <Typography variant="body2">
                Start Time: {appointmentDetails?.start.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                End Time: {appointmentDetails?.end.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Status: {status}
              </Typography>
              <Typography variant="body2">
                Descriptions: {descriptions}
              </Typography>
              <Typography variant="body2">
                Share With Patient: {shareWithPatient}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDropConfirmDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDropEvent} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {successMessage && <Alert severity="success">Appointment created successfully!</Alert>}
        </Paper>
      </Container>
    </>
  );
};

export default CreateAppointment;
