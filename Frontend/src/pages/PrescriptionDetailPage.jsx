import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Divider,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  keyframes
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MedicationIcon from '@mui/icons-material/Medication';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InfoIcon from '@mui/icons-material/Info';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Keyframes for shine effect
const shineAnimation = keyframes`
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
`;

// Keyframes for pulsate effect
const pulsateAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
`;

// Keyframes for attention animation
const attentionAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-5px);
  }
  25% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
  35% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
`;

const PrescriptionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedMedicine, setEditedMedicine] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Notification state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Chat bot state
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hello! I can answer questions about your prescription. You can also click the "Save Money with Generic Alternatives" button to find more affordable options for your medicines.' 
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // New state variables
  const [generatingAlternatives, setGeneratingAlternatives] = useState(false);
  const [genericAlternatives, setGenericAlternatives] = useState(null);
  
  // Add a new function to handle medicine deletion
  const handleDeleteMedicine = (medicineToDelete) => {
    // Confirm before deleting
    if (window.confirm(`Are you sure you want to remove ${medicineToDelete.brand_name} from this prescription?`)) {
      // Remove the medicine from the prescriptionData state
      const updatedMedicines = prescriptionData.result.medicines.filter(
        med => med.brand_name !== medicineToDelete.brand_name
      );
      
      // Create updated prescription data
      const updatedPrescriptionData = {
        ...prescriptionData,
        result: {
          ...prescriptionData.result,
          medicines: updatedMedicines
        }
      };
      
      // Update state
      setPrescriptionData(updatedPrescriptionData);
      
      // Also update sessionStorage to persist changes
      sessionStorage.setItem('prescriptionData', JSON.stringify(updatedPrescriptionData));
      
      // Show success message
      showNotification(`${medicineToDelete.brand_name} has been removed from your prescription`);
    }
  };

  // Add a new function to open an add medicine dialog
  const [addMedicineDialogOpen, setAddMedicineDialogOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    brand_name: '',
    dosage: '',
    frequency: '',
    duration: ''
  });

  const handleAddMedicineDialogOpen = () => {
    setAddMedicineDialogOpen(true);
  };

  const handleAddMedicineDialogClose = () => {
    setAddMedicineDialogOpen(false);
    setNewMedicine({
      brand_name: '',
      dosage: '',
      frequency: '',
      duration: ''
    });
  };

  const handleNewMedicineChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMedicine = () => {
    if (!newMedicine.brand_name) {
      showNotification('Medicine name is required', 'error');
      return;
    }

    // Add the new medicine to the prescriptionData state
    const updatedMedicines = [...prescriptionData.result.medicines, newMedicine];
    
    // Create updated prescription data
    const updatedPrescriptionData = {
      ...prescriptionData,
      result: {
        ...prescriptionData.result,
        medicines: updatedMedicines
      }
    };
    
    // Update state
    setPrescriptionData(updatedPrescriptionData);
    
    // Also update sessionStorage to persist changes
    sessionStorage.setItem('prescriptionData', JSON.stringify(updatedPrescriptionData));
    
    // Close dialog and show success message
    handleAddMedicineDialogClose();
    showNotification(`${newMedicine.brand_name} has been added to your prescription`);
  };
  
  // Function to scroll chat container to bottom
  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    // Small timeout to ensure DOM has updated
    const timeoutId = setTimeout(() => {
      scrollChatToBottom();
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [chatMessages]);
  
  useEffect(() => {
    // In a real application, we would fetch this data from an API
    // For now, we'll get it from sessionStorage
    try {
      const data = JSON.parse(sessionStorage.getItem('prescriptionData'));
      if (data && data.id === id) {
        // Verify that the imageUrl is a valid base64 string
        if (data.imageUrl && data.imageUrl.startsWith('data:image/')) {
          setPrescriptionData(data);
        } else {
          setError('Invalid prescription image data');
        }
      } else {
        setError('Prescription not found');
      }
    } catch (err) {
      setError('Error loading prescription data');
      console.error('Error parsing prescription data:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  const handleMedicineClick = (medicine) => {
    // Navigate to medicine detail page
    console.log('Navigating to medicine page for:', medicine.brand_name);
    navigate(`/medicine/${encodeURIComponent(medicine.brand_name)}`);
  };
  
  const handleEditMedicine = (medicine) => {
    // Open edit dialog with the medicine data
    setEditingMedicine(medicine.brand_name);
    setEditedMedicine({...medicine});
    setEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingMedicine(null);
    setEditedMedicine(null);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  const showNotification = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (!editedMedicine) return;
    
    setIsSaving(true);
    
    // Simulate API call to save changes
    setTimeout(() => {
      // Update the medicine in the prescriptionData state
      const updatedMedicines = prescriptionData.result.medicines.map(med => 
        med.brand_name === editingMedicine ? editedMedicine : med
      );
      
      // Create updated prescription data
      const updatedPrescriptionData = {
        ...prescriptionData,
        result: {
          ...prescriptionData.result,
          medicines: updatedMedicines
        }
      };
      
      // Update state
      setPrescriptionData(updatedPrescriptionData);
      
      // Also update sessionStorage to persist changes
      sessionStorage.setItem('prescriptionData', JSON.stringify(updatedPrescriptionData));
      
      // Close dialog
      setIsSaving(false);
      setEditDialogOpen(false);
      setEditingMedicine(null);
      setEditedMedicine(null);
      
      // Show success message
      showNotification(`${editedMedicine.brand_name} has been updated successfully`);
      console.log('Medicine updated:', editedMedicine);
    }, 1000);
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedMedicine(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };
  
  const handleSendMessage = (e) => {
    // Prevent the default form submission behavior which might cause the page to scroll
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Store current scroll position
    const scrollPosition = window.scrollY;
    
    // Add user message to chat
    const userMessage = { sender: 'user', text: userInput.trim() };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput('');
    setIsBotTyping(true);
    
    // Scroll only the chat container
    scrollChatToBottom();
    
    // Restore page scroll position if needed
    if (window.scrollY !== scrollPosition) {
      window.scrollTo({ top: scrollPosition });
    }
    
    // Process the message and respond
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.text, prescriptionData);
      setChatMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botResponse }]);
      setIsBotTyping(false);
      
      // Scroll the chat container again after bot response
      setTimeout(scrollChatToBottom, 100);
    }, 1000);
  };
  
  // Generate bot response based on user input and prescription data
  const generateBotResponse = (userMessage, data) => {
    const { result } = data || {};
    const { medicines = [], original_text = '' } = result || {};
    const lowercaseMsg = userMessage.toLowerCase();
    
    // Add generic alternatives responses
    if (lowercaseMsg.includes('generic') || lowercaseMsg.includes('alternative') || lowercaseMsg.includes('cheaper') || lowercaseMsg.includes('save money')) {
      return "You can find generic alternatives by clicking the green 'Save Money with Generic Alternatives' button at the top of the medicines list. Generic medicines have the same active ingredients as brand-name medicines but often cost much less.";
    }
    
    // Basic response logic
    if (lowercaseMsg.includes('medicine') || lowercaseMsg.includes('medication') || lowercaseMsg.includes('drug')) {
      if (medicines.length === 0) {
        return "I couldn't find any medicines in your prescription.";
      }
      return `Your prescription contains ${medicines.length} medicines: ${medicines.map(m => m.brand_name).join(', ')}. You can find more affordable generic alternatives by clicking the green button above the medicines list.`;
    }
    
    if (lowercaseMsg.includes('dosage') || lowercaseMsg.includes('dose')) {
      if (medicines.length === 0) {
        return "I couldn't find any dosage information in your prescription.";
      }
      return medicines.map(m => `${m.brand_name}: ${m.dosage || 'Dosage not specified'}`).join('\n');
    }
    
    if (lowercaseMsg.includes('frequency') || lowercaseMsg.includes('often') || lowercaseMsg.includes('when')) {
      if (medicines.length === 0) {
        return "I couldn't find any frequency information in your prescription.";
      }
      return medicines.map(m => `${m.brand_name}: ${m.frequency || 'Frequency not specified'}`).join('\n');
    }
    
    if (lowercaseMsg.includes('duration') || lowercaseMsg.includes('how long') || lowercaseMsg.includes('days')) {
      if (medicines.length === 0) {
        return "I couldn't find any duration information in your prescription.";
      }
      return medicines.map(m => `${m.brand_name}: ${m.duration || 'Duration not specified'}`).join('\n');
    }
    
    if (lowercaseMsg.includes('what') && lowercaseMsg.includes('for')) {
      return "I'm sorry, I don't have information about what each medicine is for. Please consult your doctor or pharmacist for this information.";
    }
    
    if (lowercaseMsg.includes('side effect') || lowercaseMsg.includes('risks')) {
      return "I don't have information about side effects. Please consult your doctor, pharmacist, or the medicine package insert for side effect information.";
    }
    
    if (lowercaseMsg.includes('thank')) {
      return "You're welcome! Is there anything else you'd like to know about your prescription? Remember, you can also check for generic alternatives to save money.";
    }
    
    if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
      return "Hello! How can I help you with your prescription today? I can tell you about your medicines or help you find generic alternatives to save money.";
    }
    
    // Default response
    return "I'm not sure how to answer that. You can ask me about the medicines in your prescription, their dosages, frequency, or click the green button to find generic alternatives that could save you money.";
  };
  
  const handleGenerateAlternatives = () => {
    setGeneratingAlternatives(true);
    
    // Save the current medicines to sessionStorage
    const medicinesList = prescriptionData.result.medicines.map(medicine => ({
      brand_name: medicine.brand_name,
      dosage: medicine.dosage || '',
      frequency: medicine.frequency || '',
      duration: medicine.duration || ''
    }));
    
    // Store in sessionStorage for the comparison page
    sessionStorage.setItem('prescriptionMedicines', JSON.stringify(medicinesList));
    
    // Redirect to the comparison page after a brief delay to show loading state
    setTimeout(() => {
      navigate('/compare-medicines');
    }, 1000);
  };
  
  const handleUseOriginals = () => {
    setGenericAlternatives(null);
    showNotification('Switched back to original prescription');
  };
  
  // Right column - Extracted medicines section
  const renderMedicinesSection = () => {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ fontWeight: 600, mb: 2 }}
          >
            {genericAlternatives 
              ? 'Generic Alternatives' 
              : `Prescription Medicines (${medicines.length})`}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2 
          }}>
            {!genericAlternatives && !generatingAlternatives && medicines.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateAlternatives}
                disabled={generatingAlternatives}
                startIcon={generatingAlternatives ? <CircularProgress size={24} /> : <CompareArrowsIcon />}
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                {generatingAlternatives ? 'Generating...' : 'Show Generic Options'}
              </Button>
            )}
            
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddMedicineDialogOpen}
              startIcon={<MedicationIcon />}
              sx={{ 
                ml: 'auto',
                borderRadius: 2
              }}
            >
              Add Medicine
            </Button>
          </Box>

          {genericAlternatives && (
            <Box sx={{ mb: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'success.light',
                  color: 'success.dark',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoneyIcon sx={{ mr: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Potential savings with generic alternatives
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  color="inherit"
                  onClick={handleUseOriginals}
                  startIcon={<CompareArrowsIcon />}
                >
                  Show Original
                </Button>
              </Paper>
            </Box>
          )}
          
          {generatingAlternatives && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <CircularProgress size={40} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Generating affordable alternatives...
              </Typography>
            </Box>
          )}
        </Box>
        
        {!generatingAlternatives && displayedMedicines.length === 0 ? (
          <Alert severity="info">No medicines were extracted from this prescription.</Alert>
        ) : !generatingAlternatives && (
          <Grid container spacing={2}>
            {displayedMedicines.map((medicine, index) => (
              <Grid item xs={12} key={index}>
                <Card 
                  sx={{ 
                    mb: 2, 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transform: 'translateY(-2px)'
                    },
                    border: medicine.is_generic ? '1px solid #4caf50' : 'none',
                    bgcolor: medicine.is_generic ? 'rgba(76, 175, 80, 0.04)' : 'white'
                  }}
                >
                  <Box
                    onClick={() => handleMedicineClick(medicine)}
                    sx={{ 
                      cursor: 'pointer',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.03)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        pointerEvents: 'none'
                      },
                      '&:hover::after': {
                        opacity: 1
                      }
                    }}
                  >
                    <CardContent>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1
                        }}
                      >
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              color: medicine.is_generic ? '#2e7d32' : 'primary.main',
                            }}
                          >
                            {medicine.brand_name}
                            {medicine.is_generic && (
                              <Chip
                                label="Generic"
                                size="small"
                                color="success"
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </Typography>
                          
                          {medicine.is_generic && medicine.original_brand && (
                            <Typography variant="caption" color="text.secondary">
                              Alternative to {medicine.original_brand}
                            </Typography>
                          )}
                        </Box>
                        
                        {medicine.is_generic && medicine.savings_percentage && (
                          <Chip 
                            label={`Save ${medicine.savings_percentage}`} 
                            color="success" 
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                            icon={<AttachMoneyIcon style={{ fontSize: 16 }} />}
                          />
                        )}
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Grid container spacing={2}>
                        {medicine.dosage && (
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <MedicationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                Dosage
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {medicine.dosage}
                            </Typography>
                          </Grid>
                        )}
                        
                        {medicine.frequency && (
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                Frequency
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {medicine.frequency}
                            </Typography>
                          </Grid>
                        )}
                        
                        {medicine.price && (
                          <Grid item xs={12}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              mt: 1,
                              p: 1,
                              bgcolor: medicine.is_generic ? 'rgba(76, 175, 80, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                              borderRadius: 1
                            }}>
                              <Typography 
                                variant="body2" 
                                color={medicine.is_generic ? 'success.main' : 'text.secondary'} 
                                fontWeight="medium"
                              >
                                <AttachMoneyIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                Estimated Price: ${medicine.price}
                              </Typography>
                              
                              {medicine.is_generic && medicine.original_brand && (
                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                  {medicine.savings_percentage} lower
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Box>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click from bubbling to the card
                        handleEditMedicine(medicine);
                      }}
                      disabled={editingMedicine === medicine.brand_name}
                    >
                      {editingMedicine === medicine.brand_name ? (
                        <>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Editing...
                        </>
                      ) : 'Edit'}
                    </Button>
                    
                    {!medicine.is_generic && !genericAlternatives && (
                      <Button
                        size="small"
                        startIcon={<LocalPharmacyIcon />}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from bubbling to the card
                          
                          // Create a list with just this medicine to pass to the comparison page
                          const singleMedicineList = [{
                            brand_name: medicine.brand_name,
                            dosage: medicine.dosage || '',
                            frequency: medicine.frequency || '',
                            duration: medicine.duration || ''
                          }];
                          
                          // Store in sessionStorage for the comparison page
                          sessionStorage.setItem('prescriptionMedicines', JSON.stringify(singleMedicineList));
                          
                          // Navigate to comparison page
                          setTimeout(() => {
                            navigate('/compare-medicines');
                          }, 100);
                        }}
                        sx={{ 
                          ml: 'auto',
                          color: 'primary.main',
                          fontWeight: 'medium',
                          '&:hover': {
                            bgcolor: 'rgba(25, 118, 210, 0.08)'
                          }
                        }}
                      >
                        Find Generic
                      </Button>
                    )}

                    <Button
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click from bubbling to the card
                        handleDeleteMedicine(medicine);
                      }}
                      color="error"
                      sx={{ ml: 'auto' }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    );
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh' 
          }}
        >
          <CircularProgress />
        </Box>
        <Footer />
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
        <Footer />
      </>
    );
  }
  
  const { imageUrl, result } = prescriptionData || {};
  const { medicines = [], original_text = '' } = result || {};
  
  // Common frequencies for the dropdown
  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every morning",
    "Every night",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "With meals",
    "Before meals",
    "After meals"
  ];
  
  // Common dosage units for the dropdown
  const dosageUnits = ["mg", "g", "mcg", "ml", "tablet(s)", "capsule(s)", "drop(s)", "puff(s)"];
  
  // Decide which medicines to show based on whether alternatives are available
  const displayedMedicines = genericAlternatives || medicines;
  
  return (
    <>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 8, 
          backgroundColor: '#f8f9fa',
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ fontWeight: 700, mb: 4, color: 'primary.main' }}
          >
            Prescription Analysis Results
          </Typography>
          
          <Grid container spacing={4}>
            {/* Left column - Prescription image and chat bot */}
            <Grid item xs={12} md={5}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  Original Prescription
                </Typography>
                
                {imageUrl && (
                  <Box sx={{ mb: 3 }}>
                    <img 
                      src={imageUrl} 
                      alt="Prescription" 
                      style={{ 
                        width: '100%', 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </Box>
                )}
                
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1, 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}
                >
                  <SmartToyIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Talk to your prescription
                </Typography>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 1,
                    backgroundColor: '#f5f5f5',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '300px'
                  }}
                >
                  <Box 
                    ref={chatContainerRef}
                    sx={{ 
                      flexGrow: 1, 
                      overflowY: 'auto',
                      mb: 2,
                      p: 1,
                      scrollBehavior: 'smooth',
                      id: 'chat-messages-container'
                    }}
                  >
                    <List sx={{ width: '100%', p: 0 }}>
                      {chatMessages.map((message, index) => (
                        <ListItem 
                          key={index} 
                          alignItems="flex-start"
                          sx={{ 
                            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                            p: 0.5
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                              alignItems: 'flex-start',
                              maxWidth: '85%'
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                                width: 32,
                                height: 32,
                                mr: message.sender === 'user' ? 0 : 1,
                                ml: message.sender === 'user' ? 1 : 0
                              }}
                            >
                              {message.sender === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                            </Avatar>
                            <Paper
                              elevation={1}
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: message.sender === 'user' ? 'primary.light' : 'white',
                                color: message.sender === 'user' ? 'white' : 'text.primary'
                              }}
                            >
                              <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                                {message.text}
                              </Typography>
                            </Paper>
                          </Box>
                        </ListItem>
                      ))}
                      {isBotTyping && (
                        <ListItem alignItems="flex-start" sx={{ p: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: 'secondary.main',
                                width: 32,
                                height: 32,
                                mr: 1
                              }}
                            >
                              <SmartToyIcon fontSize="small" />
                            </Avatar>
                            <Paper
                              elevation={1}
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'white'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={16} sx={{ mr: 1 }} />
                                <Typography variant="body2">Typing...</Typography>
                              </Box>
                            </Paper>
                          </Box>
                        </ListItem>
                      )}
                    </List>
                  </Box>
                  <Box 
                    component="form" 
                    onSubmit={handleSendMessage}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center' 
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Ask about your prescription..."
                      value={userInput}
                      onChange={handleUserInput}
                      variant="outlined"
                      sx={{ 
                        mr: 1,
                        backgroundColor: 'white',
                        borderRadius: 1
                      }}
                    />
                    <IconButton 
                      color="primary" 
                      type="submit"
                      disabled={!userInput.trim() || isBotTyping}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark'
                        },
                        '&.Mui-disabled': {
                          bgcolor: 'action.disabledBackground',
                          color: 'action.disabled'
                        }
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Paper>
            </Grid>
            
            {/* Right column - Extracted medicines */}
            <Grid item xs={12} md={7}>
              {renderMedicinesSection()}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
      
      {/* Edit Medicine Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit Medicine</Typography>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleCloseEditDialog} 
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {editedMedicine && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="brand_name"
                  name="brand_name"
                  label="Medicine Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={editedMedicine.brand_name || ''}
                  onChange={handleEditChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  id="dosage"
                  name="dosage"
                  label="Dosage"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={editedMedicine.dosage || ''}
                  onChange={handleEditChange}
                  InputProps={{
                    endAdornment: (
                      <FormControl variant="standard" sx={{ minWidth: 70 }}>
                        <Select
                          value={editedMedicine.dosage?.replace(/[0-9\s.]/g, '') || 'mg'}
                          onChange={(e) => {
                            const numericPart = editedMedicine.dosage?.match(/[0-9.]+/)?.[0] || '';
                            setEditedMedicine(prev => ({
                              ...prev,
                              dosage: `${numericPart}${e.target.value}`
                            }));
                          }}
                          sx={{ border: 'none' }}
                        >
                          {dosageUnits.map(unit => (
                            <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="frequency-label">Frequency</InputLabel>
                  <Select
                    labelId="frequency-label"
                    id="frequency"
                    name="frequency"
                    value={editedMedicine.frequency || ''}
                    onChange={handleEditChange}
                    label="Frequency"
                  >
                    {frequencyOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                    <MenuItem value="custom">
                      <em>Custom</em>
                    </MenuItem>
                  </Select>
                </FormControl>
                {editedMedicine.frequency === 'custom' && (
                  <TextField
                    margin="dense"
                    name="frequency"
                    label="Custom Frequency"
                    type="text"
                    fullWidth
                    variant="outlined"
                    placeholder="Enter custom frequency"
                    onChange={handleEditChange}
                    sx={{ mt: 2 }}
                  />
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseEditDialog} 
            color="inherit"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} /> : null}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleOutlineIcon sx={{ mr: 1 }} />
            {snackbarMessage}
          </Box>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: 'success.main',
            color: 'white'
          }
        }}
      />

      {/* Add Medicine Dialog */}
      <Dialog open={addMedicineDialogOpen} onClose={handleAddMedicineDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Medicine</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="brand_name"
                  label="Medicine Name"
                  value={newMedicine.brand_name}
                  onChange={handleNewMedicineChange}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="dosage"
                  label="Dosage"
                  value={newMedicine.dosage}
                  onChange={handleNewMedicineChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  placeholder="e.g. 500mg"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    name="frequency"
                    value={newMedicine.frequency}
                    onChange={handleNewMedicineChange}
                    label="Frequency"
                  >
                    {frequencyOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="duration"
                  label="Duration"
                  value={newMedicine.duration}
                  onChange={handleNewMedicineChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  placeholder="e.g. 5 days"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddMedicineDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleAddMedicine} 
            variant="contained" 
            color="primary"
            disabled={!newMedicine.brand_name}
          >
            Add Medicine
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PrescriptionDetailPage; 