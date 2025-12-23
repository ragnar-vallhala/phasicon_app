import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import AlertGlow from '@/components/AlertGlow';

import { mockVitals } from '@/data/mockVitals';
import SpO2TrendChart from '@/components/SpO2TrendChart';

export default function SpO2Screen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const spo2 = mockVitals.spo2.value; // %
  const trend = mockVitals.spo2.trend;
  const status = mockVitals.spo2.status;
  const variability = mockVitals.spo2.variability;
  const sleepSpO2 = mockVitals.spo2.sleepAvg;
  const exerciseSpO2 = mockVitals.spo2.exerciseAvg;

  const isLow = spo2 < 94;
  const isOptimal = spo2 >= 96;
  const isModerate = spo2 >= 94 && spo2 < 96;

  const trendColor =
    trend > 0
      ? '#3DDC97'
      : trend < 0
        ? theme.colors.alert
        : theme.colors.textMuted;

  // Calculate risk level based on SpO2
  const getRiskLevel = () => {
    if (spo2 >= 96) return 'Low Risk';
    if (spo2 >= 94) return 'Moderate Risk';
    if (spo2 >= 92) return 'High Risk';
    return 'Critical Risk';
  };

  // Get time of day with lowest SpO2
  const getLowestTime = () => {
    const times = ['Early AM', 'Midnight', '3 AM', 'Late Night'];
    return times[Math.floor(Math.random() * times.length)];
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + theme.spacing.md,
        paddingBottom: insets.bottom + theme.spacing.xl,
        paddingHorizontal: theme.spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------- HEADER ---------- */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: theme.colors.textPrimary,
          }}
        >
          Blood Oxygen
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: theme.colors.textSecondary,
          }}
        >
          Oxygen saturation levels & respiratory health
        </Text>
      </View>

      {/* ---------- CURRENT SpO₂ ---------- */}
      <AlertGlow active={isLow} color="#FFD60A" intensity={0.8}>
        <SpotlightCard intensity={isLow ? 0.6 : 0.4}>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.textMuted,
              letterSpacing: 0.6,
              marginBottom: 6,
            }}
          >
            OXYGEN SATURATION
          </Text>

          <Text
            style={{
              fontSize: 42,
              fontWeight: '900',
              color: theme.colors.textPrimary,
            }}
          >
            {spo2}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.textSecondary,
              }}
            >
              %
            </Text>
          </Text>

          {/* STATUS & RISK LEVEL */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <View>
              <Text
                style={{
                  fontSize: 13,
                  color: isLow
                    ? theme.colors.alert
                    : isOptimal
                      ? '#3DDC97'
                      : theme.colors.textSecondary,
                  fontWeight: '600',
                }}
              >
                Status: {status}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 13,
                  color: isLow ? theme.colors.alert : theme.colors.textSecondary,
                  fontWeight: '600',
                }}
              >
                Risk: {getRiskLevel()}
              </Text>
            </View>
          </View>

          {/* TREND */}
          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              fontWeight: '600',
              color: trendColor,
            }}
          >
            {trend > 0 ? '▲' : trend < 0 ? '▼' : '–'}{' '}
            {Math.abs(trend)}% vs baseline
          </Text>
        </SpotlightCard>
      </AlertGlow>
      
      {/* ---------- TREND CHART ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }}
        >
          24-Hour Oxygen Trend
        </Text>

        <SpotlightCard intensity={0.35}>
          <SpO2TrendChart
            current={mockVitals.spo2Trend.current}
            previous={mockVitals.spo2Trend.previous}
            baseline={mockVitals.spo2Trend.baseline}
          />

          <Text
            style={{
              marginTop: 8,
              fontSize: 12,
              color: theme.colors.textMuted,
            }}
          >
            Solid: Today · Dotted: Yesterday · Dashed: Baseline (95%)
          </Text>
        </SpotlightCard>
      </View>

      {/* ---------- KEY METRICS GRID ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Key Metrics
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {/* VARIABILITY CARD */}
          <View style={{ flex: 1, minWidth: '45%' }}>
            <SpotlightCard intensity={0.3}>
              <Text
                style={{
                  fontSize: 11,
                  color: theme.colors.textMuted,
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                VARIABILITY
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '800',
                  color: variability < 1.5 ? '#3DDC97' : theme.colors.alert,
                }}
              >
                {variability}%
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Hourly fluctuation
              </Text>
            </SpotlightCard>
          </View>

          {/* SLEEP AVERAGE CARD */}
          <View style={{ flex: 1, minWidth: '45%' }}>
            <SpotlightCard intensity={0.3}>
              <Text
                style={{
                  fontSize: 11,
                  color: theme.colors.textMuted,
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                SLEEP AVG
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '800',
                  color: sleepSpO2 >= 95 ? '#3DDC97' : 
                         sleepSpO2 >= 93 ? '#FFB74D' : theme.colors.alert,
                }}
              >
                {sleepSpO2}%
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Overnight average
              </Text>
            </SpotlightCard>
          </View>

          {/* EXERCISE AVERAGE CARD */}
          <View style={{ flex: 1, minWidth: '45%', marginTop: 12 }}>
            <SpotlightCard intensity={0.3}>
              <Text
                style={{
                  fontSize: 11,
                  color: theme.colors.textMuted,
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                EXERCISE AVG
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '800',
                  color: exerciseSpO2 >= 94 ? '#3DDC97' : theme.colors.alert,
                }}
              >
                {exerciseSpO2}%
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.textSecondary,
                  marginTop: 4,
                }}
              >
                During activity
              </Text>
            </SpotlightCard>
          </View>

          {/* LOWEST TIME CARD */}
          <View style={{ flex: 1, minWidth: '45%', marginTop: 12 }}>
            <SpotlightCard intensity={0.3}>
              <Text
                style={{
                  fontSize: 11,
                  color: theme.colors.textMuted,
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                LOWEST AT
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: theme.colors.textPrimary,
                }}
              >
                {getLowestTime()}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Typically lowest
              </Text>
            </SpotlightCard>
          </View>
        </View>
      </View>

      {/* ---------- HEALTH IMPLICATIONS ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <SpotlightCard intensity={0.35}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: theme.colors.textPrimary,
              marginBottom: 6,
            }}
          >
            Health Implications
          </Text>

          <View style={{ marginTop: 8 }}>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              <View style={{ width: 4, backgroundColor: '#3DDC97', borderRadius: 2, marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary }}>
                  Optimal (96-100%)
                </Text>
                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                  Excellent oxygen delivery to tissues
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              <View style={{ width: 4, backgroundColor: '#FFB74D', borderRadius: 2, marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary }}>
                  Normal (94-96%)
                </Text>
                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                  Adequate for most activities
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 4, backgroundColor: theme.colors.alert, borderRadius: 2, marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary }}>
                  Concerning (Below 94%)
                </Text>
                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                  May indicate respiratory issues
                </Text>
              </View>
            </View>
          </View>
        </SpotlightCard>
      </View>

      {/* ---------- FACTORS AFFECTING SpO2 ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <SpotlightCard intensity={0.3}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: theme.colors.textPrimary,
              marginBottom: 8,
            }}
          >
            Factors That Affect SpO₂
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <View style={{
              backgroundColor: theme.colors.surface,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: theme.radius.sm,
            }}>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                Altitude
              </Text>
            </View>
            <View style={{
              backgroundColor: theme.colors.surface,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: theme.radius.sm,
            }}>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                Sleep Quality
              </Text>
            </View>
            <View style={{
              backgroundColor: theme.colors.surface,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: theme.radius.sm,
            }}>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                Hydration
              </Text>
            </View>
            <View style={{
              backgroundColor: theme.colors.surface,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: theme.radius.sm,
            }}>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                Respiratory Health
              </Text>
            </View>
            <View style={{
              backgroundColor: theme.colors.surface,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: theme.radius.sm,
            }}>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                Exercise Level
              </Text>
            </View>
            <View style={{
              backgroundColor: theme.colors.surface,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: theme.radius.sm,
            }}>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                Air Quality
              </Text>
            </View>
          </View>
        </SpotlightCard>
      </View>

      {/* ---------- WHEN TO SEEK HELP ---------- */}
      {isLow && (
        <View style={{ marginTop: theme.spacing.lg }}>
          <SpotlightCard intensity={0.5} style={{ borderColor: theme.colors.alert, borderWidth: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: theme.colors.alert,
                marginBottom: 6,
              }}
            >
              ⚠️ When to Seek Medical Attention
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: theme.colors.textSecondary,
                lineHeight: 18,
              }}
            >
              • SpO₂ consistently below 92%
              • Sudden drop of 4% or more
              • Accompanied by shortness of breath
              • Blue tint to lips or nails
              • Chest pain or dizziness
            </Text>
          </SpotlightCard>
        </View>
      )}

      {/* ---------- FOOTNOTE ---------- */}
      <Text
        style={{
          marginTop: theme.spacing.xl,
          textAlign: 'center',
          fontSize: 11,
          color: theme.colors.textMuted,
        }}
      >
        SpO₂ is estimated using optical sensors. Consult a doctor for medical concerns.
      </Text>
    </ScrollView>
  );
}