# GA4 UTM Builder - QA Test Plan

## 1. Dropdown Component Testing

### Source Dropdown
- [ ] Scroll through all source categories (Search, Social, Shopping, Video)
- [ ] Search for specific sources (e.g., "google", "facebook")
- [ ] Add custom source value
- [ ] Clear selected source
- [ ] Test with channel filter active vs. inactive

### Medium Dropdown  
- [ ] Scroll through all medium options
- [ ] Test standard mediums (cpc, organic, email, social)
- [ ] Add custom medium value
- [ ] Verify medium filtering when channel is selected

## 2. Channel Prediction Testing

### Test Cases
```
Source: google, Medium: cpc → Expected: Paid Search
Source: google, Medium: organic → Expected: Organic Search  
Source: facebook, Medium: social → Expected: Organic Social
Source: facebook, Medium: cpc → Expected: Paid Social
Source: (direct), Medium: (none) → Expected: Direct
Source: amazon, Medium: cpc → Expected: Paid Shopping
Source: youtube, Medium: video → Expected: Organic Video
```

### Edge Cases
- [ ] Empty source/medium
- [ ] Special characters in parameters
- [ ] Very long parameter values
- [ ] Mixed case values

## 3. URL Generation & Validation

### Basic URL Generation
- [ ] Generate URL with minimal parameters (source, medium, campaign)
- [ ] Generate URL with all optional parameters
- [ ] Test with base URL containing existing query parameters
- [ ] Test with base URL without protocol

### Space Encoding
- [ ] Test "Encode (%20)" option
- [ ] Test "Plus (+)" option  
- [ ] Test "Underscore (_)" option
- [ ] Verify encoding applies to all parameters

### URL Validation
- [ ] Test invalid base URLs
- [ ] Test URLs over 2000 characters
- [ ] Test with special characters: < > ' "
- [ ] Test with international characters

## 4. Configuration Management

### Save/Load
- [ ] Save configuration with custom name
- [ ] Load saved configuration
- [ ] Delete saved configuration
- [ ] Test with multiple saved configurations

### Import/Export
- [ ] Export current configuration
- [ ] Import previously exported configuration
- [ ] Test with corrupted import file
- [ ] Test cross-browser compatibility

### Persistence
- [ ] Refresh page and verify data persists
- [ ] Close/reopen browser tab
- [ ] Test in incognito mode

## 5. URL Analysis Feature

### Valid URLs
- [ ] Analyze URL with standard UTM parameters
- [ ] Analyze URL with custom parameters
- [ ] Analyze URL with encoded characters
- [ ] Test channel prediction accuracy

### Invalid URLs
- [ ] Test with malformed URLs
- [ ] Test with missing protocols
- [ ] Test with empty URL input

## 6. User Interface Testing

### Responsive Design
- [ ] Test on mobile devices (320px width)
- [ ] Test on tablets (768px width)
- [ ] Test on desktop (1200px+ width)
- [ ] Test accordion expand/collapse

### Accessibility
- [ ] Tab navigation through all form fields
- [ ] Screen reader compatibility
- [ ] Keyboard shortcuts (Ctrl+C, Ctrl+S, etc.)
- [ ] Focus indicators visible

### Dark Mode
- [ ] Toggle between light/dark themes
- [ ] Verify all components render correctly
- [ ] Test contrast ratios

## 7. Performance Testing

### Load Times
- [ ] Initial page load under 3 seconds
- [ ] Dropdown opening under 200ms
- [ ] URL generation under 100ms

### Memory Usage
- [ ] No memory leaks after extended use
- [ ] Efficient handling of large dropdown lists

## 8. Error Handling

### Network Issues
- [ ] Test with slow network connection
- [ ] Test offline functionality

### Data Corruption
- [ ] Test with corrupted localStorage data
- [ ] Test with invalid configuration imports

## 9. Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Samsung Internet

## 10. Integration Testing

### Copy Functionality
- [ ] Copy URL to clipboard
- [ ] Verify copied content matches displayed URL
- [ ] Test on different operating systems

### External Links
- [ ] Verify help documentation links work
- [ ] Test tutorial video modal
- [ ] Check resource links open in new tabs

## Bug Report Template

```
**Bug Title:** [Brief description]
**Severity:** Critical/High/Medium/Low
**Browser:** [Browser name and version]
**Device:** [Desktop/Mobile/Tablet]
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:** 
**Actual Result:** 
**Screenshots:** [If applicable]
**Additional Notes:** 
```

## Test Environment Setup

1. Clear browser cache and localStorage
2. Test with fresh browser session
3. Use browser developer tools to monitor console errors
4. Test with various screen resolutions
5. Verify no JavaScript errors in console

## Success Criteria

- [ ] All core functionality works without errors
- [ ] UI is responsive across all device sizes
- [ ] Performance meets specified benchmarks
- [ ] Accessibility standards are met
- [ ] Cross-browser compatibility confirmed
- [ ] No data loss during normal operations