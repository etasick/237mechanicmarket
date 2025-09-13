import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const CreditCardForm = ({ publicKey, amount, onPaymentSuccess, onPaymentError }) => {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focused: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const formRef = useRef(null);

  // Card type detection
  const detectCardType = (number) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^(6011|65|64[4-9]|622)/,
      diners: /^(36|38|30[0-5])/,
      jcb: /^35/
    };
    
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) return type;
    }
    return 'unknown';
  };

  // Input formatting
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const parts = [];
    
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substring(i, i + 4));
    }
    
    return parts.join(' ').substring(0, 19);
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    const [expMonth, expYear] = cardData.expiry.split('/');

    // Card number validation (Luhn algorithm)
    if (!validateLuhn(cardData.number.replace(/\s/g, ''))) {
      newErrors.number = 'Invalid card number';
    }

    // Expiry validation
    if (expMonth && expYear) {
      const month = parseInt(expMonth, 10);
      const year = parseInt(expYear, 10) + 2000; // Convert YY to YYYY
      
      if (month < 1 || month > 12) {
        newErrors.expiry = 'Invalid month';
      } else if (year < now.getFullYear() || 
                (year === now.getFullYear() && month < now.getMonth() + 1)) {
        newErrors.expiry = 'Card expired';
      }
    } else {
      newErrors.expiry = 'Invalid expiration';
    }

    // CVC validation
    const cardType = detectCardType(cardData.number);
    const cvcLength = cardType === 'amex' ? 4 : 3;
    if (cardData.cvc.length !== cvcLength) {
      newErrors.cvc = `CVC must be ${cvcLength} digits`;
    }

    // Name validation
    if (!cardData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Luhn algorithm implementation
  const validateLuhn = (number) => {
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };

  // Encryption
  const encryptData = () => {
    const dataToEncrypt = JSON.stringify({
      number: cardData.number.replace(/\s/g, ''),
      name: cardData.name,
      expiry: cardData.expiry,
      cvc: cardData.cvc
    });
    
    return CryptoJS.AES.encrypt(dataToEncrypt, publicKey).toString();
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  // Handle focus changes for card display
  const handleInputFocus = (e) => {
    setCardData(prev => ({ ...prev, focused: e.target.name }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    if (!validateForm()) {
      setIsProcessing(false);
      return;
    }
    
    try {
      const encryptedData = encryptData();
      const response = await axios.post('/api/process-payment', {
        encryptedData,
        amount,
        metadata: {
          cardType: detectCardType(cardData.number),
          last4: cardData.number.slice(-4)
        }
      });
      
      onPaymentSuccess(response.data);
    } catch (error) {
      onPaymentError(error.response?.data || { message: 'Payment failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Card display component
  const CardDisplay = () => {
    const cardType = detectCardType(cardData.number);
    const cardClasses = `card-display ${cardType} ${cardData.focused ? 'focused-' + cardData.focused : ''}`;
    
    return (
      <div className={cardClasses}>
        <div className="card-chip"></div>
        <div className="card-number">
          {cardData.number || '•••• •••• •••• ••••'}
        </div>
        <div className="card-bottom">
          <div className="card-name">{cardData.name || 'CARDHOLDER NAME'}</div>
          <div className="card-expiry">{cardData.expiry || 'MM/YY'}</div>
        </div>
        <div className="card-type">{cardType.toUpperCase()}</div>
      </div>
    );
  };

  return (
    <div className="credit-card-form">
      <CardDisplay />
      
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="number"
            value={cardData.number}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={errors.number ? 'error' : ''}
          />
          {errors.number && <div className="error-message">{errors.number}</div>}
        </div>
        
        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            name="name"
            value={cardData.name}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="John Doe"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Expiration Date</label>
            <input
              type="text"
              name="expiry"
              value={cardData.expiry}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="MM/YY"
              maxLength={5}
              className={errors.expiry ? 'error' : ''}
            />
            {errors.expiry && <div className="error-message">{errors.expiry}</div>}
          </div>
          
          <div className="form-group">
            <label>CVC</label>
            <input
              type="text"
              name="cvc"
              value={cardData.cvc}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="123"
              maxLength={4}
              className={errors.cvc ? 'error' : ''}
            />
            {errors.cvc && <div className="error-message">{errors.cvc}</div>}
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isProcessing}
          className={`submit-button ${isProcessing ? 'processing' : ''}`}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default CreditCardForm;