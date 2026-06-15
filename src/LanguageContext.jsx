import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    // Nav / Sidebar / Tabs
    dashboard: "Dashboard",
    "live-ops": "Live Tracking",
    "staff-registry": "Staff Registry",
    "guard-profiles": "Guard Profiles",
    "system-users": "System Access",
    incidents: "Incidents",
    circulars: "Circulars",
    "correction-requests": "Corrections",
    logout: "Logout",
    logged_in_as: "Logged in as",
    
    // Guard Tabs
    duty: "Duty Control",
    history: "Attendance",
    requests: "Issues",
    duty_desc: "Check In / Out",
    history_desc: "Your History",
    requests_desc: "Report Problem",
    incidents_desc: "Report Incidents",
    circulars_desc: "Announcements",
    
    // Status
    status: "Status",
    on_active_duty: "On Active Duty",
    off_duty: "Off Duty",
    duty_complete: "Duty Complete",
    time_on_duty: "Time on duty",
    allowed_radius: "Allowed radius",
    inside_zone: "Inside zone",
    outside_zone: "Outside zone",
    live_tracking_active: "Live Tracking Active",
    auto_pings: "Auto-pings every 5 minutes",
    ping_now: "Ping Now",
    guard_details: "Guard Details",
    name: "Name",
    today_location: "Today's Location",
    today: "Today",
    start_duty: "Start Duty",
    end_duty: "End Duty",
    
    // Notifications & Alert
    sos_panic_alert: "Emergency SOS Alert",
    acknowledge_alert: "Acknowledge Alert",
    received: "Received",
    
    // Panels & Headers
    duty_control: "Duty Control",
    attendance_history: "Attendance History",
    report_issue: "Report an Issue",
    past_requests: "Past Requests",
    official_announcements: "Official Announcements",
    records_found: "records found",
    no_attendance: "No attendance records yet",
    no_announcements: "No announcements yet",
    no_requests: "No past requests found",
    
    // Forms & Controls
    describe_problem: "Describe the problem",
    or_record_voice: "Or record a voice note",
    tap_to_record: "Tap mic to record",
    recording: "Recording... tap to stop",
    remove_recording: "Remove recording",
    submit_request: "Submit Request to Admin",
    submitting: "Submitting...",
    
    // Language Names
    select_language: "Select Language",
    english: "English",
    hindi: "Hindi (हिंदी)",
    tamil: "Tamil (தமிழ்)",
    telugu: "Telugu (తెలుగు)",
    kannada: "Kannada (ಕನ್ನಡ)"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    "live-ops": "लाइव ट्रैकिंग",
    "staff-registry": "कर्मचारी रजिस्ट्री",
    "guard-profiles": "गार्ड प्रोफाइल",
    "system-users": "सिस्टम एक्सेस",
    incidents: "घटनाएँ",
    circulars: "परिपत्र",
    "correction-requests": "सुधार अनुरोध",
    logout: "लॉगआउट",
    logged_in_as: "लॉग इन हैं:",
    
    duty: "ड्यूटी नियंत्रण",
    history: "उपस्थिति",
    requests: "समस्याएं",
    duty_desc: "चेक इन / आउट",
    history_desc: "आपका इतिहास",
    requests_desc: "समस्या रिपोर्ट करें",
    incidents_desc: "घटना रिपोर्ट करें",
    circulars_desc: "घोषणाएं",
    
    status: "स्थिति",
    on_active_duty: "सक्रिय ड्यूटी पर",
    off_duty: "ड्यूटी बंद",
    duty_complete: "ड्यूटी पूरी",
    time_on_duty: "ड्यूटी का समय",
    allowed_radius: "स्वीकृत दायरा",
    inside_zone: "ज़ोन के अंदर",
    outside_zone: "ज़ोन के बाहर",
    live_tracking_active: "लाइव ट्रैकिंग सक्रिय",
    auto_pings: "हर 5 मिनट में ऑटो-पिंग",
    ping_now: "अभी पिंग करें",
    guard_details: "गार्ड विवरण",
    name: "नाम",
    today_location: "आज का स्थान",
    today: "आज",
    start_duty: "ड्यूटी शुरू करें",
    end_duty: "ड्यूटी समाप्त करें",
    
    sos_panic_alert: "आपातकालीन एसओएस अलर्ट",
    acknowledge_alert: "अलर्ट स्वीकार करें",
    received: "प्राप्त हुआ",
    
    duty_control: "ड्यूटी नियंत्रण",
    attendance_history: "उपस्थिति इतिहास",
    report_issue: "समस्या की रिपोर्ट करें",
    past_requests: "पुराने अनुरोध",
    official_announcements: "आधिकारिक घोषणाएं",
    records_found: "रिकॉर्ड मिले",
    no_attendance: "अभी तक कोई उपस्थिति रिकॉर्ड नहीं है",
    no_announcements: "अभी तक कोई घोषणा नहीं है",
    no_requests: "कोई पुराना अनुरोध नहीं मिला",
    
    describe_problem: "समस्या का वर्णन करें",
    or_record_voice: "या एक वॉयस नोट रिकॉर्ड करें",
    tap_to_record: "रिकॉर्ड करने के लिए माइक टैप करें",
    recording: "रिकॉर्डिंग हो रही है... रोकने के लिए टैप करें",
    remove_recording: "रिकॉर्डिंग हटाएं",
    submit_request: "एडमिन को अनुरोध भेजें",
    submitting: "सबमिट किया जा रहा है...",
    
    select_language: "भाषा चुनें",
    english: "English",
    hindi: "Hindi (हिंदी)",
    tamil: "Tamil (தமிழ்)",
    telugu: "Telugu (తెలుగు)",
    kannada: "Kannada (ಕನ್ನಡ)"
  },
  ta: {
    dashboard: "டாஷ்போர்டு",
    "live-ops": "நேரடி கண்காணிப்பு",
    "staff-registry": "பணியாளர் பதிவேடு",
    "guard-profiles": "காவலர் சுயவிவரங்கள்",
    "system-users": "கணினி அணுகல்",
    incidents: "சம்பவங்கள்",
    circulars: "அறிவிப்புகள்",
    "correction-requests": "திருத்தங்கள்",
    logout: "வெளியேறு",
    logged_in_as: "உள்நுழைந்துள்ள பயனர்",
    
    duty: "பணி கட்டுப்பாடு",
    history: "வருகைப் பதிவு",
    requests: "சிக்கல்கள்",
    duty_desc: "வருகைப்பதிவு செய்யவும்/வெளியேறவும்",
    history_desc: "உங்கள் வரலாறு",
    requests_desc: "சிக்கலைப் புகாரளிக்கவும்",
    incidents_desc: "சம்பவத்தைப் புகாரளிக்கவும்",
    circulars_desc: "அறிவிப்புகள்",
    
    status: "நிலை",
    on_active_duty: "பணியில் உள்ளார்",
    off_duty: "பணியில் இல்லை",
    duty_complete: "பணி முடிந்தது",
    time_on_duty: "பணி நேரம்",
    allowed_radius: "அனுமதிக்கப்பட்ட ஆரம்",
    inside_zone: "எல்லைக்குள்",
    outside_zone: "எல்லைக்கு வெளியே",
    live_tracking_active: "நேரடி கண்காணிப்பு செயலில் உள்ளது",
    auto_pings: "ஒவ்வொரு 5 நிமிடத்திற்கும் தானியங்கி பிங்",
    ping_now: "இப்போது பிங் செய்",
    guard_details: "காவலர் விவரங்கள்",
    name: "பெயர்",
    today_location: "இன்றைய இடம்",
    today: "இன்று",
    start_duty: "பணியைத் தொடங்கு",
    end_duty: "பணியை முடி",
    
    sos_panic_alert: "அவசரகால SOS எச்சரிக்கை",
    acknowledge_alert: "எச்சரிக்கையை ஏற்றுக்கொள்",
    received: "பெறப்பட்டது",
    
    duty_control: "பணி கட்டுப்பாடு",
    attendance_history: "வருகைப் பதிவு வரலாறு",
    report_issue: "சிக்கலைப் புகாரளிக்கவும்",
    past_requests: "முந்தைய கோரிக்கைகள்",
    official_announcements: "அதிகாரப்பூர்வ அறிவிப்புகள்",
    records_found: "பதிவுகள் கண்டறியப்பட்டன",
    no_attendance: "வருகைப் பதிவுகள் எதுவும் இல்லை",
    no_announcements: "அறிவிப்புகள் எதுவும் இல்லை",
    no_requests: "முந்தைய கோரிக்கைகள் எதுவும் இல்லை",
    
    describe_problem: "சிக்கலை விவரிக்கவும்",
    or_record_voice: "அல்லது குரல் குறிப்பை பதிவு செய்யவும்",
    tap_to_record: "பதிவு செய்ய மைக்கை தட்டவும்",
    recording: "பதிவு செய்யப்படுகிறது... நிறுத்த தட்டவும்",
    remove_recording: "பதிவை நீக்கு",
    submit_request: "நிர்வாகிக்கு சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கப்படுகிறது...",
    
    select_language: "மொழியைத் தேர்ந்தெடுக்கவும்",
    english: "English",
    hindi: "Hindi (हिंदी)",
    tamil: "Tamil (தமிழ்)",
    telugu: "Telugu (తెలుగు)",
    kannada: "Kannada (ಕನ್ನಡ)"
  },
  te: {
    dashboard: "డ్యాష్‌బోర్డ్",
    "live-ops": "లైవ్ ట్రాకింగ్",
    "staff-registry": "సిబ్బంది రిజిస్ట్రీ",
    "guard-profiles": "గార్డు ప్రొఫైల్స్",
    "system-users": "సిస్టమ్ యాక్సెస్",
    incidents: "ఘటనలు",
    circulars: "సర్క్యులర్లు",
    "correction-requests": "సవరణలు",
    logout: "లాగ్అవుట్",
    logged_in_as: "లాగిన్ అయిన యూజర్",
    
    duty: "డ్యూటీ కంట్రోల్",
    history: "హాజరు",
    requests: "సమస్యలు",
    duty_desc: "చెక్ ఇన్ / అవుట్",
    history_desc: "మీ చరిత్ర",
    requests_desc: "సమస్యను నివేదించండి",
    incidents_desc: "ఘటనను నివేదించండి",
    circulars_desc: "ప్రకటనలు",
    
    status: "స్థితి",
    on_active_duty: "యాక్టివ్ డ్యూటీలో ఉన్నారు",
    off_duty: "డ్యూటీలో లేరు",
    duty_complete: "డ్యూటీ పూర్తయింది",
    time_on_duty: "డ్యూటీ సమయం",
    allowed_radius: "అనుమతించబడిన వ్యాసార్థం",
    inside_zone: "జోన్ లోపల",
    outside_zone: "జోన్ వెలుపల",
    live_tracking_active: "లైవ్ ట్రాకింగ్ యాక్టివ్‌గా ఉంది",
    auto_pings: "ప్రతి 5 నిమిషాలకు ఆటో-పింగ్",
    ping_now: "ఇప్పుడే పింగ్ చేయి",
    guard_details: "గార్డ్ వివరాలు",
    name: "పేరు",
    today_location: "నేటి స్థానం",
    today: "ఈరోజు",
    start_duty: "డ్యూటీ ప్రారంభించు",
    end_duty: "డ్యూటీ ముగించు",
    
    sos_panic_alert: "అత్యవసర SOS అలర్ట్",
    acknowledge_alert: "అలర్ట్‌ను అంగీకరించు",
    received: "అందుకున్నారు",
    
    duty_control: "డ్యూటీ కంట్రోల్",
    attendance_history: "హాజరు చరిత్ర",
    report_issue: "సమస్యను నివేదించండి",
    past_requests: "గత అభ్యర్థనలు",
    official_announcements: "అధికారిక ప్రకటనలు",
    records_found: "రికార్డులు కనుగొనబడ్డాయి",
    no_attendance: "ఇంకా హాజరు రికార్డులు లేవు",
    no_announcements: "ఇంకా ఎలాంటి ప్రకటనలు లేవు",
    no_requests: "గత అభ్యర్థనలు ఏవీ లేవు",
    
    describe_problem: "సమస్యను వివరించండి",
    or_record_voice: "లేదా వాయిస్ నోట్ రికార్డ్ చేయండి",
    tap_to_record: "రికార్డ్ చేయడానికి మైక్ నొక్కండి",
    recording: "రికార్డింగ్ అవుతోంది... ఆపడానికి నొక్కండి",
    remove_recording: "రికార్డింగ్ తీసివేయి",
    submit_request: "అడ్మిన్‌కు సమర్పించండి",
    submitting: "సమర్పిస్తున్నారు...",
    
    select_language: "భాషను ఎంచుకోండి",
    english: "English",
    hindi: "Hindi (हिंदी)",
    tamil: "Tamil (தமிழ்)",
    telugu: "Telugu (తెలుగు)",
    kannada: "Kannada (ಕನ್ನಡ)"
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "live-ops": "ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್",
    "staff-registry": "ಸಿಬ್ಬಂದಿ ನೋಂದಣಿ",
    "guard-profiles": "ಗಾರ್ಡ್ ಪ್ರೊಫೈಲ್‌ಗಳು",
    "system-users": "ಸಿಸ್ಟಂ ಪ್ರವೇಶ",
    incidents: "ಘಟನೆಗಳು",
    circulars: "ಸುತ್ತೋಲೆಗಳು",
    "correction-requests": "ತಿದ್ದುಪಡಿಗಳು",
    logout: "ಲಾಗ್ ಔಟ್",
    logged_in_as: "ಲಾಗಿನ್ ಆಗಿರುವ ಬಳಕೆದಾರ",
    
    duty: "ಕರ್ತವ್ಯ ನಿಯಂತ್ರಣ",
    history: "ಹಾಜರಾತಿ",
    requests: "ಸಮಸ್ಯೆಗಳು",
    duty_desc: "ಚೆಕ್ ಇನ್ / ಔಟ್",
    history_desc: "ನಿಮ್ಮ ಇತಿಹಾಸ",
    requests_desc: "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    incidents_desc: "ಘಟನೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    circulars_desc: "ಪ್ರಕಟಣೆಗಳು",
    
    status: "ಸ್ಥಿತಿ",
    on_active_duty: "ಸಕ್ರಿಯ ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ",
    off_duty: "ಕರ್ತವ್ಯದಲ್ಲಿ ಇಲ್ಲ",
    duty_complete: "ಕರ್ತವ್ಯ ಪೂರ್ಣಗೊಂಡಿದೆ",
    time_on_duty: "ಕರ್ತವ್ಯ ಸಮಯ",
    allowed_radius: "ಅನುಮತಿಸಲಾದ ತ್ರಿಜ್ಯ",
    inside_zone: "ವಲಯದ ಒಳಗೆ",
    outside_zone: "ವಲಯದಿಂದ ಹೊರಗೆ",
    live_tracking_active: "ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    auto_pings: "ಪ್ರತಿ 5 ನಿಮಿಷಕ್ಕೆ ಆಟೋ-ಪಿಂಗ್",
    ping_now: "ಈಗಲೇ ಪಿಂಗ್ ಮಾಡಿ",
    guard_details: "ಗಾರ್ಡ್ ವಿವರಗಳು",
    name: "ಹೆಸರು",
    today_location: "ಇಂದಿನ ಸ್ಥಳ",
    today: "ಇಂದು",
    start_duty: "ಕರ್ತವ್ಯ ಆರಂಭಿಸಿ",
    end_duty: "ಕರ್ತವ್ಯ ಮುಗಿಸಿ",
    
    sos_panic_alert: "ತುರ್ತು ಎಸ್‌ಒಎಸ್ ಅಲರ್ಟ್",
    acknowledge_alert: "ಅಲರ್ಟ್ ಅಂಗೀಕರಿಸಿ",
    received: "ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    
    duty_control: "ಕರ್ತವ್ಯ ನಿಯಂತ್ರಣ",
    attendance_history: "ಹಾಜರಾತಿ ಇತಿಹಾಸ",
    report_issue: "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    past_requests: "ಹಿಂದಿನ ವಿನಂತಿಗಳು",
    official_announcements: "ಅಧಿಕೃತ ಪ್ರಕಟಣೆಗಳು",
    records_found: "ದಾಖಲೆಗಳು ಪತ್ತೆಯಾಗಿವೆ",
    no_attendance: "ಹಾಜರಾತಿ ದಾಖಲೆಗಳು ಇನ್ನೂ ಇಲ್ಲ",
    no_announcements: "ಪ್ರಕಟಣೆಗಳು ಇನ್ನೂ ಇಲ್ಲ",
    no_requests: "ಹಿಂದಿನ ವಿನಂತಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    
    describe_problem: "ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ",
    or_record_voice: "ಅಥವಾ ಧ್ವನಿ ಟಿಪ್ಪಣಿ ರೆಕಾರ್ಡ್ ಮಾಡಿ",
    tap_to_record: "ರೆಕಾರ್ಡ್ ಮಾಡಲು ಮೈಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ",
    recording: "ರೆಕಾರ್ಡಿಂಗ್ ಆಗುತ್ತಿದೆ... ನಿಲ್ಲಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    remove_recording: "ರೆಕಾರ್ಡಿಂಗ್ ತೆಗೆದುಹಾಕಿ",
    submit_request: "ಅಡ್ಮಿನ್‌ಗೆ ಸಲ್ಲಿಸಿ",
    submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
    
    select_language: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    english: "English",
    hindi: "Hindi (हिंदी)",
    tamil: "Tamil (தமிழ்)",
    telugu: "Telugu (తెలుగు)",
    kannada: "Kannada (ಕನ್ನಡ)"
  }
};

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem("sg_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("sg_lang", locale);
  }, [locale]);

  const t = (key) => {
    const langDict = translations[locale] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
