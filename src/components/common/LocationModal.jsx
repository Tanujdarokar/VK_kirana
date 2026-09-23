import React, { useState } from 'react';
import { MapPin, X, Check, Navigation, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const POPULAR_CITIES = [
  { name: 'Bengaluru', area: 'Koramangala, Indiranagar, HSR, Whitefield', time: '15 Mins' },
  { name: 'Mumbai', area: 'Bandra, Andheri, Powai, Borivali, Dadar', time: '20 Mins' },
  { name: 'Delhi NCR', area: 'Gurugram, Noida, South Delhi, Dwarka', time: '15 Mins' },
  { name: 'Hyderabad', area: 'Gachibowli, Madhapur, Jubilee Hills, Banjara Hills', time: '20 Mins' },
  { name: 'Chennai', area: 'Adyar, T Nagar, Velachery, Anna Nagar', time: '20 Mins' },
  { name: 'Pune', area: 'Kothrud, Viman Nagar, Hinjewadi, Wakad', time: '15 Mins' },
  { name: 'Ahmedabad', area: 'SG Highway, Vastrapur, Satellite, Navrangpura', time: '20 Mins' },
  { name: 'Kolkata', area: 'Salt Lake, New Town, Park Street, Ballygunge', time: '25 Mins' },
  { name: 'Jaipur', area: 'Malviya Nagar, Vaishali Nagar, Mansarovar', time: '20 Mins' },
  { name: 'Lucknow', area: 'Gomti Nagar, Hazratganj, Aliganj, Indira Nagar', time: '20 Mins' },
  { name: 'Chandigarh', area: 'Sector 17, Sector 35, Mohali, Panchkula', time: '15 Mins' },
  { name: 'Indore', area: 'Vijay Nagar, Palasia, Rajwada, Annapurna', time: '15 Mins' }
];

export const LocationModal = ({ isOpen, onClose, selectedLocation, onSelectLocation }) => {
  const [pincode, setPincode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { showSuccess, showError } = useToast();

  if (!isOpen) return null;

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      onSelectLocation({
        city: 'Local Kirana Area',
        pincode: pincode,
        time: '15-20 Mins'
      });
      showSuccess(`Delivery location set to PIN ${pincode}`);
      onClose();
    } else {
      showError('Please enter a valid 6-digit pincode');
    }
  };

  const handleDetectLocation = () => {
    onSelectLocation({
      city: 'Bengaluru',
      pincode: '560034',
      time: '12 Mins (Superfast)'
    });
    showSuccess('Location detected: Bengaluru (560034)');
    onClose();
  };

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '520px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Choose Delivery Location</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Select your Indian city or enter 6-digit Pincode for 15-min Kirana delivery
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Detect Current Location Button */}
        <button
          onClick={handleDetectLocation}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#ecfdf5',
            border: '1.5px solid #10b981',
            borderRadius: '12px',
            color: '#065f46',
            fontWeight: 600,
            fontSize: '0.95rem',
            marginBottom: '18px',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Navigation size={18} color="#10b981" />
            <span>Detect My Current Location</span>
          </div>
          <span style={{ fontSize: '0.75rem', background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '6px' }}>
            GPS Auto
          </span>
        </button>

        {/* Pincode Search */}
        <form onSubmit={handlePincodeSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Enter 6-digit Indian Pincode (e.g. 560034)"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 16px' }}>
            Check
          </button>
        </form>

        {/* City Filter Search */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search popular Indian cities or localities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px 8px 34px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.85rem',
              backgroundColor: '#f8fafc'
            }}
          />
        </div>

        {/* Cities Grid */}
        <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredCities.map((city) => {
            const isSelected = selectedLocation?.city === city.name;
            return (
              <div
                key={city.name}
                onClick={() => {
                  onSelectLocation({
                    city: city.name,
                    pincode: 'Deliver to Area',
                    time: city.time
                  });
                  showSuccess(`Delivery location set to ${city.name}`);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: isSelected ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{city.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{city.area}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', background: '#d1fae5', padding: '2px 6px', borderRadius: '4px' }}>
                    ⚡ {city.time}
                  </span>
                  {isSelected && <Check size={16} color="#10b981" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
