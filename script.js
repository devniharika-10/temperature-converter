// Temperature Converter with Dark/Light Theme
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const tempInput = document.getElementById('tempInput');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const convertBtn = document.getElementById('convertBtn');
    const result = document.getElementById('result');
    const tempEmoji = document.getElementById('tempEmoji');
    const themeToggle = document.getElementById('themeToggle');

    // Conversion functions
    function convertTemperature(value, from, to) {
        // First convert to Celsius (standard unit)
        let celsius;
        
        switch(from) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
            default:
                celsius = value;
        }
        
        // Then convert from Celsius to target unit
        switch(to) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return (celsius * 9/5) + 32;
            case 'kelvin':
                return celsius + 273.15;
            default:
                return celsius;
        }
    }

    // Get appropriate emoji based on temperature (in Celsius)
    function getTempEmoji(temp, unit) {
        // Convert to Celsius for consistent emoji selection
        let celsiusTemp;
        
        switch(unit) {
            case 'fahrenheit':
                celsiusTemp = (temp - 32) * 5/9;
                break;
            case 'kelvin':
                celsiusTemp = temp - 273.15;
                break;
            default:
                celsiusTemp = temp;
        }
        
        if (celsiusTemp <= 0) return '❄️'; // Freezing
        if (celsiusTemp <= 10) return '🥶'; // Cold
        if (celsiusTemp <= 20) return '😐'; // Cool
        if (celsiusTemp <= 30) return '😊'; // Warm
        if (celsiusTemp <= 40) return '🥵'; // Hot
        return '🔥'; // Very Hot
    }

    // Format temperature with proper unit symbol
    function formatTemperature(value, unit) {
        const symbols = {
            celsius: '°C',
            fahrenheit: '°F',
            kelvin: 'K'
        };
        
        // Round to 2 decimal places
        const rounded = Math.round(value * 100) / 100;
        return `${rounded} ${symbols[unit]}`;
    }

    // Main conversion function
    function performConversion() {
        // Get input value
        let inputValue = parseFloat(tempInput.value);
        
        // Validate input
        if (isNaN(inputValue)) {
            result.textContent = 'Please enter a number';
            result.style.color = '#ff6b6b';
            return;
        }
        
        // Get selected units
        const from = fromUnit.value;
        const to = toUnit.value;
        
        // Perform conversion
        const convertedValue = convertTemperature(inputValue, from, to);
        
        // Display result
        result.textContent = formatTemperature(convertedValue, to);
        result.style.color = ''; // Reset color
        
        // Update emoji
        tempEmoji.textContent = getTempEmoji(inputValue, from);
        
        // Add animation
        result.style.animation = 'none';
        result.offsetHeight; // Trigger reflow
        result.style.animation = 'fadeIn 0.5s';
    }

    // Quick value setter
    window.setQuickValue = function(value) {
        tempInput.value = value;
        performConversion();
    };

    // Theme toggle functionality
    function toggleTheme() {
        document.body.classList.toggle('dark');
        
        // Update button text
        if (document.body.classList.contains('dark')) {
            themeToggle.textContent = '☀️ Light Mode';
        } else {
            themeToggle.textContent = '🌙 Dark Mode';
        }
        
        // Save preference to localStorage
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
    }

    // Check for saved theme preference
    function loadThemePreference() {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark');
            themeToggle.textContent = '☀️ Light Mode';
        }
    }

    // Add keyboard support (Enter key)
    tempInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performConversion();
        }
    });

    // Add input validation
    tempInput.addEventListener('input', function() {
        // Remove any non-numeric characters except decimal and minus
        this.value = this.value.replace(/[^0-9.-]/g, '');
        
        // Ensure only one decimal point
        const parts = this.value.split('.');
        if (parts.length > 2) {
            this.value = parts[0] + '.' + parts.slice(1).join('');
        }
    });

    // Event listeners
    convertBtn.addEventListener('click', performConversion);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Also convert when selection changes (optional)
    fromUnit.addEventListener('change', performConversion);
    toUnit.addEventListener('change', performConversion);

    // Load saved theme
    loadThemePreference();

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Initial conversion (if there's a default value)
    if (tempInput.value) {
        performConversion();
    }

    console.log('Temperature Converter initialized successfully!');
});