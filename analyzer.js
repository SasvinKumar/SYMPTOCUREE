async function analyzeSymptoms(symptoms, ageCategory, gender) {
    const symptomList = symptoms.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    const rules = getMedicalDatabase();
    
    let relatedSymptoms = new Set();
    let conditions = new Set();
    let medications = [];
    
    // Analyze each symptom
    symptomList.forEach(symptom => {
        if (rules[symptom]) {
            const rule = rules[symptom];
            
            // Add related symptoms
            rule.related.forEach(r => relatedSymptoms.add(r));
            
            // Gender-specific conditions
            let finalConditions = [...rule.conditions];
            if (gender === 'female' && rule.femaleSpecific) {
                finalConditions.push(...rule.femaleSpecific);
            }
            if (gender === 'male' && rule.maleSpecific) {
                finalConditions.push(...rule.maleSpecific);
            }
            
            finalConditions.forEach(c => conditions.add(c));
            
            // Age-specific medication
            if (rule.meds[ageCategory]) {
                const ageMed = rule.meds[ageCategory];
                if (!medications.some(m => m.name === ageMed.name)) {
                    medications.push({
                        ...ageMed,
                        genderNote: rule.genderNotes?.[gender] || ''
                    });
                }
            }
        }
    });
    
    const matchedCount = symptomList.filter(s => rules[s]).length;
    const totalCount = symptomList.length;
    const confidence = Math.min(98, Math.max(25, (matchedCount / totalCount) * 85 + 15));
    
    return {
        success: true,
        confidence: confidence.toFixed(1),
        matchedSymptoms: matchedCount,
        totalSymptoms: totalCount,
        profile: { age: ageCategory, gender },
        relatedSymptoms: Array.from(relatedSymptoms),
        conditions: Array.from(conditions),
        medications: medications.slice(0, 5)
    };
}

function getMedicalDatabase() {
    return {
        // COMMON COLD & ALLERGY
        'runny nose': {
            related: ['sneezing', 'sore throat', 'mild fever', 'itchy eyes'],
            conditions: ['Common Cold', 'Allergic Rhinitis'],
            meds: {
                '0-5': {name: 'Sinarest Drops', dosage: '0.5ml every 6hrs', notes: 'Consult pediatrician'},
                '6-12': {name: 'Sinarest Syrup', dosage: '2.5ml every 6hrs', notes: 'Max 4 doses/day'},
                '13-18': {name: 'Sinarest Syrup', dosage: '5ml every 6hrs', notes: 'Max 4 doses/day'},
                '18-35': {name: 'Sinarest Tablet', dosage: '1 tab every 6hrs', notes: 'Max 4 tabs/day'},
                '36-55': {name: 'Sinarest Tablet', dosage: '1 tab every 6-8hrs', notes: 'Avoid alcohol'},
                '55-70': {name: 'Cetzine 10mg', dosage: '1 tab at night', notes: 'Monitor BP'},
                '70+': {name: 'Consult doctor', dosage: '', notes: 'Avoid self-medication'}
            }
        },
        'sneezing': {
            related: ['runny nose', 'itchy eyes', 'itchy throat'],
            conditions: ['Allergic Rhinitis', 'Common Cold'],
            meds: {
                '0-5': {name: 'Montair LC Drops', dosage: '0.5ml night', notes: 'Allergy relief'},
                '6-12': {name: 'Montair LC Kid Syrup', dosage: '5ml night', notes: 'Before sleep'},
                '13-18': {name: 'Montair LC Tablet', dosage: '1 tab night', notes: 'Non-drowsy'},
                '18-35': {name: 'Levocet 5mg', dosage: '1 tab night', notes: 'Non-drowsy'},
                '36-55': {name: 'Montair LC', dosage: '1 tab night', notes: 'Safe long-term'},
                '55-70': {name: 'Levocet 5mg', dosage: '1 tab night', notes: 'Monitor liver'},
                '70+': {name: 'Consult doctor', dosage: '', notes: 'Risk of confusion'}
            }
        },

        // RESPIRATORY
        'sore throat': {
            related: ['pain swallowing', 'fever', 'swollen tonsils'],
            conditions: ['Tonsillitis', 'Pharyngitis', 'Strep Throat'],
            meds: {
                '0-5': {name: 'Azithral Drops', dosage: '2.5ml once daily', notes: '5-day course'},
                '6-12': {name: 'Azithral Syrup 200mg', dosage: '5ml once daily', notes: '5-day course'},
                '13-18': {name: 'Azithral 200mg', dosage: '1 tab daily', notes: '5 days complete'},
                '18-35': {name: 'Azithral 500mg', dosage: '1 tab daily', notes: 'Complete course'},
                '36-55': {name: 'Azithral 500mg', dosage: '1 tab daily', notes: 'Complete course'},
                '55-70': {name: 'Azithral 250mg', dosage: '1 tab daily', notes: 'Monitor heart'},
                '70+': {name: 'Consult ENT', dosage: '', notes: 'Culture test needed'}
            }
        },
        'wheezing': {
            related: ['shortness of breath', 'chest tightness', 'coughing'],
            conditions: ['Asthma', 'Bronchitis'],
            meds: {
                '0-5': {name: 'Asthalin Nebulization', dosage: '1ml every 6hrs', notes: 'Emergency use only'},
                '6-12': {name: 'Asthalin Inhaler', dosage: '1 puff every 6hrs', notes: 'With spacer'},
                '13-18': {name: 'Asthalin Inhaler', dosage: '2 puffs every 6hrs', notes: 'Spacer recommended'},
                '18-35': {name: 'Foracort 200 Inhaler', dosage: '2 puffs twice daily', notes: 'Maintenance therapy'},
                '36-55': {name: 'Foracort 400 Inhaler', dosage: '1-2 puffs BD', notes: 'Peak flow monitoring'},
                '55-70': {name: 'Tiotropium Inhaler', dosage: 'Consult pulmonologist', notes: 'COPD evaluation'},
                '70+': {name: 'Emergency Hospital', dosage: '', notes: 'High risk condition'}
            }
        },

        // FEVER & PAIN
        'fever': {
            related: ['chills', 'headache', 'body pain', 'fatigue'],
            conditions: ['Viral Fever', 'Influenza'],
            meds: {
                '0-5': {name: 'Crocin Drops 100mg/ml', dosage: '0.5-1ml every 6hrs', notes: 'Max 5 doses/24hrs'},
                '6-12': {name: 'Crocin Syrup 120mg/5ml', dosage: '5-10ml every 6hrs', notes: 'Max 5 doses/24hrs'},
                '13-18': {name: 'Crocin 500mg', dosage: '1 tab every 6hrs', notes: 'Max 4 tabs/24hrs'},
                '18-35': {name: 'Dolo 650mg', dosage: '1 tab every 6hrs', notes: 'Stay hydrated'},
                '36-55': {name: 'Dolo 650mg', dosage: '1 tab every 6hrs', notes: 'Max 4g/day'},
                '55-70': {name: 'Crocin 500mg', dosage: '1 tab every 8hrs', notes: 'Monitor liver function'},
                '70+': {name: 'Crocin 500mg', dosage: '1 tab every 8-12hrs', notes: 'Consult geriatrician'}
            }
        },
        'headache': {
            related: ['dizziness', 'nausea', 'sensitivity to light'],
            conditions: ['Tension Headache', 'Migraine', 'Hypertension'],
            meds: {
                '0-5': {name: 'Consult pediatrician', dosage: '', notes: 'Rare in infants'},
                '6-12': {name: 'Crocin Syrup', dosage: '5-10ml every 6hrs', notes: 'Hydration first'},
                '13-18': {name: 'Crocin 500mg', dosage: '1 tab every 6hrs', notes: 'Avoid screens'},
                '18-35': {name: 'Saridon', dosage: '1 tab every 8hrs', notes: 'Max 3 tabs/day'},
                '36-55': {name: 'Combiflam', dosage: '1 tab every 8hrs', notes: 'Monitor BP'},
                '55-70': {name: 'Crocin 500mg', dosage: '1 tab every 8hrs', notes: 'Avoid NSAIDs'},
                '70+': {name: 'Consult doctor', dosage: '', notes: 'Check for stroke risk'}
            }
        }
    };
}

module.exports = { analyzeSymptoms };

