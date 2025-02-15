import React, { useState } from 'react';

const styles = {
  appContainer: {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  card: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #eee',
  },
  heading: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333',
  },
  cardContent: {
    padding: '1.5rem',
  },
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  templateButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'all 0.2s',
  },
  templateTitle: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
  },
  templateDescription: {
    color: '#666',
    fontSize: '0.9rem',
  },
  templateForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: 500,
    color: '#333',
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  select: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  primaryButton: {
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  secondaryButton: {
    background: 'none',
    border: '1px solid #007bff',
    color: '#007bff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  responseContainer: {
    background: '#f8f9fa',
    borderRadius: '4px',
    padding: '1rem',
    marginTop: '1rem',
  },
  responseContent: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.5,
  },
};

const AgenticMessenger = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userInput, setUserInput] = useState({});
  const [response, setResponse] = useState('');

  const templates = [
    {
      id: 'event-planner',
      template: 'Plan a {type} event at {place} with a budget of {budget}',
      fields: [
        { 
          key: 'type', 
          label: 'Event Type', 
          type: 'select', 
          options: ['wedding', 'corporate conference', 'birthday party', 'workshop', 'networking event'] 
        },
        { 
          key: 'place', 
          label: 'Venue/Location', 
          type: 'text' 
        },
        {
          key: 'date',
          label: 'Date',
          type: 'date'
        },
        {
          key: 'time',
          label: 'Time',
          type: 'time'
        },
        { 
          key: 'budget', 
          label: 'Budget', 
          type: 'text',
          placeholder: 'e.g. $5000'
        },
        {
          key: 'attendees',
          label: 'Number of Attendees',
          type: 'number',
          placeholder: 'e.g. 100'
        }
      ],
      apiPrompt: (keywords) => `Act as an expert event planner. Create a detailed plan for a ${keywords.type} at ${keywords.place} on ${keywords.date} at ${keywords.time} with a budget of ${keywords.budget} for ${keywords.attendees} attendees. Include recommendations for:
1. Venue setup and layout
2. Timeline of activities
3. Catering and refreshments
4. Equipment and supplies needed
5. Staffing requirements
6. Budget breakdown
7. Additional considerations specific to this type of event`
    }
  ];

  const handleInputChange = (field, value) => {
    setUserInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateResponse = async () => {
    const template = templates.find(t => t.id === selectedTemplate);
    const customPrompt = template.apiPrompt(userInput);
    setResponse(`Generated response using prompt: ${customPrompt}`);
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h1 style={styles.heading}>Event Planning Assistant</h1>
        </div>
        <div style={styles.cardContent}>
          {!selectedTemplate ? (
            <div style={styles.templateGrid}>
              {templates.map((template) => (
                <button
                  key={template.id}
                  style={styles.templateButton}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <span style={styles.templateTitle}>{template.title}</span>
                  <span style={styles.templateDescription}>{template.template}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={styles.templateForm}>
              <div style={styles.formHeader}>
                <h2 style={styles.heading}>{templates.find(t => t.id === selectedTemplate).title}</h2>
              </div>
              
              <div style={styles.formFields}>
                {templates
                  .find(t => t.id === selectedTemplate)
                  .fields.map((field) => (
                    <div key={field.key} style={styles.formGroup}>
                      <label style={styles.label}>{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          style={styles.select}
                          value={userInput[field.key] || ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map(option => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          style={styles.input}
                          value={userInput[field.key] || ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
              </div>

              <button
                style={{
                  ...styles.primaryButton,
                  opacity: Object.keys(userInput).length ? 1 : 0.6,
                  cursor: Object.keys(userInput).length ? 'pointer' : 'not-allowed',
                }}
                onClick={generateResponse}
                disabled={!Object.keys(userInput).length}
              >
                Generate Event Plan
              </button>

              {response && (
                <div style={styles.responseContainer}>
                  <div style={styles.responseContent}>
                    {response}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgenticMessenger;