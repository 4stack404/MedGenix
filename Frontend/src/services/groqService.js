import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getMedicineDosages = async (medicineName) => {
  try {
    console.log('Fetching dosages for generic medicine:', medicineName);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a medical expert assistant specializing in generic medicines. Provide ONLY the standard tablet/capsule dosages available in milligrams (mg). Do not include complex dosing regimens, weight-based doses, or doses in other units (mcg, g, etc). Format the response as a JSON array of objects with 'strength' property only. For example, for Paracetamol: [{\"strength\": \"500mg\"}, {\"strength\": \"650mg\"}, {\"strength\": \"1000mg\"}]. For medicines without standard mg dosages, return an empty array []."
        },
        {
          role: "user",
          content: `What are the standard tablet/capsule dosages available for the generic medicine ${medicineName}? Please provide ONLY the common dosages in milligrams (mg). Do not include complex dosing regimens or doses in other units.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      stream: false
    });

    console.log('Raw Groq API Response:', chatCompletion);
    
    // Get the content from the response
    const content = chatCompletion.choices[0].message.content;
    console.log('Parsed content from response:', content);
    
    const dosages = JSON.parse(content);
    console.log('Final parsed dosages:', dosages);
    
    // If no valid dosages found, return default dosages
    if (!Array.isArray(dosages) || dosages.length === 0) {
      return [
        { strength: '1mg' },
        { strength: '2mg' },
        { strength: '5mg' },
        { strength: '10mg' },
        { strength: '50mg' }
      ];
    }
    
    return dosages;
  } catch (error) {
    console.error('Error fetching medicine dosages from Groq:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    // Return default dosages if API call fails
    return [
      { strength: '1mg' },
      { strength: '2mg' },
      { strength: '5mg' },
      { strength: '10mg' },
      { strength: '50mg' }
    ];
  }
}; 