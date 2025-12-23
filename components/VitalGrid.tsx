import { View } from 'react-native';
import { useRouter } from 'expo-router';
import VitalCard from './VitalCard';
import { mockVitals } from '@/data/mockVitals';
import { VITAL_ROUTES, VitalLabel } from '@/utils/vitalRoutes';

export default function VitalGrid() {
  const router = useRouter();

  function goTo(label: VitalLabel) {
    const route = VITAL_ROUTES[label];
    router.push({
      pathname: route,
    });
  }

  return (
    <View style={{ gap: 12 }}>
      <Row>
        <VitalCard
          label="Heart Rate"
          {...mockVitals.heartRate}
          unit="bpm"
          onPress={() => goTo('Heart Rate')}
        />

        <VitalCard
          label="SpO₂"
          {...mockVitals.spo2}
          unit="%"
          onPress={() => goTo('SpO₂')}
        />
      </Row>

      <Row>
        <VitalCard
          label="GSR"
          {...mockVitals.gsr}
          unit="µS"
          onPress={() => goTo('GSR')}
        />

        <VitalCard
          label="Respiration"
          {...mockVitals.respiration}
          unit="br/min"
          onPress={() => goTo('Respiration')}
        />
      </Row>

      <Row>
        <VitalCard
          label="Temperature"
          {...mockVitals.temperature}
          unit="°C"
          onPress={() => goTo('Temperature')}
        />

        <VitalCard
          label="Steps"
          {...mockVitals.steps}
          unit="steps"
          onPress={() => goTo('Steps')}
        />
      </Row>
    </View>
  );
}

function Row({ children }: { children: React.ReactNode[] }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ flex: 1 }}>{children[0]}</View>
      <View style={{ flex: 1 }}>{children[1]}</View>
    </View>
  );
}
