export type ActivityBucket = 'active' | 'idle';

export const ACTIVITY_BUCKET: Record<string, ActivityBucket> = {
  // ---- IDLE ----
  sitting: 'idle',
  standing: 'idle',
  meditation: 'idle',
  yoga_poses: 'idle',
  stretching_leg: 'idle',
  upper_body_stretching: 'idle',
  Yoga_dataset_images: 'idle',
  Stationary_Actions: 'idle',

  // ---- ACTIVE ----
  Hand_Gestures_Only: 'active',
  Full_Body_Coordinated: 'active',
  Lower_Body_Dominant: 'active',
  Upper_Body_Dominant: 'active',

  arm_exercises: 'active',
  leg_exercises: 'active',
  boxing_movements: 'active',
  dance_movements: 'active',
  kicking_movements: 'active',
  locomotion: 'active',
  plyometric_exercises: 'active',
  olympic_lifts: 'active',
  throwing_actions: 'active',
};
