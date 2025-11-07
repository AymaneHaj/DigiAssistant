import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Target, AlertCircle, Trophy, TrendingUp, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import api from '../services/api';

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!id) {
        setError('Conversation ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch structured results from API
        const response = await api.get(`/api/v1/results/${id}/structured`);
        setResults(response.data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.response?.data?.detail || err.message || 'Failed to load results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-white to-[#F8F9FA] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-[#008C9E]/20 border-t-[#008C9E] rounded-full animate-spin mx-auto" />
          </div>
          <p className="text-lg font-medium text-[#343A40]">Loading your results...</p>
          <p className="text-sm text-[#5A5A5A] mt-2">Generating comprehensive report</p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-white to-[#F8F9FA] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-xl p-8 border border-red-200 text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-[#008C9E]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#343A40] mb-2">Unable to Load Results</h2>
            <p className="text-[#5A5A5A] mb-6">{error}</p>

            <motion.button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#008C9E] hover:bg-[#008C9E]/90 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              Back to Chat
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = results?.dimension_results ? Object.entries(results.dimension_results).map(([name, data]) => {
    const scoreValue = typeof data === 'number' ? data : (data?.score_percent || 0);
    return {
      name,
      score: scoreValue,
      color: scoreValue >= 80 ? 'text-green-600' : scoreValue >= 60 ? 'text-[#008C9E]' : 'text-[#008C9E]'
    };
  }) : [];

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-red-100 text-[#008C9E] border-red-200',
      'Intermediate': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Advanced': 'bg-green-100 text-green-700 border-green-200',
      'Expert': 'bg-[#008C9E]/10 text-[#008C9E] border-[#008C9E]/20'
    };
    return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F9FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#5A5A5A] hover:text-[#008C9E] transition-colors"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </motion.button>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#343A40]">Diagnostic Results</h1>
              <p className="text-[#5A5A5A] text-sm mt-1">Your digital maturity assessment report</p>
            </div>

            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Profile & Score Overview */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Card */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#008C9E]/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-[#008C9E]" />
              </div>
              <h2 className="text-xl font-bold text-[#343A40]">Maturity Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#5A5A5A] mb-2">Current Level</p>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border ${getLevelColor(results?.profile_level)}`}>
                  Level {results?.profile_level || "N/A"}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-[#5A5A5A] mb-2">Assessment Status</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Completed Successfully</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Global Score Card */}
          <motion.div
            className="bg-gradient-to-br from-[#008C9E] to-[#008C9E]/80 rounded-xl p-6 text-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Overall Score</h2>
            </div>
            <div className="text-5xl font-bold mb-4">{results?.global_score || 0}<span className="text-3xl text-white/80">/100</span></div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <motion.div
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${results?.global_score || 0}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-white/90">
              {results?.global_score >= 76 ? "Excellent! High digital maturity." :
                results?.global_score >= 51 ? "Good progress developing digital capabilities." :
                  "Room for improvement in key areas."}
            </p>
          </motion.div>
        </div>

        {/* Dimension Scores */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#008C9E]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#008C9E]" />
            </div>
            <h2 className="text-2xl font-bold text-[#343A40]">Dimension Scores</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {chartData.length > 0 ? chartData.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#008C9E]/30 hover:shadow-sm transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <span className="font-semibold text-[#343A40]">{item.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-[#008C9E] h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                  <span className={`font-bold ${item.color} min-w-[3rem] text-right`}>{item.score}%</span>
                </div>
              </motion.div>
            )) : <p className="text-[#5A5A5A] text-center py-8">No dimension scores available.</p>}
          </div>
        </motion.div>

        {/* Analyse des digital gaps - مثل التقرير */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#008C9E]/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[#008C9E]" />
            </div>
            <h2 className="text-2xl font-bold text-[#343A40]">Analyse des digital gaps</h2>
          </div>

          {/* Digital gaps identifiés */}
          {results?.digital_gaps && results.digital_gaps.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                <span>🚨</span>
                <span>Digital gaps identifiés (dimensions &lt; Palier {results?.profile_level}):</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {results.digital_gaps.map((gap, index) => {
                  const gapText = gap.palier_atteint < (results?.profile_level || 0) - 1
                    ? `${gap.dimension} (Palier ${gap.palier_atteint} → à renforcer fortement)`
                    : `${gap.dimension} (Palier ${gap.palier_atteint} → à faire progresser)`;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Target className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#343A40] text-sm">{gapText}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dimensions alignées au palier cible */}
          {(() => {
            const alignedDimensions = [];
            const targetLevel = results?.profile_level;
            
            console.log('[ResultsPage] Checking aligned dimensions:', {
              targetLevel,
              hasDimensions: !!results?.dimensions,
              hasDimensionResults: !!results?.dimension_results,
              dimensions: results?.dimensions,
              dimensionResults: results?.dimension_results
            });
            
            // Try dimensions array first (has achieved_level)
            if (results?.dimensions && targetLevel) {
              results.dimensions.forEach((dim) => {
                console.log(`[ResultsPage] Checking dimension ${dim.name}: achieved_level=${dim.achieved_level}, target=${targetLevel}`);
                if (dim.achieved_level === targetLevel) {
                  alignedDimensions.push(dim.name);
                }
              });
            }
            
            // Fallback: try dimension_results
            if (alignedDimensions.length === 0 && results?.dimension_results && targetLevel) {
              Object.entries(results.dimension_results).forEach(([dimName, data]) => {
                if (typeof data === 'object' && data !== null) {
                  const palierAtteint = data.palier_atteint || data.achieved_level;
                  console.log(`[ResultsPage] Checking dimension ${dimName} from dimension_results: palier_atteint=${palierAtteint}, target=${targetLevel}`);
                  if (palierAtteint === targetLevel) {
                    alignedDimensions.push(dimName);
                  }
                }
              });
            }
            
            console.log('[ResultsPage] Aligned dimensions found:', alignedDimensions);
            
            return alignedDimensions.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <span>✅</span>
                  <span>Dimensions alignées au palier cible:</span>
                </h3>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-semibold text-[#343A40]">{alignedDimensions.join(', ')}</p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <span>✅</span>
                  <span>Dimensions alignées au palier cible:</span>
                </h3>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-[#5A5A5A]">Aucune dimension n'est exactement alignée avec le niveau cible.</p>
                </div>
              </div>
            );
          })()}

          {/* Dimension dépassant le palier cible */}
          {(() => {
            const exceedingDimensions = [];
            const targetLevel = results?.profile_level;
            
            // Try dimensions array first (has achieved_level)
            if (results?.dimensions && targetLevel) {
              results.dimensions.forEach((dim) => {
                if (dim.achieved_level > targetLevel) {
                  exceedingDimensions.push({ name: dim.name, level: dim.achieved_level });
                }
              });
            }
            
            // Fallback: try dimension_results
            if (exceedingDimensions.length === 0 && results?.dimension_results && targetLevel) {
              Object.entries(results.dimension_results).forEach(([dimName, data]) => {
                if (typeof data === 'object' && data !== null) {
                  const palierAtteint = data.palier_atteint || data.achieved_level;
                  if (palierAtteint && palierAtteint > targetLevel) {
                    exceedingDimensions.push({ name: dimName, level: palierAtteint });
                  }
                }
              });
            }
            
            return exceedingDimensions.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-[#008C9E] mb-3 flex items-center gap-2">
                  <span>🌟</span>
                  <span>Dimension dépassant le palier cible:</span>
                </h3>
                <div className="space-y-2">
                  {exceedingDimensions.map((dim, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-[#008C9E]/5 rounded-lg border border-[#008C9E]/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <p className="font-semibold text-[#343A40]">
                        {dim.name} (Palier {dim.level}) – opportunité de capitalisation
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={async () => {
              try {
                console.log(`[ResultsPage] Downloading PDF for conversation: ${id}`);
                
                // Get token from Redux store (passed as prop)
                if (!token) {
                  throw new Error('Authentication required. Please login again.');
                }

                // Use fetch directly to have better control over blob handling
                const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const response = await fetch(`${API_BASE_URL}/api/v1/results/${id}/pdf`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                });

                console.log(`[ResultsPage] Response status: ${response.status}, type: ${response.headers.get('content-type')}`);

                if (!response.ok) {
                  // Try to parse error message
                  const errorText = await response.text();
                  let errorData;
                  try {
                    errorData = JSON.parse(errorText);
                  } catch {
                    errorData = { detail: errorText || `Server error: ${response.status}` };
                  }
                  throw new Error(errorData.detail || `Failed to download PDF: ${response.status}`);
                }

                const contentType = response.headers.get('content-type') || '';
                
                // Check if response is actually a PDF
                if (contentType && !contentType.includes('application/pdf')) {
                  const errorText = await response.text();
                  let errorData;
                  try {
                    errorData = JSON.parse(errorText);
                    throw new Error(errorData.detail || 'Server returned non-PDF response');
                  } catch (parseErr) {
                    throw new Error('Server returned non-PDF response. Please check backend logs.');
                  }
                }

                // Get blob from response - ensure it's treated as PDF
                const blob = await response.blob();
                
                if (!blob || blob.size === 0) {
                  throw new Error('PDF file is empty');
                }

                console.log(`[ResultsPage] PDF blob created, size: ${blob.size} bytes, type: ${blob.type}`);

                // Verify it's actually a PDF by checking the first bytes
                const arrayBuffer = await blob.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                const pdfHeader = String.fromCharCode(...uint8Array.slice(0, 4));
                
                if (pdfHeader !== '%PDF') {
                  console.error('[ResultsPage] Invalid PDF header:', pdfHeader);
                  throw new Error('Downloaded file is not a valid PDF. Please check backend logs.');
                }

                console.log('[ResultsPage] PDF header verified:', pdfHeader);

                // Create a new blob with explicit PDF type
                const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });

                // Create download link
                const url = window.URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `DigiAssistant_Report_${id}.pdf`);
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                
                // Clean up after a short delay
                setTimeout(() => {
                  if (document.body.contains(link)) {
                    document.body.removeChild(link);
                  }
                  window.URL.revokeObjectURL(url);
                }, 100);
                
                console.log(`[ResultsPage] PDF downloaded successfully`);
              } catch (err) {
                console.error('[ResultsPage] Error downloading PDF:', err);
                const errorMessage = err.message || 'Failed to download PDF. Please try again.';
                alert(`Error: ${errorMessage}\n\nPlease check the browser console and backend logs for more details.`);
              }
            }}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#008C9E] hover:bg-[#008C9E]/90 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>Download PDF Report</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/chat')}
            className="px-8 py-3 bg-white hover:bg-gray-50 text-[#343A40] rounded-lg font-semibold transition-all shadow-md hover:shadow-lg border border-gray-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Take Another Assessment
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}