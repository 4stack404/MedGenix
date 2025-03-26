import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Typography, Skeleton } from '@mui/material';

/**
 * Component for displaying translated text
 * 
 * @param {Object} props
 * @param {string} props.children - The text to translate
 * @param {string} props.component - MUI Typography component (e.g., 'h1', 'body1')
 * @param {Object} props.sx - MUI styling object
 * @param {Object} props.rest - Other props to pass to Typography
 * @returns {JSX.Element}
 */
const TranslatedText = ({ children, component = 'span', sx = {}, ...rest }) => {
  const { language, translateText } = useLanguage();
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the text is empty or language is English (default), skip translation
    if (!children || language === 'en') {
      setTranslatedText(children);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const translate = async () => {
      try {
        setLoading(true);
        const result = await translateText(children);
        if (isMounted) {
          setTranslatedText(result);
          setLoading(false);
        }
      } catch (error) {
        console.error('Translation error:', error);
        if (isMounted) {
          setTranslatedText(children); // Fallback to original text
          setLoading(false);
        }
      }
    };

    translate();

    return () => {
      isMounted = false;
    };
  }, [children, language, translateText]);

  if (loading) {
    return (
      <Skeleton 
        width={typeof children === 'string' ? `${Math.min(children.length * 8, 300)}px` : '100%'} 
        height="1em"
        sx={{ ...sx, display: 'inline-block' }}
      />
    );
  }

  return (
    <Typography component={component} sx={sx} {...rest}>
      {translatedText || children}
    </Typography>
  );
};

export default TranslatedText; 