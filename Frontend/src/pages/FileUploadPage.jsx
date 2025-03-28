import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  CircularProgress, 
  Alert, 
  AlertTitle, 
  styled,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../styles/FileUpload.css';

// Styled components for better UI
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  height: '100%',
}));

const UploadZone = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(4),
  border: '2px dashed #008080',
  borderRadius: 16,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(0, 128, 128, 0.03)',
  '&:hover': {
    borderColor: '#67c27c',
    backgroundColor: 'rgba(103, 194, 124, 0.08)',
  },
}));

// New styled components for guidelines
const GuideBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  height: '100%',
}));

const PrescriptionExample = styled(Box)(({ theme }) => ({
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#ffffff',
}));

const AnnotationLabel = styled(Typography)(({ theme }) => ({
  color: '#ff7675',
  fontSize: '0.8rem',
  fontWeight: 500,
  marginBottom: theme.spacing(1),
}));

const ExampleField = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  borderBottom: '1px dotted #e0e0e0',
  color: '#666',
  fontSize: '0.8rem',
}));

const DottedDivider = styled(Box)(({ theme }) => ({
  borderBottom: '1px dotted #e0e0e0',
  width: '100%',
  margin: theme.spacing(1, 0),
}));

const RequirementsList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const PrescriptionUploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [prescriptionResult, setPrescriptionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const navigate = useNavigate();

  // Define API backend URL
  const API_URL = 'http://localhost:8000/api';
  const OCR_API_URL = 'http://localhost:8000/api/ocr';

  // Cleanup function for blob URLs
  const cleanupBlobUrl = (url) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    // Clean up preview URL when component unmounts or when previewUrl changes
    return () => {
      cleanupBlobUrl(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setFile(null);
        cleanupBlobUrl(previewUrl);
        setPreviewUrl(null);
        return;
      }
      
      // Check file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        setFile(null);
        cleanupBlobUrl(previewUrl);
        setPreviewUrl(null);
        return;
      }
      
      // Clean up previous blob URL if it exists
      cleanupBlobUrl(previewUrl);
      
      // Create new preview URL
      const filePreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(filePreviewUrl);
      setFile(selectedFile);
      setError(null);
    }
    
    setUploadStatus('');
    setPrescriptionResult(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a prescription image first');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    
    // Add diagnosis information if provided
    if (diagnosis.trim()) {
      formData.append('diagnosis', diagnosis.trim());
    }

    try {
      // Use the process-ocr endpoint
      const endpoint = `${API_URL}/process-ocr`;
      
      console.log('Uploading prescription to endpoint:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for session
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error response:', errorData);
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        
        throw new Error(
          `Error ${errorData.status || response.status}: ${errorData.message || errorData.error || 'Unknown error'}`
        );
      }
      
      const data = await response.json();
      console.log('Upload success response:', data);
      
      // Store the result
      setPrescriptionResult(data);
      setUploadStatus('Prescription processed successfully');
      
      // Use the prescriptionId from the backend
      const prescriptionId = data.prescriptionId;
      
      // Save the data to sessionStorage for use on the results page
      const prescriptionData = {
        id: prescriptionId,
        imageUrl: data.cloudinaryUrl,
        diagnosis: diagnosis.trim() || '',
        result: {
          medicines: data.medicines || [],
          original_text: data.original_text || ''
        },
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      // Store in sessionStorage
      sessionStorage.setItem(`prescription_${prescriptionId}`, JSON.stringify(prescriptionData));
      
      // Redirect to the prescription details page
      navigate(`/prescription/${prescriptionId}`);
      
    } catch (error) {
      console.error('Upload Error:', error);
      setError(error.message || 'Error processing prescription');
      setUploadStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 8, 
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          backgroundImage: 'linear-gradient(120deg, #f8f9fa 0%, #e9f7ef 100%)'
        }}
      >
        <Container maxWidth="lg" className="file-upload-container">
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              mb: 4
            }}
          >
            Prescription Upload
          </Typography>
          
          <Grid container spacing={4}>
            {/* Left side - Upload form */}
            <Grid item xs={12} md={5}>
              <UploadPaper elevation={3}>
                <Typography 
                  variant="body1" 
                  color="textSecondary" 
                  align="center" 
                  sx={{ mb: 4 }}
                >
                  Upload your prescription image to extract medicine information
                </Typography>
                
                <Box component="form" onSubmit={handleUpload} sx={{ width: '100%' }}>
                  {previewUrl ? (
                    <Box sx={{ mb: 3 }}>
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 1, 
                          borderRadius: 2,
                          position: 'relative'
                        }}
                      >
                        <img 
                          src={previewUrl} 
                          alt="Prescription preview" 
                          style={{ 
                            width: '100%', 
                            height: 'auto', 
                            borderRadius: 8,
                            display: 'block'
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={() => {
                            setFile(null);
                            setPreviewUrl(null);
                          }}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: 'rgba(255,255,255,0.7)',
                            minWidth: 'auto',
                            p: 0.5
                          }}
                        >
                          ✕
                        </Button>
                      </Paper>
                      
                      {/* Diagnosis input - only shown after file selection */}
                      <Box sx={{ mt: 3, mb: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(0, 128, 128, 0.05)', border: '1px solid rgba(0, 128, 128, 0.1)' }}>
                        <Typography variant="subtitle2" gutterBottom color="primary" sx={{ fontWeight: 500 }}>
                          Optional: What condition is being treated? (Recommended)
                        </Typography>
                        
                        <input
                          type="text"
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          placeholder="E.g. Diabetes, Hypertension, Thyroid, etc."
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            marginTop: '8px',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}
                        />
                        
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                          <span style={{ marginRight: '4px' }}>ℹ️</span>
                          <span>Providing this information helps our system better identify the correct medicines in your prescription, as certain medications are commonly prescribed for specific conditions.</span>
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      component="label"
                      sx={{ width: '100%', mb: 3 }}
                    >
                      <UploadZone>
                        <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" color="primary.main" gutterBottom>
                          Upload Prescription Image
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Drag & drop a file here or click to browse
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                          Supported formats: JPG, PNG, GIF (max 5MB)
                        </Typography>
                        <VisuallyHiddenInput 
                          type="file" 
                          onChange={handleFileChange} 
                          accept="image/*" 
                        />
                      </UploadZone>
                    </Button>
                  )}
                  
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading || !file}
                    className="upload-button"
                    sx={{ 
                      width: '100%', 
                      py: 1.5,
                      mb: 2,
                      borderRadius: '8px',
                      boxShadow: '0 4px 10px rgba(0, 128, 128, 0.2)'
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                        Processing Prescription...
                      </Box>
                    ) : 'Process Prescription'}
                  </Button>
                </Box>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                  </Alert>
                )}
                
                {uploadStatus && (
                  <Alert severity="success" sx={{ mb: 3, width: '100%' }}>
                    {uploadStatus}
                  </Alert>
                )}
              </UploadPaper>
            </Grid>
            
            {/* Right side - Guidelines */}
            <Grid item xs={12} md={7}>
              <GuideBox>
                <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
                  Guide for a valid prescription
                </Typography>

                <PrescriptionExample>
                  {/* Doctor's Details Section */}
                  <Box sx={{ mb: 2 }}>
                    <AnnotationLabel>Doctor's details</AnnotationLabel>
                    <ExampleField>Dr. Varun, MBBS, MD</ExampleField>
                    <ExampleField>Name of Hospital / Clinic</ExampleField>
                    <ExampleField>Address of Hospital / Clinic</ExampleField>
                    <ExampleField>Regd. No.</ExampleField>
                  </Box>

                  {/* Patient's Details Section */}
                  <Box sx={{ mb: 2 }}>
                    <AnnotationLabel>Patient's details</AnnotationLabel>
                    <Grid container spacing={0}>
                      <Grid item xs={6}>
                        <ExampleField>Name of Patient</ExampleField>
                        <ExampleField>Address of Patient</ExampleField>
                      </Grid>
                      <Grid item xs={6}>
                        <ExampleField>Age</ExampleField>
                        <ExampleField>Date of consultation</ExampleField>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Medicine Details Section */}
                  <Box sx={{ mb: 2 }}>
                    <AnnotationLabel>Medicine details</AnnotationLabel>
                    <Grid container spacing={0}>
                      <Grid item xs={3}><Typography variant="caption">Medicine Name</Typography></Grid>
                      <Grid item xs={3}><Typography variant="caption">Strength</Typography></Grid>
                      <Grid item xs={3}><Typography variant="caption">Dose</Typography></Grid>
                      <Grid item xs={3}><Typography variant="caption">Duration</Typography></Grid>
                    </Grid>
                    <DottedDivider />
                    <Grid container spacing={0}>
                      <Grid item xs={3}><Typography variant="caption">E.g. Metformin</Typography></Grid>
                      <Grid item xs={3}><Typography variant="caption">500mg</Typography></Grid>
                      <Grid item xs={3}><Typography variant="caption">1-0-1</Typography></Grid>
                      <Grid item xs={3}><Typography variant="caption">6 months</Typography></Grid>
                    </Grid>
                  </Box>

                  {/* Doctor's Sign Section */}
                  <Box>
                    <AnnotationLabel>Doctor's sign + stamp</AnnotationLabel>
                    <Box sx={{ 
                      border: '1px dashed #ccc', 
                      p: 1, 
                      textAlign: 'center',
                      color: '#666',
                      fontStyle: 'italic',
                      fontSize: '0.75rem'
                    }}>
                      Doctor's Signature & Stamp
                    </Box>
                  </Box>
                </PrescriptionExample>

                <RequirementsList>
                  <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>
                    • Don't crop out any part of the image
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>
                    • Avoid blurred image
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>
                    • Include details of doctor and patient + clinic visit date
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>
                    • Medicines will be dispensed as per prescription
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>
                    • Supported files type: jpeg, jpg, png, pdf
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>
                    • Maximum allowed file size: 5MB
                  </Typography>
                </RequirementsList>
              </GuideBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default PrescriptionUploadPage; 