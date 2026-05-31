const callGeminiAPI = async (prompt, expectJson = false) => {
  const apiKey = "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };
  
  if (expectJson) {
    payload.generationConfig = { responseMimeType: "application/json" };
  }
  
  let retries = 5;
  let delay = 1000;
  
  while (retries > 0) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return expectJson ? JSON.parse(text) : text;
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
};
export default callGeminiAPI;