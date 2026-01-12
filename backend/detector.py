import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

class FraudDetector:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = None
    
    def analyze(self, df):
        """Main analysis function"""
        
        # Prepare features
        feature_cols = ['Amount']
        if 'Time' in df.columns:
            df['Hour'] = (df['Time'] / 3600) % 24
            feature_cols.append('Hour')
        
        # Add V columns if they exist (Kaggle dataset)
        v_cols = [col for col in df.columns if col.startswith('V')]
        feature_cols.extend(v_cols[:5])  # Use first 5 V columns only
        
        X = df[feature_cols].copy()
        
        # Handle missing values
        X = X.fillna(X.mean())
        
        # Normalize
        X_scaled = self.scaler.fit_transform(X)
        
        # Train Isolation Forest
        self.model = IsolationForest(
            contamination=0.1,  # Expect 10% fraud
            random_state=42,
            n_estimators=100
        )
        predictions = self.model.fit_predict(X_scaled)
        scores = self.model.decision_function(X_scaled)
        
        # Convert to risk scores (0-100)
        ml_scores = self._normalize_scores(scores)
        
        # Rule-based detection
        rule_scores = self._apply_rules(df)
        
        # Combine scores (60% rules, 40% ML)
        final_scores = (rule_scores * 0.6) + (ml_scores * 0.4)
        
        # Add results to dataframe
        df['ml_score'] = ml_scores
        df['rule_score'] = rule_scores
        df['risk_score'] = final_scores
        df['is_suspicious'] = final_scores > 50
        
        # Generate reasons
        df['reasons'] = df.apply(lambda row: self._get_reasons(row), axis=1)
        
        # Classification
        df['risk_level'] = pd.cut(
            df['risk_score'],
            bins=[0, 25, 50, 75, 100],
            labels=['Low', 'Medium', 'High', 'Critical']
        )
        
        # Summary statistics
        suspicious = df[df['is_suspicious']]
        
        # Format transactions for frontend
        transactions_list = []
        for idx, row in df.iterrows():
            transactions_list.append({
                'id': row.get('transaction_id', f'T{idx:03d}'),
                'amount': float(row['Amount']),
                'riskScore': int(row['risk_score']),
                'riskLevel': str(row['risk_level']),
                'reasons': row['reasons'].split(' | ') if isinstance(row['reasons'], str) else [row['reasons']]
            })
        
        # Risk distribution for pie chart
        risk_counts = df['risk_level'].value_counts().to_dict()
        risk_distribution = [
            {'name': 'Low', 'value': int(risk_counts.get('Low', 0)), 'color': 'hsl(150 70% 45%)'},
            {'name': 'Medium', 'value': int(risk_counts.get('Medium', 0)), 'color': 'hsl(40 95% 55%)'},
            {'name': 'High', 'value': int(risk_counts.get('High', 0)), 'color': 'hsl(25 95% 55%)'},
            {'name': 'Critical', 'value': int(risk_counts.get('Critical', 0)), 'color': 'hsl(0 85% 55%)'}
        ]
        
        # Fraud comparison for bar chart (simplified)
        fraud_comparison = [
            {'name': 'Analysis', 'fraudulent': int(len(suspicious)), 'normal': int(len(df) - len(suspicious))}
        ]
        
        return {
            'transactions': transactions_list,
            'statistics': {
                'totalTransactions': int(len(df)),
                'suspiciousCount': int(len(suspicious)),
                'fraudRate': round(len(suspicious) / len(df) * 100, 1),
                'totalAtRisk': float(suspicious['Amount'].sum())
            },
            'riskDistribution': risk_distribution,
            'fraudComparison': fraud_comparison
        }
    
    def _normalize_scores(self, scores):
        """Convert ML scores to 0-100 range"""
        # Isolation Forest returns negative scores (more negative = more anomalous)
        normalized = (1 - (scores - scores.min()) / (scores.max() - scores.min())) * 100
        return normalized.clip(0, 100)
    
    def _apply_rules(self, df):
        """Rule-based detection"""
        scores = np.zeros(len(df))
        
        avg_amount = df['Amount'].mean()
        
        for idx, row in df.iterrows():
            score = 0
            
            # Rule 1: Large amount outlier
            if row['Amount'] > avg_amount * 3:
                score += 40
            
            # Rule 2: Very small amount
            if row['Amount'] < 1:
                score += 30
            
            # Rule 3: Round numbers
            if row['Amount'] > 100 and row['Amount'] % 100 == 0:
                score += 20
            
            # Rule 4: Unusual time (if available)
            if 'Hour' in df.columns:
                hour = row.get('Hour', 12)
                if hour < 6 or hour > 22:  # Late night
                    score += 25
            
            scores[idx] = min(score, 100)
        
        return scores
    
    def _get_reasons(self, row):
        """Generate explanation for flagging"""
        reasons = []
        
        # Check specific rule triggers
        if row['Amount'] < 1:
            reasons.append(f"Micro-transaction: ${row['Amount']:.2f}")
        elif row['Amount'] > 5000:
            reasons.append(f"Large amount: ${row['Amount']:.2f}")
        
        if row['Amount'] % 100 == 0 and row['Amount'] > 100:
            reasons.append("Suspicious round number")
        
        # Check for late night if hour available
        if 'Hour' in row.index:
            hour = row.get('Hour', 12)
            if hour < 6 or hour > 22:
                reasons.append(f"Late night transaction ({int(hour)}:00)")
        
        # ML pattern detection
        if row['ml_score'] > 70:
            reasons.append("ML detected unusual pattern")
        elif row['ml_score'] > 50:
            reasons.append("Anomalous transaction behavior")
        
        # Overall risk assessment
        if row['risk_score'] > 75:
            reasons.append("Critical risk level")
        elif row['risk_score'] > 50 and not reasons:
            reasons.append("Multiple risk indicators detected")
        
        # Default for truly normal transactions
        if not reasons:
            reasons.append("Normal transaction")
        
        return ' | '.join(reasons)