// frontend/src/components/ResultsDisplay.jsx
import React from 'react';

function ResultsDisplay({ results }) {
    if (!results) {
        return <p>Loading results...</p>;
    }

    const renderPaliers = (paliers) => {
        return Object.entries(paliers)
            .map(([level, score]) => `P${level}: ${score}/9`)
            .join(' | ');
    };

    return (
        <div style={styles.resultsContainer}>
            <h2>Diagnostic Results</h2>

            <div style={styles.summarySection}>
                <p><strong>Overall Profile:</strong> {results.profile_name} (Level {results.profile_level})</p>
                <p><strong>Global Score:</strong> {results.global_score}%</p>
            </div>

            {results.digital_gaps && results.digital_gaps.length > 0 && (
                <div style={styles.gapsSection}>
                    <h3>🚨 Digital Gaps (Areas to Improve)</h3>
                    <ul>
                        {results.digital_gaps.map((gap, index) => (
                            <li key={index}>
                                <strong>{gap.dimension}:</strong> Currently at Level {gap.palier_atteint} (Target: Level {gap.palier_cible})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={styles.dimensionsSection}>
                <h3>Dimension Scores</h3>
                {Object.entries(results.dimension_results).map(([name, data]) => (
                    <div key={name} style={styles.dimensionItem}>
                        <h4>{name} ({data.score_percent}%)</h4>
                        <p style={styles.palierScores}>Scores per Palier: {renderPaliers(data.paliers)}</p>
                        <p><small>(Achieved Level: {data.palier_atteint})</small></p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Styles bassita
const styles = {
    resultsContainer: {
        padding: '20px',
        borderTop: '1px solid #eee',
        marginTop: '10px',
        backgroundColor: '#fff',
    },
    summarySection: {
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px dashed #ccc',
    },
    gapsSection: {
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#fff0f0', // Light red background for attention
        border: '1px solid #fcc',
        borderRadius: '5px',
    },
    dimensionsSection: {
        marginTop: '20px',
    },
    dimensionItem: {
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee',
    },
    palierScores: {
        fontSize: '0.9em',
        color: '#444',
    },
};


export default ResultsDisplay;