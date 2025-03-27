import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  MedicalServices, 
  Assignment, 
  Person, 
  LocalHospital, 
  AccessTime, 
  Warning,
  CheckCircle
} from '@mui/icons-material';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Styled components
const PageTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: '60px',
    height: '4px',
    backgroundColor: theme.palette.primary.light,
    borderRadius: '2px',
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

const SubSectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  borderRadius: '12px',
  border: '1px solid rgba(0, 128, 128, 0.1)',
}));

const InfoCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  border: '1px solid rgba(0, 128, 128, 0.1)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const TableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'rgba(0, 128, 128, 0.1)',
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const PrescriptionGuidePage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f9f9f9',
    }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5, flexGrow: 1 }}>
        <Box 
          sx={{ 
            p: 4, 
            mb: 4,
            bgcolor: 'rgba(0, 128, 128, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(0, 128, 128, 0.1)'
          }}
        >
          <PageTitle variant="h4" component="h1">
            A Detailed Guide to Read Doctor's Prescriptions
          </PageTitle>

          <Typography variant="body1" paragraph>
            A prescription can be difficult to read due to handwriting, medical abbreviations, and symbols. Understanding these prescriptions is crucial to taking medications correctly. Below is a step-by-step guide to help you understand each part of a prescription.
          </Typography>
        </Box>

        {/* Section 1: Understanding Parts of a Prescription */}
        <SectionTitle variant="h5" component="h2">
          1. Understanding the Parts of a Prescription
        </SectionTitle>
        <Typography variant="body1" paragraph>
          A typical prescription consists of several sections:
        </Typography>
        
        <Grid container spacing={3}>
          {/* 1.1 Doctor's Information with image on the right */}
          <Grid item xs={12} md={6}>
            <InfoCard sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalHospital sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                  <SubSectionTitle variant="h6">
                    1.1. Doctor's Information
                  </SubSectionTitle>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Doctor's name and qualification" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Medical registration number" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Clinic or hospital name" />
                  </ListItem>
                </List>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Doctor info image next to doctor info box */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '200px'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 3,
                  fontSize: '1.25rem'
                }}
              >
                Demo prescription for representing doctor's information:
              </Typography>
              <Box 
                component="img" 
                src="/images/prescription_doctor_info.png" 
                alt="Doctor Information Example"
                sx={{ 
                  width: '100%', 
                  height: 'auto',
                  maxHeight: '140px',
                  borderRadius: 1,
                  objectFit: 'contain',
                  objectPosition: 'center',
                  mt: 'auto'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML += '<Typography color="error">Image not available</Typography>';
                }}
              />
            </Box>
          </Grid>

          {/* Demo prescription for patient information */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '200px'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 3,
                  fontSize: '1.25rem'
                }}
              >
                Demo prescription representing patient information:
              </Typography>
              <Box 
                component="img" 
                src="/images/prescription_patient_info.png" 
                alt="Patient Information Example"
                sx={{ 
                  width: '100%', 
                  height: 'auto',
                  maxHeight: '140px',
                  borderRadius: 1,
                  objectFit: 'contain',
                  objectPosition: 'center',
                  mt: 'auto'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML += '<Typography color="error">Image not available</Typography>';
                }}
              />
            </Box>
          </Grid>

          {/* 1.2 Patient Information - Now on the right */}
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                  <SubSectionTitle variant="h6">
                    1.2. Patient Information
                  </SubSectionTitle>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Name of the patient" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Age and weight (weight is crucial for pediatric patients)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Gender" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Date of prescription" />
                  </ListItem>
                </List>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* 1.3 The Symbol "Rx" */}
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assignment sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                  <SubSectionTitle variant="h6">
                    1.3. The Symbol "Rx"
                  </SubSectionTitle>
                </Box>
                <Typography variant="body2" paragraph>
                  "Rx" is a Latin abbreviation for "Recipe," meaning "Take".
                </Typography>
                <Typography variant="body2">
                  This symbol indicates the start of the prescription.
                </Typography>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Demo prescription for Rx symbol */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '200px'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 3,
                  fontSize: '1.25rem'
                }}
              >
                Demo prescription representing Rx symbol:
              </Typography>
              <Box 
                component="img" 
                src="/images/rx_demo.jpg" 
                alt="Rx Symbol Example"
                sx={{ 
                  width: '100%', 
                  height: 'auto',
                  maxHeight: '140px',
                  borderRadius: 1,
                  objectFit: 'contain',
                  objectPosition: 'center',
                  mt: 'auto'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML += '<Typography color="error">Image not available</Typography>';
                }}
              />
            </Box>
          </Grid>

          {/* Demo prescription for medication details and instructions */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '80%'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 3,
                  fontSize: '1.25rem'
                }}
              >
                Demo prescription representing medication details and instructions:
              </Typography>
              <Box 
                component="img" 
                src="/images/prescription_instruction.png" 
                alt="Medication Details and Instructions Example"
                sx={{ 
                  width: '100%',
                  borderRadius: 1,
                  objectFit: 'contain',
                  objectPosition: 'center',
                  mt: 'auto',
                  mb: 1
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML += '<Typography color="error">Image not available</Typography>';
                }}
              />
            </Box>
          </Grid>

          {/* Combined Medication Details and Instructions */}
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MedicalServices sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                  <SubSectionTitle variant="h6">
                    1.4. Medication Details & Instructions
                  </SubSectionTitle>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Medicine Name" 
                      secondary="Generic or brand name (e.g., Paracetamol 500 mg, Crocin 500 mg)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Strength" 
                      secondary="The dosage amount (e.g., 250 mg, 500 mg, 10 mg)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Dosage Form" 
                      secondary="Tablet, capsule, syrup, injection, ointment, etc."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Quantity" 
                      secondary="The number of tablets or bottles to be taken (e.g., 10 tablets, 1 bottle)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Dosage (How much to take?)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Frequency (How often to take?)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Duration (For how many days?)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary="Additional instructions (before/after meals, with/without water, etc.)" />
                  </ListItem>
                </List>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Combined Special Instructions and Doctor's Signature */}
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Warning sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                  <SubSectionTitle variant="h6">
                    1.5. Special Instructions & Doctor's Signature
                  </SubSectionTitle>
                </Box>
                <Typography variant="body2" paragraph>
                  Warnings, dietary restrictions, or precautions.
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                  Example: "Do not take with alcohol", "Take with milk".
                </Typography>
                <Typography variant="body2">
                  Every prescription must have a doctor's signature and seal for authenticity.
                </Typography>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Demo prescription for Special Instructions & Doctor's Signature */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '200px'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 3,
                  fontSize: '1.25rem'
                }}
              >
                Demo prescription demonstrating Special Instructions & Doctor's Signature:
              </Typography>
              <Box 
                component="img" 
                src="/images/prescription_info.png" 
                alt="Special Instructions Example"
                sx={{ 
                  width: '100%', 
                  height: 'auto',
                  maxHeight: '140px',
                  borderRadius: 1,
                  objectFit: 'contain',
                  objectPosition: 'center',
                  mb: 2
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML += '<Typography color="error">Image not available</Typography>';
                }}
              />
              <Box 
                component="img" 
                src="/images/sign.jpg" 
                alt="Doctor's Signature Example"
                sx={{ 
                  width: '100%', 
                  height: 'auto',
                  maxHeight: '140px',
                  borderRadius: 1,
                  objectFit: 'contain',
                  objectPosition: 'center',
                  mt: 'auto'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML += '<Typography color="error">Image not available</Typography>';
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Sample Prescription Image */}
        <Box 
          sx={{ 
            my: 5, 
            p: 3, 
            bgcolor: 'rgba(0, 128, 128, 0.05)', 
            borderRadius: 2,
            border: '1px dashed rgba(0, 128, 128, 0.3)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            Sample Prescription
          </Typography>
          <Box 
            component="img" 
            src="/images/prescription_sample.png" 
            alt="Sample Prescription"
            sx={{ 
              maxWidth: '100%', 
              height: 'auto',
              maxHeight: '400px',
              borderRadius: 1,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              display: 'block',
              margin: '0 auto'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              display: 'none', 
              p: 2, 
              bgcolor: 'background.paper',
              border: '1px solid #ddd'
            }}
          >
            Image not available
          </Typography>
        </Box>

        {/* Section 2: Common Prescription Abbreviations */}
        <SectionTitle variant="h5" component="h2">
          2. Common Prescription Abbreviations & Their Meanings
        </SectionTitle>
        
        {/* 2.1 Dosage Timing */}
        <SubSectionTitle variant="h6" component="h3">
          2.1. Dosage Timing (When to Take the Medicine?)
        </SubSectionTitle>
        
        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Abbreviation</TableHeadCell>
                  <TableHeadCell>Meaning</TableHeadCell>
                  <TableHeadCell>Example</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>OD</TableCell>
                  <TableCell>Once a day</TableCell>
                  <TableCell>Take 1 tablet OD (once daily)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>BD / BID</TableCell>
                  <TableCell>Twice a day</TableCell>
                  <TableCell>Take 1 tablet BD (morning & evening)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TDS / TID</TableCell>
                  <TableCell>Three times a day</TableCell>
                  <TableCell>Take 1 tablet TDS (morning, afternoon, evening)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>QID</TableCell>
                  <TableCell>Four times a day</TableCell>
                  <TableCell>Take 1 tablet QID (4 times a day)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>HS</TableCell>
                  <TableCell>At bedtime</TableCell>
                  <TableCell>Take 1 tablet HS (before sleeping)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SOS</TableCell>
                  <TableCell>When needed</TableCell>
                  <TableCell>Take 1 tablet SOS for pain</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>STAT</TableCell>
                  <TableCell>Immediately</TableCell>
                  <TableCell>Take 1 tablet STAT</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        {/* 2.2 When to Take Medicine - Before or After Meals */}
        <SubSectionTitle variant="h6" component="h3">
          2.2. When to Take the Medicine? (Before or After Meals)
        </SubSectionTitle>
        
        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Abbreviation</TableHeadCell>
                  <TableHeadCell>Meaning</TableHeadCell>
                  <TableHeadCell>Example</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>AC</TableCell>
                  <TableCell>Before meals</TableCell>
                  <TableCell>Take before breakfast</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PC</TableCell>
                  <TableCell>After meals</TableCell>
                  <TableCell>Take after lunch</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>HS</TableCell>
                  <TableCell>At bedtime</TableCell>
                  <TableCell>Take before sleeping</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PRN</TableCell>
                  <TableCell>As needed</TableCell>
                  <TableCell>Take only when required</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 128, 128, 0.05)', borderRadius: 1 }}>
            <Typography variant="body1" paragraph>
              Doctors often prescribe medicines using a numerical format (1-0-0, 1-1-1, etc.) to indicate when the medicine should be taken during the day. Understanding this format is crucial for taking medicines correctly.
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Understanding the Numerical Dosage Format
            </Typography>
            <Typography variant="body2" paragraph>
              A three-number format is commonly used:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="First digit → Represents Morning Dose" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Second digit → Represents Afternoon Dose" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Third digit → Represents Night Dose" />
              </ListItem>
            </List>
            
            <Typography variant="body2" paragraph>
              For example:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="1-0-0 → Take medicine in the morning only" />
              </ListItem>
              <ListItem>
                <ListItemText primary="1-1-1 → Take medicine in the morning, afternoon, and night" />
              </ListItem>
              <ListItem>
                <ListItemText primary="0-0-1 → Take medicine only at night" />
              </ListItem>
            </List>
          </Box>
        </StyledPaper>

        {/* Common Dosage Patterns */}
        <SubSectionTitle variant="h6" component="h3">
          Common Dosage Abbreviations and Their Meanings
        </SubSectionTitle>
        
        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Dosage Pattern</TableHeadCell>
                  <TableHeadCell>Meaning</TableHeadCell>
                  <TableHeadCell>Example Interpretation</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1-0-0</TableCell>
                  <TableCell>Take medicine in the morning only</TableCell>
                  <TableCell>Take one dose in the morning, none in the afternoon or night</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>0-1-0</TableCell>
                  <TableCell>Take medicine in the afternoon only</TableCell>
                  <TableCell>Take one dose in the afternoon, none in the morning or night</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>0-0-1</TableCell>
                  <TableCell>Take medicine in the night only</TableCell>
                  <TableCell>Take one dose at night, none in the morning or afternoon</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1-1-0</TableCell>
                  <TableCell>Take medicine in the morning and afternoon</TableCell>
                  <TableCell>Take one dose in the morning and one in the afternoon, none at night</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1-0-1</TableCell>
                  <TableCell>Take medicine in the morning and night</TableCell>
                  <TableCell>Take one dose in the morning and one at night, none in the afternoon</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>0-1-1</TableCell>
                  <TableCell>Take medicine in the afternoon and night</TableCell>
                  <TableCell>Take one dose in the afternoon and one at night, none in the morning</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1-1-1</TableCell>
                  <TableCell>Take medicine three times a day</TableCell>
                  <TableCell>Take one dose in the morning, one in the afternoon, and one at night</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1-0-1-0</TableCell>
                  <TableCell>Take medicine twice a day (before food)</TableCell>
                  <TableCell>Take one dose in the morning, one in the night before meals</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1-1-1-1</TableCell>
                  <TableCell>Take medicine four times a day</TableCell>
                  <TableCell>Take one dose in the morning, afternoon, evening, and night</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        {/* 2.3 Route of Administration */}
        <SubSectionTitle variant="h6" component="h3">
          2.3. How the Medicine Should Be Taken? (Route of Administration)
        </SubSectionTitle>
        
        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Abbreviation</TableHeadCell>
                  <TableHeadCell>Meaning</TableHeadCell>
                  <TableHeadCell>Example</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>PO</TableCell>
                  <TableCell>By mouth (Orally)</TableCell>
                  <TableCell>Take 1 tablet PO</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SL</TableCell>
                  <TableCell>Sublingual (under the tongue)</TableCell>
                  <TableCell>Place 1 tablet SL</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IM</TableCell>
                  <TableCell>Intramuscular injection</TableCell>
                  <TableCell>Take 1 Inj IM</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IV</TableCell>
                  <TableCell>Intravenous injection</TableCell>
                  <TableCell>Give 1 Inj IV</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SC</TableCell>
                  <TableCell>Subcutaneous injection</TableCell>
                  <TableCell>Give 1 dose SC</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TOP</TableCell>
                  <TableCell>Topical (apply on the skin)</TableCell>
                  <TableCell>Apply cream TOP</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PR</TableCell>
                  <TableCell>Per rectum (rectally)</TableCell>
                  <TableCell>Use PR as directed</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        {/* 2.4 Common Drug Forms */}
        <SubSectionTitle variant="h6" component="h3">
          2.4. Common Drug Forms (Type of Medication Prescribed)
        </SubSectionTitle>
        
        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Abbreviation</TableHeadCell>
                  <TableHeadCell>Meaning</TableHeadCell>
                  <TableHeadCell>Example</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Tab</TableCell>
                  <TableCell>Tablet</TableCell>
                  <TableCell>Take 1 Tab</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cap</TableCell>
                  <TableCell>Capsule</TableCell>
                  <TableCell>Take 1 Cap</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Syp</TableCell>
                  <TableCell>Syrup</TableCell>
                  <TableCell>Take 5 mL Syp</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Inj</TableCell>
                  <TableCell>Injection</TableCell>
                  <TableCell>Take 1 Inj</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Oint</TableCell>
                  <TableCell>Ointment</TableCell>
                  <TableCell>Apply Oint to affected area</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Drops</TableCell>
                  <TableCell>Eye, ear, or nasal drops</TableCell>
                  <TableCell>Use 2 Drops in each eye</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        {/* 2.5 Duration of Medication */}
        <SubSectionTitle variant="h6" component="h3">
          2.5. Duration of Medication
        </SubSectionTitle>
        
        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Abbreviation</TableHeadCell>
                  <TableHeadCell>Meaning</TableHeadCell>
                  <TableHeadCell>Example</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>X 5 days</TableCell>
                  <TableCell>For 5 days</TableCell>
                  <TableCell>Take for 5 days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>X 1/12</TableCell>
                  <TableCell>For 1 month</TableCell>
                  <TableCell>Take for 1 month</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>X 2/52</TableCell>
                  <TableCell>For 2 weeks</TableCell>
                  <TableCell>Take for 2 weeks</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        {/* 2.6 Common Medical Terms */}
        <SubSectionTitle variant="h6" component="h3">
          2.6. Common Medical Terms Found in Prescriptions
        </SubSectionTitle>
        
        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Abbreviation</TableHeadCell>
                  <TableHeadCell>Meaning</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>NPO</TableCell>
                  <TableCell>Nothing by mouth (fasting)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>D/C</TableCell>
                  <TableCell>Discontinue</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rx</TableCell>
                  <TableCell>Prescription</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sig</TableCell>
                  <TableCell>Directions for use</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>q.h.</TableCell>
                  <TableCell>Every hour</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>q2h, q4h, q6h</TableCell>
                  <TableCell>Every 2 hours, 4 hours, 6 hours</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>

        {/* 3. Additional Tips */}
        <SectionTitle variant="h5" component="h2" sx={{ mt: 6 }}>
          3. Additional Tips for Reading a Prescription
        </SectionTitle>
        
        <StyledPaper>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="If handwriting is unclear, consult a pharmacist before buying or consuming medicine."
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Dosage is very important – verify with your doctor if the strength seems incorrect."
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Do not self-medicate – always follow a doctor's advice before taking prescription medicines."
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Storage matters – some medicines need refrigeration, others should be kept away from sunlight."
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          </List>
        </StyledPaper>

        {/* Call to Action */}
        <Box 
          sx={{ 
            mt: 6, 
            p: 4, 
            borderRadius: 2, 
            bgcolor: 'rgba(0, 128, 128, 0.08)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom color="primary.main">
            Need Help Understanding Your Prescription?
          </Typography>
          <Typography variant="body1" paragraph>
            MedGenix is here to help you understand your prescriptions, find generic alternatives, and manage your medications efficiently.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            href="/upload-prescription"
            sx={{ mt: 2, px: 4 }}
          >
            Upload Your Prescription Now
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default PrescriptionGuidePage; 