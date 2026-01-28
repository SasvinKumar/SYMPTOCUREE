async function analyzeSymptoms(symptoms, age, gender) {
    const symptomList = symptoms.toLowerCase().split(',').map(s => s.trim());
    const rules = getMedicalRules();
    
    let related = new Set(), conditions = new Set(), meds = [];
    
    symptomList.forEach(symptom => {
        if (rules[symptom]) {
            const rule = rules[symptom];
            rule.related.forEach(r => related.add(r));
            rule.conditions.forEach(c => conditions.add(c));
            
            if (rule.meds[age]) {
                meds.push(rule.meds[age]);
            }
        }
    });
    
    return {
        confidence: 92,
        profile: { age, gender },
        relatedSymptoms: Array.from(related),
        conditions: Array.from(conditions),
        medications: meds.slice(0, 3)
    };
}

function getMedicalRules() {
    return {
        'runny nose': {
            related: ['sneezing', 'sore throat'],
            conditions: ['Common Cold'],
            meds: {
                '1-15': {name: 'Sinarest Syrup', dosage: '5ml/6hr', notes: 'Max 4 doses'},
                '16-25': {name: 'Sinarest Tablet', dosage: '1 tab/6hr', notes: 'Max 4 tabs'},
                '26-35': {name: 'Cetzine 10mg', dosage: '1 tab night', notes: 'Warm water'}
            }
        },
        'sore throat': {
            related: ['fever', 'swallowing pain'],
            conditions: ['Tonsillitis'],
            meds: {
                '1-15': {name: 'Azithral Syrup', dosage: '5ml daily', notes: '5 days'},
                '16-25': {name: 'Azithral 500mg', dosage: '1 tab daily', notes: '5 days'}
            }
        },
        'fever': {
            related: ['chills', 'headache'],
            conditions: ['Viral Fever'],
            meds: {
                '1-15': {name: 'Crocin Syrup', dosage: '5-10ml/6hr', notes: 'Max 5 doses'},
                '16-25': {name: 'Crocin 500mg', dosage: '1 tab/6hr', notes: 'Max 4 tabs'}
            }
        }
    };
}

module.exports = { analyzeSymptoms };
