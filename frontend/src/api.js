import axios from "axios";

export const analyzePrompt = async (prompt) => {
  const response = await axios.post("http://localhost:8000/analyze", {
    prompt,
  });
  return response.data;
};

export const fetchAnalytics = async () => {
    const response = await axios.get("http://localhost:8000/analytics");
    return response.data;
  };
  
